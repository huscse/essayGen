import { Router, Request, Response } from 'express';
import { EssayGenerator } from '../providers/EssayGenerator';
import { ParaphraseService } from '../providers/ParaphraseService';
import { createEssayResult } from '../utils';
import {
  GenerateRequest,
  ParaphraseRequest,
  GenerateAndParaphraseRequest,
  GenerateResponse,
  ParaphraseResponse,
  GenerateAndParaphraseResponse,
} from '../types';

const router = Router();

// Initialize services lazily to ensure env vars are loaded
let essayGenerator: EssayGenerator;
let paraphraseService: ParaphraseService;

function initializeServices() {
  if (!essayGenerator) {
    essayGenerator = new EssayGenerator(process.env.ANTHROPIC_API_KEY!);
    paraphraseService = new ParaphraseService(
      process.env.ANTHROPIC_API_KEY!,
      process.env.PARAPHRASE_API_BASE_URL,
      process.env.PARAPHRASE_API_KEY,
    );
  }
}

// POST /api/rewrite-and-paraphrase - NEW: Rewrite existing essay and paraphrase
router.post('/rewrite-and-paraphrase', async (req: Request, res: Response) => {
  initializeServices();
  try {
    const { text, paraphraseMode, paraphraseStrength } = req.body;

    // Validation
    if (!text || !paraphraseMode || paraphraseStrength === undefined) {
      return res.status(400).json({
        error:
          'Missing required fields: text, paraphraseMode, paraphraseStrength',
      });
    }

    if (paraphraseStrength < 1 || paraphraseStrength > 10) {
      return res.status(400).json({
        error: 'Paraphrase strength must be between 1 and 10',
      });
    }

    // Step 1: Rewrite the essay using AI
    console.log('Rewriting essay...');
    const rewritePrompt = `Rewrite the following essay to improve its quality, clarity, and flow. Maintain the same meaning and key points, but enhance the writing quality.

Important:
- Do NOT use em dashes (—) or en dashes (–). Use regular hyphens (-) or commas instead
- Keep punctuation simple and standard
- Improve sentence structure and word choice
- Maintain the original essay's tone and style
- Return ONLY the rewritten essay, no preamble or commentary

Original Essay:
${text}

Rewritten Essay:`;

    const message = await essayGenerator['client'].messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: rewritePrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from LLM');
    }

    const rewrittenText = content.text.trim();
    const rewrittenResult = createEssayResult(rewrittenText);

    // Step 2: Paraphrase the rewritten essay
    console.log('Paraphrasing rewritten essay...');
    const paraphrasedText = await paraphraseService.paraphrase(rewrittenText, {
      mode: paraphraseMode,
      strength: paraphraseStrength,
    });

    const paraphrasedResult = createEssayResult(paraphrasedText);

    const response = {
      rewritten: rewrittenResult,
      paraphrased: paraphrasedResult,
    };

    res.json(response);
  } catch (error) {
    console.error('Rewrite and paraphrase error:', error);
    res.status(500).json({
      error: 'Failed to rewrite and paraphrase essay',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/generate - Generate essay only
router.post(
  '/generate',
  async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
    initializeServices();
    try {
      const { prompt, type, tone, wordCount, outline } = req.body;

      // Validation
      if (!prompt || !type || !tone || !wordCount) {
        return res.status(400).json({
          error: 'Missing required fields: prompt, type, tone, wordCount',
        });
      }

      if (wordCount < 100 || wordCount > 5000) {
        return res.status(400).json({
          error: 'Word count must be between 100 and 5000',
        });
      }

      // Generate essay
      const essayText = await essayGenerator.generateEssay({
        prompt,
        type,
        tone,
        wordCount,
        outline,
      });

      const result = createEssayResult(essayText);

      const response: GenerateResponse = {
        original: result,
      };

      res.json(response);
    } catch (error) {
      console.error('Generate error:', error);
      res.status(500).json({
        error: 'Failed to generate essay',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// POST /api/paraphrase - Paraphrase existing text
router.post(
  '/paraphrase',
  async (req: Request<{}, {}, ParaphraseRequest>, res: Response) => {
    initializeServices();
    try {
      const { text, mode, strength } = req.body;

      // Validation
      if (!text || !mode || strength === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: text, mode, strength',
        });
      }

      if (strength < 1 || strength > 10) {
        return res.status(400).json({
          error: 'Strength must be between 1 and 10',
        });
      }

      if (!['standard', 'fluency', 'formal', 'creative'].includes(mode)) {
        return res.status(400).json({
          error:
            'Invalid mode. Must be: standard, fluency, formal, or creative',
        });
      }

      // Paraphrase text
      const paraphrasedText = await paraphraseService.paraphrase(text, {
        mode,
        strength,
      });

      const result = createEssayResult(paraphrasedText);

      const response: ParaphraseResponse = {
        paraphrased: result,
      };

      res.json(response);
    } catch (error) {
      console.error('Paraphrase error:', error);
      res.status(500).json({
        error: 'Failed to paraphrase text',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// POST /api/generate-and-paraphrase - Generate and paraphrase in one call (recommended)
router.post(
  '/generate-and-paraphrase',
  async (req: Request<{}, {}, GenerateAndParaphraseRequest>, res: Response) => {
    initializeServices();
    try {
      const {
        prompt,
        type,
        tone,
        wordCount,
        outline,
        paraphraseMode,
        paraphraseStrength,
      } = req.body;

      // Validation
      if (
        !prompt ||
        !type ||
        !tone ||
        !wordCount ||
        !paraphraseMode ||
        paraphraseStrength === undefined
      ) {
        return res.status(400).json({
          error: 'Missing required fields',
        });
      }

      if (wordCount < 100 || wordCount > 5000) {
        return res.status(400).json({
          error: 'Word count must be between 100 and 5000',
        });
      }

      if (paraphraseStrength < 1 || paraphraseStrength > 10) {
        return res.status(400).json({
          error: 'Paraphrase strength must be between 1 and 10',
        });
      }

      // Step 1: Generate essay
      console.log('Generating essay...');
      const essayText = await essayGenerator.generateEssay({
        prompt,
        type,
        tone,
        wordCount,
        outline,
      });

      const originalResult = createEssayResult(essayText);

      // Step 2: Paraphrase the generated essay
      console.log('Paraphrasing essay...');
      const paraphrasedText = await paraphraseService.paraphrase(essayText, {
        mode: paraphraseMode,
        strength: paraphraseStrength,
      });

      const paraphrasedResult = createEssayResult(paraphrasedText);

      const response: GenerateAndParaphraseResponse = {
        original: originalResult,
        paraphrased: paraphrasedResult,
      };

      res.json(response);
    } catch (error) {
      console.error('Generate and paraphrase error:', error);
      res.status(500).json({
        error: 'Failed to generate and paraphrase essay',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// GET /api/health - Health check
router.get('/health', (req: Request, res: Response) => {
  initializeServices();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasThirdPartyParaphrase: paraphraseService.hasThirdPartyProvider(),
  });
});

export default router;
