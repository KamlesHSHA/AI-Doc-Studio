import React from 'react';
import { CheckCircle, AlertTriangle } from './icons.js';

export const QualityReportView = ({ report }) => {
  if (!report) {
    return null;
  }

  const scoreColor = report.score > 85 ? 'text-green-600' : report.score > 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    React.createElement('div', { className: "p-4 my-4 border rounded-md" },
      React.createElement('h3', { className: "text-md font-semibold mb-2" }, "Quality Report"),
      React.createElement('div', { className: "flex items-center mb-3" },
        React.createElement('div', { className: `text-3xl font-bold ${scoreColor}` }, `${report.score}/100`),
        React.createElement('div', { className: "ml-4" },
            React.createElement('p', null, React.createElement('strong', null, "Readability (Grade Level):"), " ", report.readability.gradeLevel),
            React.createElement('p', null, React.createElement('strong', null, "Word Count:"), " ", report.readability.wordCount)
        )
      ),
      
      report.suggestions.length > 0 && (
        React.createElement('div', null,
          React.createElement('h4', { className: "font-semibold text-sm" }, "Suggestions:"),
          React.createElement('ul', { className: "list-disc pl-5 mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-300" },
            report.suggestions.map((suggestion, index) => (
              React.createElement('li', { key: index }, suggestion)
            ))
          )
        )
      )
    )
  );
};
