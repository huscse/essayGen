import { ParaphraseProvider, ParaphraseOptions } from '../types';
import { ThirdPartyParaphraseProvider } from './ThirdPartyParaphraseProvider';
import { FallbackLLMParaphraseProvider } from './FallbackLLMParaphraseProvider';

export class ParaphraseService {
  private thirdPartyProvider: ThirdPartyParaphraseProvider | null = null;
  private fallbackProvider: FallbackLLMParaphraseProvider;

  constructor(
    anthropicApiKey: string,
    paraphraseApiBaseUrl?: string,
    paraphraseApiKey?: string
  ) {
    // Always create fallback provider
    this.fallbackProvider = new FallbackLLMParaphraseProvider(anthropicApiKey);

    // Create third-party provider if configured
    if (paraphraseApiBaseUrl && paraphraseApiKey) {
      this.thirdPartyProvider = new ThirdPartyParaphraseProvider(
        paraphraseApiBaseUrl,
        paraphraseApiKey
      );
    }
  }

  async paraphrase(text: string, options: ParaphraseOptions): Promise<string> {
    // Try third-party provider first if available
    if (this.thirdPartyProvider) {
      try {
        console.log('Attempting paraphrase with third-party API...');
        const result = await this.thirdPartyProvider.paraphrase(text, options);
        console.log('Third-party paraphrase succeeded');
        return result;
      } catch (error) {
        console.warn('Third-party paraphrase failed, falling back to LLM:', error);
      }
    }

    // Fallback to LLM paraphrasing
    console.log('Using LLM fallback for paraphrasing...');
    const result = await this.fallbackProvider.paraphrase(text, options);
    console.log('LLM paraphrase succeeded');
    return result;
  }

  hasThirdPartyProvider(): boolean {
    return this.thirdPartyProvider !== null;
  }
}
