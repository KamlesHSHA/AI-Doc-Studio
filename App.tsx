import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputPanel } from './components/InputPanel';
import { ControlsPanel } from './components/ControlsPanel';
import { OutputPanel } from './components/OutputPanel';
import { ingestAndValidate } from './services/ingestionService';
import { autoFixSpec } from './services/autoFixService';
import { generateRawDrafts } from './services/geminiService';
import { finalizeDocuments } from './services/finalizationService';
import { N_API, ValidationReport, AutoFixReport, FinalizedOutput } from './types';
import { SAMPLE_JSON } from './constants';

type Theme = 'light' | 'dark';

function App() {
  const [specInput, setSpecInput] = useState<string>(SAMPLE_JSON);
  const [n_api, setN_api] = useState<N_API | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [autoFixReport, setAutoFixReport] = useState<AutoFixReport | null>(null);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(['Beginner', 'Quick Start Developer']);
  const [finalizedOutput, setFinalizedOutput] = useState<FinalizedOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For generation
  const [theme, setTheme] = useState<Theme>('light');

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
    <div className="flex flex-col min-h-screen">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8">
            <InputPanel
              specInput={specInput}
              setSpecInput={setSpecInput}
              onValidate={handleValidate}
              onAutoFix={handleAutoFix}
              validationReport={validationReport}
              autoFixReport={autoFixReport}
              isProcessing={isProcessing}
              isFixing={isFixing}
            />
            <ControlsPanel
              selectedAudiences={selectedAudiences}
              setSelectedAudiences={setSelectedAudiences}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              isGenerationDisabled={!validationReport || validationReport.status !== 'success'}
            />
          </div>
          <div className="lg:col-span-2">
            <OutputPanel 
              finalizedOutput={finalizedOutput} 
              isLoading={isLoading} 
              audiences={selectedAudiences}
            />
          </div>
        </div>
      </main>
      <Footer 
        traceId={n_api?.trace.uid ?? null}
        validationStatus={validationReport?.status ?? null}
      />
    </div>
  );
}

export default App;