'use client';

import { useState, useRef, useCallback, useEffect, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import EmptyState from './components/EmptyState';
import { Generation, Style } from './types';

// Lazy load components for code splitting
const ImageUpload = lazy(() => import('./components/ImageUpload'));
const PromptInput = lazy(() => import('./components/PromptInput'));
const StyleSelector = lazy(() => import('./components/StyleSelector'));
const GenerationSummary = lazy(() => import('./components/GenerationSummary'));
const GenerateButton = lazy(() => import('./components/GenerateButton'));
const History = lazy(() => import('./components/History'));

// Loading component for Suspense
const ComponentLoader = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<Style>('Editorial');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Generation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('modelia-history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setGenerationHistory(history.slice(0, 5)); // Keep only last 5
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('modelia-history', JSON.stringify(generationHistory));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [generationHistory]);

  const handleImageSelect = useCallback((imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDataUrl: selectedImage,
          prompt: prompt.trim(),
          style: selectedStyle,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Generation failed' }));
        throw new Error(errorData.message || 'Generation failed');
      }

      const result: Generation = await response.json();
      
      // Add to history
      setGenerationHistory(prev => [result, ...prev.slice(0, 4)]);
      
      // Update current state with the generated result
      setSelectedImage(result.imageUrl);
      setPrompt(result.prompt);
      setSelectedStyle(result.style);
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Generation aborted');
        return;
      } else {
        console.error('Generation error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [selectedImage, prompt, selectedStyle]);

  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleHistorySelect = useCallback((generation: Generation) => {
    setSelectedImage(generation.imageUrl);
    setPrompt(generation.prompt);
    setSelectedStyle(generation.style);
    setError(null);
  }, []);

  const canGenerate = selectedImage && prompt.trim() && !isGenerating;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Modelia
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-Powered Image Generation
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload and Controls */}
            <div className="space-y-6">
              <Suspense fallback={<ComponentLoader />}>
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                />
              </Suspense>
              
              <Suspense fallback={<ComponentLoader />}>
                <PromptInput 
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="Describe the image you want to generate..."
                />
              </Suspense>
              
              <Suspense fallback={<ComponentLoader />}>
                <StyleSelector 
                  selectedStyle={selectedStyle}
                  onStyleChange={setSelectedStyle}
                />
              </Suspense>
              
              <Suspense fallback={<ComponentLoader />}>
                <GenerateButton 
                  onGenerate={handleGenerate}
                  onAbort={handleAbort}
                  isGenerating={isGenerating}
                  disabled={!canGenerate}
                />
              </Suspense>
            </div>

            {/* Right Column - Preview and History */}
            <div className="space-y-6">
              <Suspense fallback={<ComponentLoader />}>
                <GenerationSummary 
                  image={selectedImage}
                  prompt={prompt}
                  style={selectedStyle}
                />
              </Suspense>
              
              <Suspense fallback={<ComponentLoader />}>
                <History 
                  history={generationHistory}
                  onSelect={handleHistorySelect}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
