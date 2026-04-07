import { Injectable } from "@nestjs/common";
import { AIProvider } from "./interfaces/AIProvider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OrthographyDto, ProsConstDiscusserDto, TranslateTextDto } from "./dtos";
import { orthographyCheckUseCase, prosConsDiscusserUseCase, prosConsStreamUseCase, translateTextUseCase } from "./use-cases";

@Injectable()
export class GptService {

  private aiProvider: AIProvider;

  constructor() {
    this.aiProvider = new GeminiProvider(process.env.GEMINI_API_KEY!);
    // this.aiProvider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
  }

  async orthographyCheck({prompt}: OrthographyDto) {
    return await orthographyCheckUseCase(this.aiProvider, { prompt });
  }


  async prosConsDiscusser({prompt}: ProsConstDiscusserDto) {
    return await prosConsDiscusserUseCase(this.aiProvider, { prompt });
  }

  async prosConsStream({prompt}: ProsConstDiscusserDto) {
    return await prosConsStreamUseCase(this.aiProvider, { prompt });
  }

  async translateText({prompt, lang}: TranslateTextDto) {
    return await translateTextUseCase(this.aiProvider, { prompt, lang });
  }
}