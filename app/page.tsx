'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import PromptInput from './components/PromptInput';
import StyleSelector from './components/StyleSelector';
import GenerationSummary from './components/GenerationSummary';
import GenerateButton from './components/GenerateButton';
import History from './components/History';
import { Generation, Style } from './types';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<Style>('Editorial');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Generation[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('modelia-history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setGenerationHistory(history.slice(0, 5)); // Keep only last 5
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('modelia-history', JSON.stringify(generationHistory));
  }, [generationHistory]);

  const handleImageSelect = useCallback((imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !prompt.trim()) {
      alert('Please upload an image and enter a prompt');
      return;
    }

    setIsGenerating(true);
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
        return; // Don't throw abort errors
      } else {
        console.error('Generation error:', error);
        throw error; // Re-throw to let the button component handle retry
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
  }, []);

  const canGenerate = selectedImage && prompt.trim() && !isGenerating;

  return (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Controls */}
          <div className="space-y-6">
            <ImageUpload 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
            />
            
            <PromptInput 
              value={prompt}
              onChange={setPrompt}
              placeholder="Describe the image you want to generate..."
            />
            
            <StyleSelector 
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
            
            <GenerateButton 
              onGenerate={handleGenerate}
              onAbort={handleAbort}
              isGenerating={isGenerating}
              disabled={!canGenerate}
            />
          </div>

          {/* Right Column - Preview and History */}
          <div className="space-y-6">
            <GenerationSummary 
              image={selectedImage}
              prompt={prompt}
              style={selectedStyle}
            />
            
            <History 
              history={generationHistory}
              onSelect={handleHistorySelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
