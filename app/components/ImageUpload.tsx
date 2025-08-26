'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (imageDataUrl: string) => void;
  selectedImage: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 1920;

export default function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downscaleImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Calculate new dimensions if image is too large
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert('Please select a PNG or JPG image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      // Downscale if necessary
      const imageDataUrl = await downscaleImage(file);
      onImageSelect(imageDataUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  }, [downscaleImage, onImageSelect]);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert('Please select a PNG or JPG image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      // Downscale if necessary
      const imageDataUrl = await downscaleImage(file);
      onImageSelect(imageDataUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  }, [downscaleImage, onImageSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Upload Image
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${selectedImage 
            ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' 
            : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'
          }
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="Upload image"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        
        {selectedImage ? (
          <div className="space-y-2">
            <div className="relative w-full h-48 rounded overflow-hidden">
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ Image uploaded successfully
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
