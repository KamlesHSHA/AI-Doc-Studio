import React from 'react';
import { AutoFixReport } from '../types';
import { CheckCircle, AlertTriangle, XCircle } from './icons';

interface AutoFixReportViewProps {
  report: AutoFixReport;
}

const statusMap = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    text: 'text-green-800 dark:text-green-300',
    title: 'Auto-Fix Successful',
  },
  partial: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    text: 'text-yellow-800 dark:text-yellow-300',
    title: 'Auto-Fix Partially Successful',
  },
  failed: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    text: 'text-red-800 dark:text-red-300',
    title: 'Auto-Fix Failed',
  },
};

export const AutoFixReportView: React.FC<AutoFixReportViewProps> = ({ report }) => {
  const statusInfo = statusMap[report.status];

  return (
    <div className={`p-3 my-4 border rounded-md bg-opacity-20 ${statusInfo.text.replace('text-', 'bg-').replace('-800', '-50').replace('-300', '-900/20')} ${statusInfo.text.replace('text-', 'border-')}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{statusInfo.icon}</div>
        <div className="ml-3 w-0 flex-1">
          <h3 className={`text-sm font-semibold ${statusInfo.text}`}>{statusInfo.title}</h3>
          <p className={`mt-1 text-sm ${statusInfo.text}`}>{report.summary}</p>
          {report.changes.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Changes Applied:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                {report.changes.map((change, index) => (
                  <li key={index}>
                    <span className="font-mono bg-gray-200 dark:bg-slate-700 text-xs rounded px-1 py-0.5">{change.path}</span>: {change.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
