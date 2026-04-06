import { Injectable } from "@nestjs/common";
import { AIProvider } from "./interfaces/AIProvider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OrthographyDto, ProsConstDiscusserDto } from "./dtos";
import { orthographyCheckUseCase, prosConsDiscusserUseCase, prosConsStreamUseCase } from "./use-cases";

@Injectable()
export class GptService {

  private aiProvider: AIProvider;

  constructor() {
    this.aiProvider = new GeminiProvider(process.env.GEMINI_API_KEY!);
    // this.aiProvider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
  }

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.aiProvider, {
      prompt: orthographyDto.prompt
    });
  }


  async prosConsDiscusser({prompt}: ProsConstDiscusserDto) {
    return await prosConsDiscusserUseCase(this.aiProvider, { prompt });
  }


  async prosConsStream({prompt}: ProsConstDiscusserDto) {
    return await prosConsStreamUseCase(this.aiProvider, { prompt });
  }
}