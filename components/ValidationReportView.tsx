import React from 'react';
import { ValidationReport, ValidationIssue } from '../types';
import { XCircle, AlertTriangle, Info } from './icons';

interface ValidationReportViewProps {
  report: ValidationReport;
}

const severityMap = {
  error: {
    icon: <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
    text: 'text-red-800 dark:text-red-300',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />,
    text: 'text-yellow-800 dark:text-yellow-300',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />,
    text: 'text-blue-800 dark:text-blue-300',
  },
};

const IssueRow: React.FC<{ issue: ValidationIssue }> = ({ issue }) => {
    const { icon, text } = severityMap[issue.severity];
    return (
        <div className={`flex items-start p-2 rounded-md ${text} text-xs`}>
            {icon}
            <div className="ml-2">
                <span className="font-semibold">{issue.message}</span>
                <span className="font-mono text-gray-500 dark:text-gray-400 ml-2">({issue.path})</span>
            </div>
        </div>
    );
};

export const ValidationReportView: React.FC<ValidationReportViewProps> = ({ report }) => {
  return (
    <div className="space-y-2 mt-3">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
            Detected Format: <span className="font-bold text-slate-700 dark:text-slate-200 uppercase">{report.detected_format}</span> (Confidence: {Math.round(report.confidence * 100)}%)
        </div>
        {report.issues.length === 0 && report.status === 'success' && (
             <div className="flex items-start p-2 rounded-md text-green-800 dark:text-green-300 text-xs">
                <Info className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="ml-2">
                    <span className="font-semibold">Validation successful. Ready for generation.</span>
                </div>
            </div>
        )}
        {report.issues.map((issue, index) => (
            <IssueRow key={index} issue={issue} />
        ))}
    </div>
  );
};