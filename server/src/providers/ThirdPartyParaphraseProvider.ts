import { ParaphraseProvider, ParaphraseOptions } from '../types';

export class ThirdPartyParaphraseProvider implements ParaphraseProvider {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor(apiBaseUrl: string, apiKey: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
  }

  async paraphrase(text: string, options: ParaphraseOptions): Promise<string> {
    try {
      // Example API call structure - adjust based on actual API
      const response = await fetch(`${this.apiBaseUrl}/paraphrase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text,
          mode: options.mode,
          strength: options.strength
        })
      });

      if (!response.ok) {
        throw new Error(`Paraphrase API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Adjust based on actual API response structure
      return data.paraphrasedText || data.result || data.text;
      
    } catch (error) {
      console.error('Third-party paraphrase API failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiBaseUrl && this.apiKey);
  }
}
