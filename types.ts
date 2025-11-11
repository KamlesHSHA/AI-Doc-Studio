// types.ts

export interface N_API_Parameter {
  name: string;
  in: string;
  description: string | null;
  required: boolean;
  schema?: any;
}

export interface N_API_Endpoint {
  id: string;
  path: string;
  method: string;
  description: string | null;
  summary: string | null;
  parameters: N_API_Parameter[];
  responses: any;
}

export interface N_API {
  api_name: string | null;
  base_url: string | null;
  version: string | null;
  description: string | null;
  endpoints: N_API_Endpoint[];
  trace: {
    uid: string;
    timestamp: string;
  };
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: ValidationSeverity;
  message: string;
  path: string;
}

export interface ValidationReport {
  status: 'success' | 'warning' | 'error';
  detected_format: string;
  confidence: number;
  issues: ValidationIssue[];
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
  };
}

export interface AutoFixChange {
    path: string;
    description: string;
}

export interface AutoFixReport {
    status: 'success' | 'partial' | 'failed';
    summary: string;
    original_spec: string;
    fixed_spec: string;
    changes: AutoFixChange[];
}

export interface DocumentSection {
    title: string;
    content: string;
}

export interface Document {
    sections: DocumentSection[];
}

export interface RawDrafts {
    beginner_doc?: Document;
    quick_start_doc?: Document;
    security_doc?: Document;
}

export interface MetaReport {
    trace_id: string;
    timestamp: string;
    input_spec_hash: string;
    warnings: string[];
    errors: string[];
}

export interface FinalizedOutput {
    beginner_doc_final: Document | null;
    quick_start_doc_final: Document | null;
    security_doc_final: Document | null;
    meta: MetaReport;
}

export interface QualityReport {
    score: number;
    suggestions: string[];
    readability: any;
}