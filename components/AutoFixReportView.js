import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from './icons.js';

const statusMap = {
  success: {
    icon: React.createElement(CheckCircle, { className: "h-5 w-5 text-green-500" }),
    text: 'text-green-800 dark:text-green-300',
    title: 'Auto-Fix Successful',
  },
  partial: {
    icon: React.createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-500" }),
    text: 'text-yellow-800 dark:text-yellow-300',
    title: 'Auto-Fix Partially Successful',
  },
  failed: {
    icon: React.createElement(XCircle, { className: "h-5 w-5 text-red-500" }),
    text: 'text-red-800 dark:text-red-300',
    title: 'Auto-Fix Failed',
  },
};

export const AutoFixReportView = ({ report }) => {
  const statusInfo = statusMap[report.status];

  return (
    React.createElement('div', { className: `p-3 my-4 border rounded-md bg-opacity-20 ${statusInfo.text.replace('text-', 'bg-').replace('-800', '-50').replace('-300', '-900/20')} ${statusInfo.text.replace('text-', 'border-')}` },
      React.createElement('div', { className: "flex items-start" },
        React.createElement('div', { className: "flex-shrink-0" }, statusInfo.icon),
        React.createElement('div', { className: "ml-3 w-0 flex-1" },
          React.createElement('h3', { className: `text-sm font-semibold ${statusInfo.text}` }, statusInfo.title),
          React.createElement('p', { className: `mt-1 text-sm ${statusInfo.text}` }, report.summary),
          report.changes.length > 0 && (
            React.createElement('div', { className: "mt-3" },
              React.createElement('h4', { className: "text-xs font-medium text-gray-700 dark:text-gray-300 uppercase" }, "Changes Applied:"),
              React.createElement('ul', { className: "list-disc pl-5 mt-1 space-y-1 text-sm" },
                report.changes.map((change, index) => (
                  React.createElement('li', { key: index },
                    React.createElement('span', { className: "font-mono bg-gray-200 dark:bg-slate-700 text-xs rounded px-1 py-0.5" }, change.path), ": ", change.description
                  )
                ))
              )
            )
          )
        )
      )
    )
  );
};
