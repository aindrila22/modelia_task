'use client';

import Image from 'next/image';
import { Style } from '../types';

interface GenerationSummaryProps {
  image: string | null;
  prompt: string;
  style: Style;
}

export default function GenerationSummary({ image, prompt, style }: GenerationSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Generation Summary
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* Image Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image Preview
          </label>
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt="Preview"
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-900 dark:text-white">
              {prompt || (
                <span className="text-gray-400 dark:text-gray-500 italic">
                  No prompt entered yet
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Style
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {style}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Status:
            </span>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${image && prompt.trim() 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }
            `}>
              {image && prompt.trim() ? 'Ready to generate' : 'Incomplete'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
