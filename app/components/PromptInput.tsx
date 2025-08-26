'use client';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Prompt
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Describe the image you want to generate..."}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          resize-none
          transition-colors duration-200
        "
        rows={4}
        maxLength={500}
        aria-describedby="prompt-help"
      />
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span id="prompt-help">
          Be descriptive about the style, mood, and elements you want in the generated image
        </span>
        <span>
          {value.length}/500
        </span>
      </div>
    </div>
  );
}
