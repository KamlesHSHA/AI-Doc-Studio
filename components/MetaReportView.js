import React from 'react';
import { AlertTriangle, XCircle, Info } from './icons.js';

export const MetaReportView = ({ report }) => {
  if (!report) {
    return (
       React.createElement('div', { className: "flex flex-col items-center justify-center h-48 text-center text-slate-500 dark:text-slate-400" },
            React.createElement(Info, { className: "w-8 h-8 mb-2" }),
            React.createElement('p', null, "No meta data available."),
            React.createElement('p', { className: "text-xs" }, "Generate documentation to see the report.")
        )
    );
  }

  return (
    React.createElement('div', { className: "space-y-4 text-sm" },
        React.createElement('details', { className: "bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg", open: true },
            React.createElement('summary', { className: "font-semibold cursor-pointer text-slate-800 dark:text-slate-200" }, "Generation Metadata"),
            React.createElement('div', { className: "font-mono text-slate-600 dark:text-slate-400 space-y-1 mt-2 text-xs" },
                React.createElement('p', null, React.createElement('strong', null, "Trace ID:"), " ", report.trace_id),
                React.createElement('p', null, React.createElement('strong', null, "Timestamp:"), " ", new Date(report.timestamp).toLocaleString()),
                React.createElement('p', null, React.createElement('strong', null, "Input Hash:"), " ", React.createElement('span', { className: "break-all" }, report.input_spec_hash))
            )
        ),
      
      report.warnings.length > 0 && (
        React.createElement('details', { className: "bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg", open: true },
          React.createElement('summary', { className: "font-semibold cursor-pointer text-yellow-800 dark:text-yellow-300" }, `Warnings (${report.warnings.length})`),
          React.createElement('div', { className: "mt-2 space-y-2" },
            report.warnings.map((warning, index) => (
              React.createElement('div', { key: `warn-${index}`, className: "flex items-start text-yellow-700 dark:text-yellow-400" },
                React.createElement(AlertTriangle, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }),
                React.createElement('span', null, warning)
              )
            ))
          )
        )
      ),

      report.errors.length > 0 && (
         React.createElement('details', { className: "bg-red-50 dark:bg-red-900/20 p-3 rounded-lg", open: true },
          React.createElement('summary', { className: "font-semibold cursor-pointer text-red-800 dark:text-red-300" }, `Errors (${report.errors.length})`),
          React.createElement('div', { className: "mt-2 space-y-2" },
            report.errors.map((error, index) => (
              React.createElement('div', { key: `err-${index}`, className: "flex items-start text-red-700 dark:text-red-400" },
                React.createElement(XCircle, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }),
                React.createElement('span', null, error)
              )
            ))
          )
        )
      )
    )
  );
};
