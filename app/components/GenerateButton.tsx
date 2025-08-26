'use client';

import { useState, useCallback } from 'react';

interface GenerateButtonProps {
  onGenerate: () => Promise<void>;
  onAbort: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export default function GenerateButton({ 
  onGenerate, 
  onAbort, 
  isGenerating, 
  disabled 
}: GenerateButtonProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (disabled || isGenerating) return;

    setError(null);
    
    try {
      await onGenerate();
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      setError(errorMessage);
      
      // Auto-retry with exponential backoff (max 3 attempts)
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          handleGenerate();
        }, delay);
      }
    }
  }, [onGenerate, disabled, isGenerating, retryCount]);

  const handleAbort = useCallback(() => {
    onAbort();
    setError(null);
    setRetryCount(0);
  }, [onAbort]);

  return (
    <div className="space-y-3">
      <button
        onClick={isGenerating ? handleAbort : handleGenerate}
        disabled={disabled && !isGenerating}
        className={`
          w-full px-4 py-3 rounded-md font-medium text-white transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isGenerating
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }
        `}
        aria-describedby={error ? "error-message" : undefined}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Abort Generation</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate Image</span>
          </div>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div 
          id="error-message"
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          role="alert"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-600 dark:text-red-400">
              {error}
              {retryCount > 0 && retryCount < 3 && (
                <span className="ml-1">
                  (Retrying... {retryCount}/3)
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Retry Info */}
      {retryCount > 0 && retryCount < 3 && !error && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Retrying generation... ({retryCount}/3)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
