import { sha256 } from '../utils/helpers.js';
import { analyzeDocumentQuality } from './qualityService.js';

export async function finalizeDocuments(
  n_api,
  rawDrafts
) {
  const inputSpecHash = await sha256(JSON.stringify(n_api));

  const meta = {
    trace_id: n_api.trace.uid,
    timestamp: new Date().toISOString(),
    input_spec_hash: inputSpecHash,
    warnings: [],
    errors: [],
  };

  let finalizedOutput = {
    beginner_doc_final: rawDrafts.beginner_doc ?? null,
    quick_start_doc_final: rawDrafts.quick_start_doc ?? null,
    security_doc_final: rawDrafts.security_doc ?? null,
    meta,
  };

  finalizedOutput = await analyzeDocumentQuality(rawDrafts, finalizedOutput);

  return finalizedOutput;
}
