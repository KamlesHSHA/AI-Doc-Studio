import React from 'react';
import { ValidationReportView } from './ValidationReportView.js';
import { AutoFixReportView } from './AutoFixReportView.js';
import { LoaderCircle } from './icons.js';
import { SAMPLE_OPENAPI_JSON, SAMPLE_POSTMAN_JSON } from '../constants.js';

export const InputPanel = ({
  specInput,
  setSpecInput,
  onValidate,
  onAutoFix,
  validationReport,
  autoFixReport,
  isProcessing,
  isFixing,
}) => {
  const canAutoFix = validationReport && validationReport.status !== 'success' && validationReport.issues.length > 0;

  const handleSampleSelect = (event) => {
    const selected = event.target.value;
    if (selected === 'openapi') {
        setSpecInput(SAMPLE_OPENAPI_JSON);
    } else if (selected === 'postman') {
        setSpecInput(SAMPLE_POSTMAN_JSON);
    }
  };

  return (
    React.createElement('div', { className: "bg-white dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 space-y-4" },
      React.createElement('div', { className: "flex justify-between items-center" },
        React.createElement('h2', { className: "text-lg font-semibold text-gray-900 dark:text-gray-100" }, "1. Input API Specification"),
        React.createElement('select', { onChange: handleSampleSelect, className: "text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2 focus:ring-1 focus:ring-indigo-500" },
            React.createElement('option', { value: "openapi" }, "Sample: OpenAPI"),
            React.createElement('option', { value: "postman" }, "Sample: Postman")
        )
      ),
      React.createElement('textarea', {
        value: specInput,
        onChange: (e) => setSpecInput(e.target.value),
        placeholder: "Paste your API specification JSON here...",
        className: "w-full h-80 p-3 font-mono text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-800",
        disabled: isProcessing,
        autoFocus: true,
      }),
      React.createElement('div', { className: "flex items-center space-x-3" },
        React.createElement('button', {
          onClick: onValidate,
          disabled: isProcessing || !specInput,
          className: "flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        },
          isProcessing && !isFixing ? React.createElement(LoaderCircle, { className: "animate-spin mx-auto" }) : 'Validate Spec'
        ),
        React.createElement('button', {
          onClick: onAutoFix,
          disabled: !canAutoFix || isProcessing,
          className: "flex-1 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        },
          isFixing ? React.createElement(LoaderCircle, { className: "animate-spin mx-auto" }) : 'Auto-Fix with AI'
        )
      ),
      autoFixReport && React.createElement(AutoFixReportView, { report: autoFixReport }),
      validationReport && React.createElement(ValidationReportView, { report: validationReport })
    )
  );
};
