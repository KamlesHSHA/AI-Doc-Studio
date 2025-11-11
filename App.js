import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { InputPanel } from './components/InputPanel.js';
import { ControlsPanel } from './components/ControlsPanel.js';
import { OutputPanel } from './components/OutputPanel.js';
import { ingestAndValidate } from './services/ingestionService.js';
import { autoFixSpec } from './services/autoFixService.js';
import { generateRawDrafts } from './services/geminiService.js';
import { finalizeDocuments } from './services/finalizationService.js';
import { SAMPLE_JSON } from './constants.js';

function App() {
  const [specInput, setSpecInput] = useState(SAMPLE_JSON);
  const [n_api, setN_api] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  const [autoFixReport, setAutoFixReport] = useState(null);
  const [selectedAudiences, setSelectedAudiences] = useState(['Beginner', 'Quick Start Developer']);
  const [finalizedOutput, setFinalizedOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleValidate = useCallback(async () => {
    setIsProcessing(true);
    setValidationReport(null);
    setAutoFixReport(null);
    setFinalizedOutput(null);
    const { n_api, validation_report } = await ingestAndValidate(specInput);
    setN_api(n_api);
    setValidationReport(validation_report);
    setIsProcessing(false);
  }, [specInput]);

  const handleAutoFix = useCallback(async () => {
    if (!validationReport || !validationReport.issues.length) return;
    setIsProcessing(true);
    setIsFixing(true);
    setAutoFixReport(null);
    const fixReport = await autoFixSpec(specInput, validationReport.issues);
    setAutoFixReport(fixReport);
    if (fixReport.status === 'success' || fixReport.status === 'partial') {
      setSpecInput(fixReport.fixed_spec);
    }
    setIsFixing(false);
    setIsProcessing(false);
  }, [specInput, validationReport]);

  const handleGenerate = useCallback(async () => {
    if (!n_api || validationReport?.status === 'error' || selectedAudiences.length === 0) return;
    setIsLoading(true);
    setFinalizedOutput(null);
    try {
      const rawDrafts = await generateRawDrafts(n_api, selectedAudiences);
      const finalOutput = await finalizeDocuments(n_api, rawDrafts);
      setFinalizedOutput(finalOutput);
    } catch (error) {
      console.error("Generation failed:", error);
    }
    setIsLoading(false);
  }, [n_api, validationReport, selectedAudiences]);

  return (
    React.createElement('div', { className: 'flex flex-col min-h-screen' },
      React.createElement(Header, { theme: theme, setTheme: setTheme }),
      React.createElement('main', { className: 'flex-grow container mx-auto px-4 py-12' },
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-8 items-start' },
          React.createElement('div', { className: 'lg:col-span-1 space-y-8' },
            React.createElement(InputPanel, {
              specInput: specInput,
              setSpecInput: setSpecInput,
              onValidate: handleValidate,
              onAutoFix: handleAutoFix,
              validationReport: validationReport,
              autoFixReport: autoFixReport,
              isProcessing: isProcessing,
              isFixing: isFixing,
            }),
            React.createElement(ControlsPanel, {
              selectedAudiences: selectedAudiences,
              setSelectedAudiences: setSelectedAudiences,
              onGenerate: handleGenerate,
              isLoading: isLoading,
              isGenerationDisabled: !validationReport || validationReport.status !== 'success',
            })
          ),
          React.createElement('div', { className: 'lg:col-span-2' },
            React.createElement(OutputPanel, {
              finalizedOutput: finalizedOutput,
              isLoading: isLoading,
              audiences: selectedAudiences,
            })
          )
        )
      ),
      React.createElement(Footer, {
        traceId: n_api?.trace.uid ?? null,
        validationStatus: validationReport?.status ?? null,
      })
    )
  );
}

export default App;
