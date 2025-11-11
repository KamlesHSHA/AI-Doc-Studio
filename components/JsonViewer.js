import React from 'react';

const JsonViewer = ({ data }) => {
  return (
    React.createElement('pre', { className: "bg-gray-100 dark:bg-slate-800 p-4 rounded-md my-4 overflow-x-auto" },
      React.createElement('code', { className: "text-sm font-mono text-gray-800 dark:text-gray-300" },
        JSON.stringify(data, null, 2)
      )
    )
  );
};

export default JsonViewer;
