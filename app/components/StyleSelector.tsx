'use client';

import { Style } from '../types';

interface StyleSelectorProps {
  selectedStyle: Style;
  onStyleChange: (style: Style) => void;
}

const styles: Style[] = ['Editorial', 'Streetwear', 'Vintage', 'Minimalist', 'Artistic'];

export default function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Style
      </label>
      <select
        id="style"
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value as Style)}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          transition-colors duration-200
        "
        aria-describedby="style-help"
      >
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
      <p id="style-help" className="text-xs text-gray-500 dark:text-gray-400">
        Choose the artistic style for your generated image
      </p>
    </div>
  );
}
