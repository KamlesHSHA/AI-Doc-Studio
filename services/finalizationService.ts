import { N_API, RawDrafts, FinalizedOutput, MetaReport } from '../types';
import { sha256 } from '../utils/helpers';
import { analyzeDocumentQuality } from './qualityService';

export async function finalizeDocuments(
  n_api: N_API,
  rawDrafts: RawDrafts
): Promise<FinalizedOutput> {
  const inputSpecHash = await sha256(JSON.stringify(n_api));

  const meta: MetaReport = {
    trace_id: n_api.trace.uid,
    timestamp: new Date().toISOString(),
    input_spec_hash: inputSpecHash,
    warnings: [],
    errors: [],
  };

  let finalizedOutput: FinalizedOutput = {
    beginner_doc_final: rawDrafts.beginner_doc ?? null,
    quick_start_doc_final: rawDrafts.quick_start_doc ?? null,
    security_doc_final: rawDrafts.security_doc ?? null,
    meta,
  };

  // Perform quality analysis
  finalizedOutput = await analyzeDocumentQuality(rawDrafts, finalizedOutput);

  return finalizedOutput;
}
