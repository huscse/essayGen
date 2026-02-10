import Anthropic from '@anthropic-ai/sdk';
import { ParaphraseProvider, ParaphraseOptions } from '../types';

export class FallbackLLMParaphraseProvider implements ParaphraseProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey
    });
  }

  async paraphrase(text: string, options: ParaphraseOptions): Promise<string> {
    const prompt = this.buildParaphrasePrompt(text, options);

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }

      throw new Error('Unexpected response format from LLM');
    } catch (error) {
      console.error('LLM paraphrase failed:', error);
      throw error;
    }
  }

  private buildParaphrasePrompt(text: string, options: ParaphraseOptions): string {
    const modeInstructions = {
      standard: 'Paraphrase this text while maintaining its meaning. Use different sentence structures and vocabulary.',
      fluency: 'Paraphrase this text focusing on natural flow and readability. Make it sound smooth and well-written.',
      formal: 'Paraphrase this text in a more formal, professional tone. Use sophisticated vocabulary and formal structures.',
      creative: 'Paraphrase this text creatively. Use varied expressions, metaphors, and interesting word choices while preserving the core meaning.'
    };

    const strengthGuidance = options.strength <= 3
      ? 'Make minimal changes - just rephrase slightly.'
      : options.strength <= 6
      ? 'Make moderate changes - restructure sentences and use synonyms.'
      : 'Make significant changes - completely rewrite while preserving meaning.';

    return `${modeInstructions[options.mode]}

${strengthGuidance}

Original text:
${text}

Paraphrased version (return ONLY the paraphrased text, no preamble or explanation):`;
  }
}
