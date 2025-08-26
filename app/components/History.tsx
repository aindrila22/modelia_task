'use client';

import Image from 'next/image';
import { Generation } from '../types';

interface HistoryProps {
  history: Generation[];
  onSelect: (generation: Generation) => void;
}

export default function History({ history, onSelect }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generation History
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No generations yet</p>
            <p className="text-xs mt-1">Your generated images will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Generation History
      </h2>
      
      <div className="space-y-3">
        {history.map((generation) => (
          <button
            key={generation.id}
            onClick={() => onSelect(generation)}
            className="
              w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3
              hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200 text-left
            "
            aria-label={`Restore generation from ${new Date(generation.createdAt).toLocaleDateString()}`}
          >
            <div className="flex space-x-3">
              {/* Image Thumbnail */}
              <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={generation.imageUrl}
                  alt="Generated image"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {generation.prompt}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {generation.style}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(generation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Restore Icon */}
                  <div className="flex-shrink-0 ml-2">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Click any item to restore it in the main interface
      </p>
    </div>
  );
}
