import React from 'react';

interface JsonViewerProps {
  data: object;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-md my-4 overflow-x-auto">
      <code className="text-sm font-mono text-gray-800 dark:text-gray-300">
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  );
};

export default JsonViewer;
