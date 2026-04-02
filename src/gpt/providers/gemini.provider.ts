import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "../interfaces/AIProvider";

export class GeminiProvider implements AIProvider {

  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        // maxOutputTokens: 150,
        responseMimeType: "application/json",
      },
    });
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const resp = result.response.candidates[0].content.parts[0].text ?? "";
    return resp;
  }
}