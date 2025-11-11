import React from 'react';
import { XCircle, AlertTriangle, Info } from './icons.js';

const severityMap = {
  error: {
    icon: React.createElement(XCircle, { className: "h-5 w-5 text-red-500 flex-shrink-0" }),
    text: 'text-red-800 dark:text-red-300',
  },
  warning: {
    icon: React.createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-500 flex-shrink-0" }),
    text: 'text-yellow-800 dark:text-yellow-300',
  },
  info: {
    icon: React.createElement(Info, { className: "h-5 w-5 text-blue-500 flex-shrink-0" }),
    text: 'text-blue-800 dark:text-blue-300',
  },
};

const IssueRow = ({ issue }) => {
    const { icon, text } = severityMap[issue.severity];
    return (
        React.createElement('div', { className: `flex items-start p-2 rounded-md ${text} text-xs` },
            icon,
            React.createElement('div', { className: "ml-2" },
                React.createElement('span', { className: "font-semibold" }, issue.message),
                React.createElement('span', { className: "font-mono text-gray-500 dark:text-gray-400 ml-2" }, `(${issue.path})`)
            )
        )
    );
};

export const ValidationReportView = ({ report }) => {
  return (
    React.createElement('div', { className: "space-y-2 mt-3" },
        React.createElement('div', { className: "text-xs text-slate-500 dark:text-slate-400 font-medium px-2" },
            "Detected Format: ", React.createElement('span', { className: "font-bold text-slate-700 dark:text-slate-200 uppercase" }, report.detected_format), ` (Confidence: ${Math.round(report.confidence * 100)}%)`
        ),
        report.issues.length === 0 && report.status === 'success' && (
             React.createElement('div', { className: "flex items-start p-2 rounded-md text-green-800 dark:text-green-300 text-xs" },
                React.createElement(Info, { className: "h-5 w-5 text-green-500 flex-shrink-0" }),
                React.createElement('div', { className: "ml-2" },
                    React.createElement('span', { className: "font-semibold" }, "Validation successful. Ready for generation.")
                )
            )
        ),
        report.issues.map((issue, index) => (
            React.createElement(IssueRow, { key: index, issue: issue })
        ))
    )
  );
};
