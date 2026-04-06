import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIConfig, AIProvider } from "../interfaces/AIProvider";

export class GeminiProvider implements AIProvider {

  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

  async generateText(prompt: string, config?: AIConfig ): Promise<string> {

    const formatResponse = config?.formatResponse === "json" 
      ? "application/json" 
      : "text/plain";

    const temperature = config?.temperature ?? 0.3;
    const maxTokens = config?.maxTokens ?? 1500;

    const result = await this.model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        responseMimeType: formatResponse,
        maxOutputTokens: maxTokens,
      },
    });

    const resp = result.response.candidates[0].content.parts[0].text ?? "";
    return resp;
  }


  async *generateTextStream(
    prompt: string,
    config?: AIConfig
  ): AsyncIterable<string> {

    const formatResponse = config?.formatResponse === "json" 
      ? "application/json" 
      : "text/plain";

    const temperature = config?.temperature ?? 0.3;
    const maxTokens = config?.maxTokens ?? 1500;

    const result = await this.model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        responseMimeType: formatResponse,
        maxOutputTokens: maxTokens,
      },
    });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text
    }

  }

}