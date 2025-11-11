import React, { useState, useEffect, useRef } from 'react';
import { FinalizedOutput, Document } from '../types';
import { AUDIENCE_CONFIG } from '../constants';
import { LoaderCircle, CopyIcon, DownloadIcon, CheckIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';
import { MetaReportView } from './MetaReportView';

interface OutputPanelProps {
  finalizedOutput: FinalizedOutput | null;
  isLoading: boolean;
  audiences: string[];
}

const DocumentView: React.FC<{ document: Document | null, title: string }> = ({ document, title }) => {
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
    
    // Access the global html2pdf library added via script tag
    if (typeof (window as any).html2pdf === 'function') {
        (window as any).html2pdf().from(element).set(opt).save();
    } else {
        console.error('html2pdf.js is not loaded.');
        alert('Could not download PDF. The PDF generation library is not available.');
    }
  };

  if (!document) {
    return <p className="text-slate-500 dark:text-slate-400 text-center py-8">No content generated for this audience.</p>;
  }
  
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex space-x-2 z-10">
        <button onClick={handleCopy} className="p-2 rounded-md bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors">
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
        </button>
        <button onClick={handleDownload} className="p-2 rounded-md bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors">
          <DownloadIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
      <div ref={contentRef} className="space-y-6">
        {document.sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-light-border dark:border-dark-border text-slate-900 dark:text-slate-100">{section.title}</h2>
            <MarkdownRenderer content={section.content} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ finalizedOutput, isLoading, audiences }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  const availableTabs = finalizedOutput ? [...audiences, 'Meta Report'] : [];

  useEffect(() => {
    // Set initial active tab when audiences are available
    if (audiences.length > 0 && !activeTab) {
      setActiveTab(audiences[0]);
    }
    // Reset or update tab if audiences change
    if (audiences.length > 0 && !audiences.includes(activeTab) && activeTab !== 'Meta Report') {
        setActiveTab(audiences[0]);
    } else if (audiences.length === 0 && activeTab !== 'Meta Report') {
        setActiveTab('');
    }
  }, [audiences, activeTab]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <LoaderCircle className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Generating documentation...</p>
          <p className="text-sm text-slate-500">This may take a moment.</p>
        </div>
      );
    }

    if (!finalizedOutput) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Ready to Generate</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
            Once your API specification is validated, select your target audiences and click "Generate Documentation" to see the results here.
          </p>
        </div>
      );
    }

    const docMap: { [key: string]: Document | null } = {
      'Beginner': finalizedOutput.beginner_doc_final,
      'Quick Start Developer': finalizedOutput.quick_start_doc_final,
      'Security Analyst': finalizedOutput.security_doc_final,
    };
    
    return (
      <>
        <div className="border-b border-light-border dark:border-dark-border mb-4">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {availableTabs.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`${
                  activeTab === tabName
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {AUDIENCE_CONFIG[tabName as keyof typeof AUDIENCE_CONFIG]?.name || tabName}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-4">
            {activeTab === 'Meta Report' 
                ? <MetaReportView report={finalizedOutput.meta} /> 
                : <DocumentView document={docMap[activeTab] || null} title={activeTab} />
            }
        </div>
      </>
    );
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 min-h-[40rem]">
      {renderContent()}
    </div>
  );
};