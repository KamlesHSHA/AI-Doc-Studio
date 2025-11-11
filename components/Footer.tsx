import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from './icons';

interface FooterProps {
  traceId: string | null;
  validationStatus: 'success' | 'warning' | 'error' | null;
}

const StatusIndicator: React.FC<{ status: 'success' | 'warning' | 'error' | null }> = ({ status }) => {
    if (!status) {
        return <div className="flex items-center text-slate-500"><Info className="w-4 h-4 mr-1.5" /> Idle</div>;
    }
    switch (status) {
        case 'success':
            return <div className="flex items-center text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4 mr-1.5" /> Valid</div>;
        case 'warning':
            return <div className="flex items-center text-amber-600 dark:text-amber-400"><AlertTriangle className="w-4 h-4 mr-1.5" /> Warning</div>;
        case 'error':
            return <div className="flex items-center text-red-600 dark:text-red-400"><XCircle className="w-4 h-4 mr-1.5" /> Error</div>;
    }
}

export const Footer: React.FC<FooterProps> = ({ traceId, validationStatus }) => {
  return (
    <footer className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="font-mono">
            Trace: <span className="text-slate-800 dark:text-slate-200">{traceId || 'N/A'}</span>
        </div>
        <div className="hidden sm:block">
            &copy; {new Date().getFullYear()} AI Documentation Studio
        </div>
        <div className="font-semibold">
            <StatusIndicator status={validationStatus} />
        </div>
      </div>
    </footer>
  );
};