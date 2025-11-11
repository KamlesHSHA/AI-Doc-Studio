import { N_API, ValidationReport, ValidationIssue, N_API_Endpoint, N_API_Parameter } from '../types';
import { simpleHash } from '../utils/helpers';

type FormatDetectionResult = {
    format: 'openapi' | 'postman' | 'custom' | 'unknown';
    confidence: number;
};

// 1. FORMAT DETECTION
function detectFormat(spec: any): FormatDetectionResult {
    if (spec.openapi && typeof spec.openapi === 'string') {
        return { format: 'openapi', confidence: 0.9 };
    }
    if (spec.info && spec.info.schema && typeof spec.info.schema === 'string' && spec.info.schema.includes('postman')) {
        return { format: 'postman', confidence: 0.9 };
    }
    if (spec.swagger && typeof spec.swagger === 'string') {
        return { format: 'openapi', confidence: 0.8 }; // Swagger 2.0
    }
    if (spec.endpoints && Array.isArray(spec.endpoints)) {
        return { format: 'custom', confidence: 0.7 };
    }
    if (spec.item && Array.isArray(spec.item)) {
         return { format: 'postman', confidence: 0.7 };
    }
    // Fallback if no clear indicators
    return { format: 'unknown', confidence: 0.3 };
}

// 2. NORMALIZERS (one for each format)

function normalizeOpenAPI(spec: any, issues: ValidationIssue[]): Partial<N_API> {
    if (!spec.info) issues.push({ severity: 'error', message: "OpenAPI spec missing 'info' object.", path: 'root' });
    if (!spec.paths) issues.push({ severity: 'error', message: "OpenAPI spec missing 'paths' object.", path: 'root' });

    const endpoints: N_API_Endpoint[] = [];
    if (spec.paths) {
        for (const path in spec.paths) {
            for (const method in spec.paths[path]) {
                const endpointData = spec.paths[path][method];
                if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method.toLowerCase())) {
                    endpoints.push({
                        id: endpointData.operationId || `${method.toUpperCase()} ${path}`,
                        path,
                        method: method.toUpperCase(),
                        description: endpointData.description || null,
                        summary: endpointData.summary || null,
                        parameters: (endpointData.parameters as N_API_Parameter[]) || [],
                        responses: endpointData.responses || {},
                    });
                }
            }
        }
    }
    return {
        api_name: spec.info?.title || null,
        description: spec.info?.description || null,
        base_url: spec.servers?.[0]?.url || null,
        version: spec.info?.version || null,
        endpoints,
    };
}

function normalizePostman(spec: any, issues: ValidationIssue[]): Partial<N_API> {
    if (!spec.info) issues.push({ severity: 'error', message: "Postman collection missing 'info' object.", path: 'root' });
    if (!spec.item) issues.push({ severity: 'error', message: "Postman collection missing 'item' array.", path: 'root' });
    
    const endpoints: N_API_Endpoint[] = [];
    const baseUrl = ''; // Postman often has base URLs defined in variables, which is complex. Simplifying for now.

    function processItem(item: any) {
        if (item.request) { // It's an endpoint
            const url = item.request.url;
            const path = '/' + (Array.isArray(url.path) ? url.path.join('/') : url.path);
            endpoints.push({
                id: item.name || `${item.request.method} ${path}`,
                path: path,
                method: item.request.method.toUpperCase(),
                summary: item.name || null,
                description: item.request.description || null,
                parameters: url.query?.map((q: any) => ({ name: q.key, in: 'query', description: q.description || null, required: false })) || [],
                responses: {},
            });
        } else if (item.item) { // It's a folder
            item.item.forEach(processItem);
        }
    }

    spec.item?.forEach(processItem);
    
    return {
        api_name: spec.info?.name || null,
        description: spec.info?.description || null,
        base_url: baseUrl,
        version: null,
        endpoints,
    };
}

function normalizeCustom(spec: any, issues: ValidationIssue[]): Partial<N_API> {
     if (!spec.endpoints || !Array.isArray(spec.endpoints)) {
        issues.push({ severity: 'error', message: "Custom format requires an 'endpoints' array.", path: 'root' });
    }
    return {
        api_name: spec.api_name || null,
        description: spec.description || null,
        base_url: spec.base_url || null,
        version: spec.version || null,
        endpoints: spec.endpoints || [],
    };
}


// 3. MAIN ORCHESTRATOR
export async function ingestAndValidate(specInput: string): Promise<{ n_api: N_API, validation_report: ValidationReport }> {
  const issues: ValidationIssue[] = [];
  let parsedSpec: any;

  try {
    parsedSpec = JSON.parse(specInput);
  } catch (error) {
    const issue: ValidationIssue = { severity: 'error', message: 'Invalid JSON format.', path: 'root' };
    const report: ValidationReport = {
      status: 'error',
      detected_format: 'unknown',
      confidence: 0,
      issues: [issue],
      summary: { totalIssues: 1, errors: 1, warnings: 0, infos: 0 },
    };
    const dummy_n_api: N_API = {
        api_name: "Invalid Spec", base_url: null, version: null, description: null, endpoints: [],
        trace: { uid: 'error-' + Date.now(), timestamp: new Date().toISOString() }
    };
    return { n_api: dummy_n_api, validation_report: report };
  }

  const { format, confidence } = detectFormat(parsedSpec);
  let n_api_partial: Partial<N_API> = {};

  switch (format) {
    case 'openapi':
        n_api_partial = normalizeOpenAPI(parsedSpec, issues);
        break;
    case 'postman':
        n_api_partial = normalizePostman(parsedSpec, issues);
        break;
    case 'custom':
        n_api_partial = normalizeCustom(parsedSpec, issues);
        break;
    default:
        issues.push({ severity: 'error', message: 'Could not determine API specification format.', path: 'root' });
  }

  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const infos = issues.filter(i => i.severity === 'info').length;
  const status = errors > 0 ? 'error' : warnings > 0 ? 'warning' : 'success';
  
  const validation_report: ValidationReport = {
    status,
    detected_format: format,
    confidence,
    issues,
    summary: { totalIssues: issues.length, errors, warnings, infos },
  };
  
  const n_api: N_API = {
      api_name: n_api_partial.api_name || "Untitled API",
      base_url: n_api_partial.base_url || null,
      version: n_api_partial.version || null,
      description: n_api_partial.description || null,
      endpoints: n_api_partial.endpoints || [],
      trace: {
          uid: simpleHash(specInput),
          timestamp: new Date().toISOString()
      }
  };

  return { n_api, validation_report };
}