import OpenAI from "openai";
import { AIProvider } from "../interfaces/AIProvider";

export class OpenAIProvider implements AIProvider {

  private openai;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        // { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    return completion.choices[0].message.content ?? "";
  }
}