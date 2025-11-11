import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from './icons.js';

const StatusIndicator = ({ status }) => {
    if (!status) {
        return React.createElement('div', { className: "flex items-center text-slate-500" }, React.createElement(Info, { className: "w-4 h-4 mr-1.5" }), " Idle");
    }
    switch (status) {
        case 'success':
            return React.createElement('div', { className: "flex items-center text-green-600 dark:text-green-400" }, React.createElement(CheckCircle, { className: "w-4 h-4 mr-1.5" }), " Valid");
        case 'warning':
            return React.createElement('div', { className: "flex items-center text-amber-600 dark:text-amber-400" }, React.createElement(AlertTriangle, { className: "w-4 h-4 mr-1.5" }), " Warning");
        case 'error':
            return React.createElement('div', { className: "flex items-center text-red-600 dark:text-red-400" }, React.createElement(XCircle, { className: "w-4 h-4 mr-1.5" }), " Error");
    }
}

export const Footer = ({ traceId, validationStatus }) => {
  return (
    React.createElement('footer', { className: "bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-600 dark:text-slate-400" },
      React.createElement('div', { className: "container mx-auto px-4 py-2 flex justify-between items-center" },
        React.createElement('div', { className: "font-mono" },
            "Trace: ", React.createElement('span', { className: "text-slate-800 dark:text-slate-200" }, traceId || 'N/A')
        ),
        React.createElement('div', { className: "hidden sm:block" },
            `© ${new Date().getFullYear()} AI Documentation Studio`
        ),
        React.createElement('div', { className: "font-semibold" },
            React.createElement(StatusIndicator, { status: validationStatus })
        )
      )
    )
  );
};
