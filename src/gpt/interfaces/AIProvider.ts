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
}


export interface AIConfig {
  formatResponse ?: "markdown" | "text" | "json";
  temperature    ?: number;
  maxTokens      ?: number;
  voiceName      ?: string;
}