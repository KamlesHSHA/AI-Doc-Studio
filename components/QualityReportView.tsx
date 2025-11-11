import React from 'react';
import { QualityReport } from '../types';
import { CheckCircle, AlertTriangle } from './icons';

interface QualityReportViewProps {
  report: QualityReport | null;
}

export const QualityReportView: React.FC<QualityReportViewProps> = ({ report }) => {
  if (!report) {
    return null;
  }

  const scoreColor = report.score > 85 ? 'text-green-600' : report.score > 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="p-4 my-4 border rounded-md">
      <h3 className="text-md font-semibold mb-2">Quality Report</h3>
      <div className="flex items-center mb-3">
        <div className={`text-3xl font-bold ${scoreColor}`}>{report.score}/100</div>
        <div className="ml-4">
            <p><strong>Readability (Grade Level):</strong> {report.readability.gradeLevel}</p>
            <p><strong>Word Count:</strong> {report.readability.wordCount}</p>
        </div>
      </div>
      
      {report.suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm">Suggestions:</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {report.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
