export interface AIProvider {
  generateText(
    prompt: string,
    config?: AIConfig
  ): Promise<string>;

  generateTextStream?(
    prompt: string,
    config?: AIConfig
  ): AsyncIterable<string>; 
}


export interface AIConfig {
  formatResponse?: "markdown" | "text" | "json";
  temperature?: number;
  maxTokens?: number;
}