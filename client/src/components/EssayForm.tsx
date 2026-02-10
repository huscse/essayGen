import React from 'react';
import { EssayFormData, EssayType, Tone, ParaphraseMode } from '../types';

interface EssayFormProps {
  formData: EssayFormData;
  onChange: (data: EssayFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function EssayForm({ formData, onChange, onSubmit, isLoading }: EssayFormProps) {
  const handleChange = (
    field: keyof EssayFormData,
    value: string | number
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Topic / Prompt *
        </label>
        <textarea
          id="prompt"
          value={formData.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter your essay topic or prompt..."
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Essay Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          >
            <option value="argumentative">Argumentative</option>
            <option value="narrative">Narrative</option>
            <option value="expository">Expository</option>
          </select>
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
            Tone *
          </label>
          <select
            id="tone"
            value={formData.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">
          Word Count: {formData.wordCount}
        </label>
        <input
          type="range"
          id="wordCount"
          min="100"
          max="2000"
          step="50"
          value={formData.wordCount}
          onChange={(e) => handleChange('wordCount', parseInt(e.target.value))}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>100</span>
          <span>2000</span>
        </div>
      </div>

      <div>
        <label htmlFor="outline" className="block text-sm font-medium text-gray-700 mb-2">
          Outline (Optional)
        </label>
        <textarea
          id="outline"
          value={formData.outline}
          onChange={(e) => handleChange('outline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Add outline points to guide the essay structure..."
          disabled={isLoading}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Paraphrase Settings</h3>
        
        <div className="mb-4">
          <label htmlFor="paraphraseMode" className="block text-sm font-medium text-gray-700 mb-2">
            Paraphrase Mode
          </label>
          <select
            id="paraphraseMode"
            value={formData.paraphraseMode}
            onChange={(e) => handleChange('paraphraseMode', e.target.value)}
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
          <label htmlFor="paraphraseStrength" className="block text-sm font-medium text-gray-700 mb-2">
            Strength: {formData.paraphraseStrength}
          </label>
          <input
            type="range"
            id="paraphraseStrength"
            min="1"
            max="10"
            step="1"
            value={formData.paraphraseStrength}
            onChange={(e) => handleChange('paraphraseStrength', parseInt(e.target.value))}
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
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Essay + Paraphrase'}
      </button>
    </form>
  );
}
