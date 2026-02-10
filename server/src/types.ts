export type EssayType = 'argumentative' | 'narrative' | 'expository';
export type Tone = 'formal' | 'casual' | 'academic';
export type ParaphraseMode = 'standard' | 'fluency' | 'formal' | 'creative';

export interface GenerateRequest {
  prompt: string;
  type: EssayType;
  tone: Tone;
  wordCount: number;
  outline?: string;
}

export interface ParaphraseOptions {
  mode: ParaphraseMode;
  strength: number; // 1-10
}

export interface ParaphraseRequest {
  text: string;
  mode: ParaphraseMode;
  strength: number;
}

export interface GenerateAndParaphraseRequest extends GenerateRequest {
  paraphraseMode: ParaphraseMode;
  paraphraseStrength: number;
}

export interface EssayResult {
  text: string;
  wordCount: number;
  readingTime: number; // in minutes
}

export interface GenerateResponse {
  original: EssayResult;
}

export interface ParaphraseResponse {
  paraphrased: EssayResult;
}

export interface GenerateAndParaphraseResponse {
  original: EssayResult;
  paraphrased: EssayResult;
}

export interface ParaphraseProvider {
  paraphrase(text: string, options: ParaphraseOptions): Promise<string>;
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface AuthRequest {
  username: string;
  password: string;
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
  }
}
