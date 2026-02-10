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
      // ZeroGPT API format
      // NOTE: You may need to adjust this endpoint based on ZeroGPT's documentation
      // Visit https://api.zerogpt.com/docs for exact endpoint details
      const endpoint = `${this.apiBaseUrl}/paraphrase`;

      console.log(`Calling paraphrase API: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey, // ZeroGPT uses 'api-key' header
        },
        body: JSON.stringify({
          text: text,
          mode: options.mode,
          strength: options.strength,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Paraphrase API error: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as any;

      console.log(
        'Paraphrase API response:',
        JSON.stringify(data).substring(0, 200),
      );

      // Try different possible response formats
      // Adjust based on actual ZeroGPT API response structure
      const paraphrasedText =
        data.paraphrased_text ||
        data.paraphrasedText ||
        data.result ||
        data.text ||
        data.data?.paraphrased_text ||
        data.data?.text;

      if (!paraphrasedText) {
        console.error('Unexpected API response format:', data);
        throw new Error('Could not find paraphrased text in API response');
      }

      return paraphrasedText;
    } catch (error) {
      console.error('Third-party paraphrase API failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiBaseUrl && this.apiKey);
  }
}
