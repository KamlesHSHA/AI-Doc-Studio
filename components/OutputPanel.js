import React, { useState, useEffect, useRef } from 'react';
import { AUDIENCE_CONFIG } from '../constants.js';
import { LoaderCircle, CopyIcon, DownloadIcon, CheckIcon } from './icons.js';
import MarkdownRenderer from './MarkdownRenderer.js';
import { MetaReportView } from './MetaReportView.js';

const DocumentView = ({ document, title }) => {
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef(null);

  const handleCopy = () => {
    if (!document) return;
    const markdownContent = document.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(markdownContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!document || !contentRef.current) return;
    
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: `${title.toLowerCase().replace(/ /g, '-')}-documentation.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    if (typeof window.html2pdf === 'function') {
        window.html2pdf().from(element).set(opt).save();
    } else {
        console.error('html2pdf.js is not loaded.');
        alert('Could not download PDF. The PDF generation library is not available.');
    }
  };

  if (!document) {
    return React.createElement('p', { className: "text-slate-500 dark:text-slate-400 text-center py-8" }, "No content generated for this audience.");
  }
  
  return (
    React.createElement('div', { className: "relative" },
      React.createElement('div', { className: "absolute top-0 right-0 flex space-x-2 z-10" },
        React.createElement('button', { onClick: handleCopy, className: "p-2 rounded-md bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors" },
          isCopied ? React.createElement(CheckIcon, { className: "w-5 h-5 text-green-500" }) : React.createElement(CopyIcon, { className: "w-5 h-5 text-slate-600 dark:text-slate-300" })
        ),
        React.createElement('button', { onClick: handleDownload, className: "p-2 rounded-md bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors" },
          React.createElement(DownloadIcon, { className: "w-5 h-5 text-slate-600 dark:text-slate-300" })
        )
      ),
      React.createElement('div', { ref: contentRef, className: "space-y-6" },
        document.sections.map((section, index) => (
          React.createElement('div', { key: index },
            React.createElement('h2', { className: "text-2xl font-bold mt-8 mb-4 pb-2 border-b border-light-border dark:border-dark-border text-slate-900 dark:text-slate-100" }, section.title),
            React.createElement(MarkdownRenderer, { content: section.content })
          )
        ))
      )
    )
  );
};

export const OutputPanel = ({ finalizedOutput, isLoading, audiences }) => {
  const [activeTab, setActiveTab] = useState('');

  const availableTabs = finalizedOutput ? [...audiences, 'Meta Report'] : [];

  useEffect(() => {
    if (audiences.length > 0 && !activeTab) {
      setActiveTab(audiences[0]);
    }
    if (audiences.length > 0 && !audiences.includes(activeTab) && activeTab !== 'Meta Report') {
        setActiveTab(audiences[0]);
    } else if (audiences.length === 0 && activeTab !== 'Meta Report') {
        setActiveTab('');
    }
  }, [audiences, activeTab]);

  const renderContent = () => {
    if (isLoading) {
      return (
        React.createElement('div', { className: "flex flex-col items-center justify-center h-96" },
          React.createElement(LoaderCircle, { className: "w-12 h-12 animate-spin text-indigo-600" }),
          React.createElement('p', { className: "mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300" }, "Generating documentation..."),
          React.createElement('p', { className: "text-sm text-slate-500" }, "This may take a moment.")
        )
      );
    }

    if (!finalizedOutput) {
      return (
        React.createElement('div', { className: "flex flex-col items-center justify-center h-96 text-center" },
          React.createElement('h3', { className: "text-xl font-semibold text-slate-800 dark:text-slate-200" }, "Ready to Generate"),
          React.createElement('p', { className: "mt-2 text-slate-500 dark:text-slate-400 max-w-md" },
            "Once your API specification is validated, select your target audiences and click \"Generate Documentation\" to see the results here."
          )
        )
      );
    }

    const docMap = {
      'Beginner': finalizedOutput.beginner_doc_final,
      'Quick Start Developer': finalizedOutput.quick_start_doc_final,
      'Security Analyst': finalizedOutput.security_doc_final,
    };
    
    return (
      React.createElement(React.Fragment, null,
        React.createElement('div', { className: "border-b border-light-border dark:border-dark-border mb-4" },
          React.createElement('nav', { className: "-mb-px flex space-x-6", "aria-label": "Tabs" },
            availableTabs.map((tabName) => (
              React.createElement('button', {
                key: tabName,
                onClick: () => setActiveTab(tabName),
                className: `${
                  activeTab === tabName
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`
              },
                AUDIENCE_CONFIG[tabName]?.name || tabName
              )
            ))
          )
        ),
        React.createElement('div', { className: "py-4" },
            activeTab === 'Meta Report' 
                ? React.createElement(MetaReportView, { report: finalizedOutput.meta }) 
                : React.createElement(DocumentView, { document: docMap[activeTab] || null, title: activeTab })
        )
      )
    );
  };

  return (
    React.createElement('div', { className: "bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 min-h-[40rem]" },
      renderContent()
    )
  );
};
