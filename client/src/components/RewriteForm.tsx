import React from 'react';

interface RewriteFormProps {
  text: string;
  onTextChange: (text: string) => void;
  paraphraseMode: 'standard' | 'fluency' | 'formal' | 'creative';
  onModeChange: (mode: 'standard' | 'fluency' | 'formal' | 'creative') => void;
  paraphraseStrength: number;
  onStrengthChange: (strength: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function RewriteForm({
  text,
  onTextChange,
  paraphraseMode,
  onModeChange,
  paraphraseStrength,
  onStrengthChange,
  onSubmit,
  isLoading,
}: RewriteFormProps) {
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="essay-text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Paste Your Essay *
        </label>
        <textarea
          id="essay-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          rows={12}
          placeholder="Paste your essay here... The AI will rewrite it to improve quality and then paraphrase it."
          required
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">{wordCount} words</p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Paraphrase Settings</h3>

        <div className="mb-4">
          <label
            htmlFor="rewrite-paraphrase-mode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Paraphrase Mode
          </label>
          <select
            id="rewrite-paraphrase-mode"
            value={paraphraseMode}
            onChange={(e) => onModeChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="standard">Standard</option>
            <option value="fluency">Fluency</option>
            <option value="formal">Formal</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="rewrite-paraphrase-strength"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Strength: {paraphraseStrength}
          </label>
          <input
            type="range"
            id="rewrite-paraphrase-strength"
            min="1"
            max="10"
            step="1"
            value={paraphraseStrength}
            onChange={(e) => onStrengthChange(parseInt(e.target.value))}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Minimal (1)</span>
            <span>Maximum (10)</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : 'Rewrite + Paraphrase'}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> The AI will first rewrite your essay to
          improve clarity and quality, then paraphrase it to create a unique
          version.
        </p>
      </div>
    </form>
  );
}
