export type EssayType = 'argumentative' | 'narrative' | 'expository';
export type Tone = 'formal' | 'casual' | 'academic';
export type ParaphraseMode = 'standard' | 'fluency' | 'formal' | 'creative';

export interface EssayFormData {
  prompt: string;
  type: EssayType;
  tone: Tone;
  wordCount: number;
  outline: string;
  paraphraseMode: ParaphraseMode;
  paraphraseStrength: number;
}

export interface EssayResult {
  text: string;
  wordCount: number;
  readingTime: number;
}

export interface GenerateAndParaphraseResponse {
  original: EssayResult;
  paraphrased: EssayResult;
}

export interface ApiError {
  error: string;
  details?: string;
}
