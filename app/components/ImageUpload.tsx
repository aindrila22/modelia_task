'use client';

import { useState, useRef, useCallback, memo } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (imageDataUrl: string) => void;
  selectedImage: string | null;
}

const ImageUpload = memo(function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Downscale image for better performance
        downscaleImage(result, 1920, 1920).then(onImageSelect);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const downscaleImage = useCallback((dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new globalThis.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload image"
        />

        {selectedImage ? (
          <div className="relative">

            <div data-testid="uploaded-image">
              <Image
                src={selectedImage}
                alt="Selected image"
                width={300}
                height={300}
                className="mx-auto rounded-lg object-cover"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">📷</div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload an image
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Drag and drop an image here, or click to select
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
    </div>
  );
});

export default ImageUpload;
