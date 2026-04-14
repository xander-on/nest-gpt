export interface AIProvider {
  generateText(
    prompt: string,
    config?: AIConfig
  ): Promise<string>;

  generateTextStream?(
    prompt: string,
    config?: AIConfig
  ): AsyncIterable<string>;

  generateAudio(
    prompt: string, 
    config?: AIConfig
  ): Promise<Buffer>;

  generateTextFromAudio: (
    prompt: string,
    audio: {
      data: string;
      mimeType: string;
    }
  ) => Promise<string>;
}


export interface AIConfig {
  formatResponse ?: "markdown" | "text" | "json";
  temperature    ?: number;
  maxTokens      ?: number;
  voiceName      ?: string;
}