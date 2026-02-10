import axios from 'axios';
import { EssayFormData, GenerateAndParaphraseResponse } from './types';

const API_URL =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' ? window.location.origin : undefined);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export async function generateAndParaphrase(
  data: EssayFormData,
): Promise<GenerateAndParaphraseResponse> {
  const response = await api.post<GenerateAndParaphraseResponse>(
    '/api/generate-and-paraphrase',
    {
      prompt: data.prompt,
      type: data.type,
      tone: data.tone,
      wordCount: data.wordCount,
      outline: data.outline || undefined,
      paraphraseMode: data.paraphraseMode,
      paraphraseStrength: data.paraphraseStrength,
    },
  );

  return response.data;
}

export async function rewriteAndParaphrase(
  text: string,
  mode: string,
  strength: number,
): Promise<{
  rewritten: { text: string; wordCount: number; readingTime: number };
  paraphrased: { text: string; wordCount: number; readingTime: number };
}> {
  const response = await api.post('/api/rewrite-and-paraphrase', {
    text,
    paraphraseMode: mode,
    paraphraseStrength: strength,
  });

  return response.data;
}

export async function regenerateParaphrase(
  text: string,
  mode: string,
  strength: number,
): Promise<{
  paraphrased: { text: string; wordCount: number; readingTime: number };
}> {
  const response = await api.post('/api/paraphrase', {
    text,
    mode,
    strength,
  });

  return response.data;
}
