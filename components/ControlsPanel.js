import React from 'react';
import { LoaderCircle } from './icons.js';
import { AUDIENCE_CONFIG } from '../constants.js';

export const ControlsPanel = ({
  selectedAudiences,
  setSelectedAudiences,
  onGenerate,
  isLoading,
  isGenerationDisabled,
}) => {
  const handleAudienceToggle = (audience) => {
    const currentIndex = selectedAudiences.indexOf(audience);
    const newAudiences = [...selectedAudiences];

    if (currentIndex === -1) {
      newAudiences.push(audience);
    } else {
      newAudiences.splice(currentIndex, 1);
    }
    setSelectedAudiences(newAudiences);
  };

  return (
    React.createElement('div', { className: "bg-white dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50" },
      React.createElement('h2', { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" }, "2. Generation Controls"),
      
      React.createElement('div', { className: "mb-4" },
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" },
          "Select Target Audiences"
        ),
        React.createElement('div', { className: "space-y-3" },
          Object.entries(AUDIENCE_CONFIG).map(([key, { name, description }]) => (
            React.createElement('button',
              {
                key: key,
                onClick: () => handleAudienceToggle(key),
                disabled: isLoading,
                className: `w-full text-left p-3 border rounded-lg transition-all duration-200 text-sm flex items-center ${
                  selectedAudiences.includes(key)
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 ring-2 ring-indigo-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-slate-800/50'
                }`
              },
              React.createElement('div', { className: "flex-grow" },
                React.createElement('p', { className: "font-semibold text-slate-800 dark:text-slate-200" }, name),
                React.createElement('p', { className: "text-slate-500 dark:text-slate-400" }, description)
              ),
               React.createElement('div', { className: `w-5 h-5 rounded-full border-2 ml-4 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${selectedAudiences.includes(key) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400 bg-white dark:bg-slate-700'}` },
                selectedAudiences.includes(key) && React.createElement('div', { className: "w-2 h-2 rounded-full bg-white" })
               )
            )
          ))
        )
      ),

      React.createElement('div', { className: "mt-6" },
        React.createElement('button',
          {
            onClick: onGenerate,
            disabled: isLoading || isGenerationDisabled || selectedAudiences.length === 0,
            className: "w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          },
          isLoading ? (
            React.createElement(React.Fragment, null,
              React.createElement(LoaderCircle, { className: "animate-spin mr-2" }),
              "Generating..."
            )
          ) : (
            'Generate Documentation'
          )
        ),
        isGenerationDisabled && !isLoading && React.createElement('p', { className: "text-xs text-center mt-2 text-slate-500" }, "Please validate the spec successfully before generating.")
      )
    )
  );
};
