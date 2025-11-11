import React from 'react';
import { MetaReport } from '../types';
import { AlertTriangle, XCircle, Info } from './icons';

interface MetaReportViewProps {
  report: MetaReport | null;
}

export const MetaReportView: React.FC<MetaReportViewProps> = ({ report }) => {
  if (!report) {
    return (
       <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 dark:text-slate-400">
            <Info className="w-8 h-8 mb-2"/>
            <p>No meta data available.</p>
            <p className="text-xs">Generate documentation to see the report.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
        <details className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg" open>
            <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Generation Metadata</summary>
            <div className="font-mono text-slate-600 dark:text-slate-400 space-y-1 mt-2 text-xs">
                <p><strong>Trace ID:</strong> {report.trace_id}</p>
                <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
                <p><strong>Input Hash:</strong> <span className="break-all">{report.input_spec_hash}</span></p>
            </div>
        </details>
      
      {report.warnings.length > 0 && (
        <details className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg" open>
          <summary className="font-semibold cursor-pointer text-yellow-800 dark:text-yellow-300">Warnings ({report.warnings.length})</summary>
          <div className="mt-2 space-y-2">
            {report.warnings.map((warning, index) => (
              <div key={`warn-${index}`} className="flex items-start text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {report.errors.length > 0 && (
         <details className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg" open>
          <summary className="font-semibold cursor-pointer text-red-800 dark:text-red-300">Errors ({report.errors.length})</summary>
          <div className="mt-2 space-y-2">
            {report.errors.map((error, index) => (
              <div key={`err-${index}`} className="flex items-start text-red-700 dark:text-red-400">
                <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};