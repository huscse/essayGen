import Anthropic from '@anthropic-ai/sdk';
import { GenerateRequest } from '../types';

export class EssayGenerator {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async generateEssay(request: GenerateRequest): Promise<string> {
    const prompt = this.buildEssayPrompt(request);

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }

      throw new Error('Unexpected response format from LLM');
    } catch (error) {
      console.error('Essay generation failed:', error);
      throw error;
    }
  }

  private buildEssayPrompt(request: GenerateRequest): string {
    const typeInstructions = {
      argumentative:
        'Write an argumentative essay that presents a clear thesis and supports it with evidence and reasoning. Include counterarguments and rebuttals.',
      narrative:
        'Write a narrative essay that tells a compelling story with descriptive details, character development, and a clear narrative arc.',
      expository:
        'Write an expository essay that explains and informs about the topic using facts, examples, and clear explanations.',
    };

    const toneInstructions = {
      formal:
        'Use formal language, sophisticated vocabulary, and maintain a professional tone throughout.',
      casual:
        'Use conversational language and a friendly, approachable tone while remaining informative.',
      academic:
        'Use academic language with proper citations style, scholarly vocabulary, and rigorous analysis.',
    };

    let prompt = `Write a ${request.type} essay on the following topic: "${
      request.prompt
    }"

Requirements:
- Type: ${typeInstructions[request.type]}
- Tone: ${toneInstructions[request.tone]}
- Target length: approximately ${
      request.wordCount
    } words (aim for within 10% of this target)
- Include a strong introduction with a clear thesis or main idea
- Develop well-structured body paragraphs with supporting details
- Conclude with a thoughtful conclusion that ties everything together
- Do NOT use em dashes (—) or en dashes (–). Use regular hyphens (-) or commas instead
- Keep punctuation simple and standard`;

    if (request.outline) {
      prompt += `\n- Follow this outline structure:\n${request.outline}`;
    }

    prompt += `\n\nWrite the essay now (return ONLY the essay text, no preamble or title):`;

    return prompt;
  }
}
