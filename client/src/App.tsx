import React, { useState } from 'react';
import { EssayForm } from './components/EssayForm';
import { RewriteForm } from './components/RewriteForm';
import { ResultsPanel } from './components/ResultsPanel';
import { generateAndParaphrase, rewriteAndParaphrase } from './api';
import { EssayFormData, EssayResult } from './types';

type Mode = 'generate' | 'rewrite';

function App() {
  const [mode, setMode] = useState<Mode>('generate');

  const [formData, setFormData] = useState<EssayFormData>({
    prompt: '',
    type: 'argumentative',
    tone: 'formal',
    wordCount: 500,
    outline: '',
    paraphraseMode: 'standard',
    paraphraseStrength: 5,
  });

  const [rewriteText, setRewriteText] = useState('');
  const [paraphraseMode, setParaphraseMode] = useState<
    'standard' | 'fluency' | 'formal' | 'creative'
  >('standard');
  const [paraphraseStrength, setParaphraseStrength] = useState(5);

  const [original, setOriginal] = useState<EssayResult | null>(null);
  const [paraphrased, setParaphrased] = useState<EssayResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateAndParaphrase(formData);
      setOriginal(response.original);
      setParaphrased(response.paraphrased);
    } catch (err: any) {
      console.error('Error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to generate essay. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rewriteText.trim()) {
      setError('Please paste your essay text');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await rewriteAndParaphrase(
        rewriteText,
        paraphraseMode,
        paraphraseStrength,
      );
      setOriginal(response.rewritten);
      setParaphrased(response.paraphrased);
    } catch (err: any) {
      console.error('Error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to rewrite essay. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateParaphrase = async () => {
    // Implementation depends on mode
    if (mode === 'generate') {
      handleGenerate(new Event('submit') as any);
    } else {
      handleRewrite(new Event('submit') as any);
    }
  };

  const handleReset = () => {
    setOriginal(null);
    setParaphrased(null);
    setError(null);
    setRewriteText('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">NoGPT</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered essay generation and paraphrasing
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto flex-shrink-0 text-red-400 hover:text-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Mode Tabs */}
            <div className="flex border-b mb-6">
              <button
                onClick={() => {
                  setMode('generate');
                  handleReset();
                }}
                className={`px-4 py-2 font-medium transition-colors ${
                  mode === 'generate'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate Essay
              </button>
              <button
                onClick={() => {
                  setMode('rewrite');
                  handleReset();
                }}
                className={`px-4 py-2 font-medium transition-colors ${
                  mode === 'rewrite'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rewrite Existing
              </button>
            </div>

            {mode === 'generate' ? (
              <EssayForm
                formData={formData}
                onChange={setFormData}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            ) : (
              <RewriteForm
                text={rewriteText}
                onTextChange={setRewriteText}
                paraphraseMode={paraphraseMode}
                onModeChange={setParaphraseMode}
                paraphraseStrength={paraphraseStrength}
                onStrengthChange={setParaphraseStrength}
                onSubmit={handleRewrite}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Results</h2>
            <ResultsPanel
              original={original}
              paraphrased={paraphrased}
              isLoading={isLoading}
              onRegenerateParaphrase={handleRegenerateParaphrase}
              onReset={handleReset}
              mode={mode}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built with React, TypeScript, and Claude API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
