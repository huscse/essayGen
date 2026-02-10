import { useState } from 'react';
import { EssayResult } from '../types';

interface ResultsPanelProps {
  original: EssayResult | null;
  paraphrased: EssayResult | null;
  isLoading: boolean;
  onRegenerateParaphrase: () => void;
  onReset: () => void;
  mode: 'generate' | 'rewrite';  // ADD THIS LINE
}

type Tab = 'original' | 'paraphrased' | 'diff';

export function ResultsPanel({
  original,
  paraphrased,
  isLoading,
  onRegenerateParaphrase,
  onReset,
  mode,  // ADD THIS LINE
}: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('original');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {mode === 'generate' ? 'Generating your essay and paraphrasing...' : 'Rewriting and paraphrasing...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!original || !paraphrased) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg">No results yet</p>
          <p className="text-sm mt-2">
            {mode === 'generate' 
              ? 'Fill out the form and click "Generate" to create your essay'
              : 'Paste your essay and click "Rewrite + Paraphrase"'
            }
          </p>
        </div>
      </div>
    );
  }

  const originalLabel = mode === 'generate' ? 'Original' : 'Rewritten';

  const renderContent = () => {
    switch (activeTab) {
      case 'original':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{original.wordCount} words</span>
                <span>•</span>
                <span>{original.readingTime} min read</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(original.text, 'original')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copySuccess === 'original' ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => handleDownload(original.text, `essay-${mode}.txt`)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="prose max-w-none whitespace-pre-wrap">{original.text}</div>
          </div>
        );

      case 'paraphrased':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{paraphrased.wordCount} words</span>
                <span>•</span>
                <span>{paraphrased.readingTime} min read</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onRegenerateParaphrase}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => handleCopy(paraphrased.text, 'paraphrased')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copySuccess === 'paraphrased' ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => handleDownload(paraphrased.text, 'essay-paraphrased.txt')}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="prose max-w-none whitespace-pre-wrap">{paraphrased.text}</div>
          </div>
        );

      case 'diff':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm text-gray-700">{originalLabel}</h4>
              <div className="text-sm whitespace-pre-wrap bg-red-50 p-4 rounded border border-red-200 max-h-96 overflow-y-auto">
                {original.text}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm text-gray-700">Paraphrased</h4>
              <div className="text-sm whitespace-pre-wrap bg-green-50 p-4 rounded border border-green-200 max-h-96 overflow-y-auto">
                {paraphrased.text}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This is AI-generated content. Always verify facts, citations,
          and use as a draft. Follow academic integrity guidelines.
        </p>
      </div>

      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('original')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'original'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {originalLabel}
        </button>
        <button
          onClick={() => setActiveTab('paraphrased')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'paraphrased'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Paraphrased
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'diff'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compare
        </button>
        <div className="flex-1"></div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
