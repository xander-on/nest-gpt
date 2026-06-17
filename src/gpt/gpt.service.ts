import { Injectable, NotFoundException } from "@nestjs/common";
import { AIProvider } from "./interfaces/AIProvider";
import { GeminiProvider } from "./providers/gemini.provider";
import { ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConstDiscusserDto, TextToAudioDto, TranslateTextDto } from "./dtos";
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDiscusserUseCase, prosConsStreamUseCase, textToAudioGetterUseCase, textToAudioUseCase, translateTextUseCase } from "./use-cases";
import { OpenAIProvider } from "./providers/openai.provider";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

@Injectable()
export class GptService {

  private aiProvider: AIProvider;
  private openAiProvider: AIProvider;
  private openai: OpenAI

  constructor() {
    this.aiProvider = new GeminiProvider(process.env.GEMINI_API_KEY!);
    this.openAiProvider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
    this.openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY!});
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

  async textToAudio({prompt, voice}: TextToAudioDto) {
    return await textToAudioUseCase(this.aiProvider, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    return await textToAudioGetterUseCase(fileId);
  }

  async audioToText( audioFile: Express.Multer.File, {prompt}: TextToAudioDto) {
    return await audioToTextUseCase(this.aiProvider, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openAiProvider, imageGenerationDto);
  }

  getGeneratedImage(fileName:string){
    const filePath = path.resolve('./', './generated/images/', fileName);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) throw new NotFoundException('No se encontro el archivo');
    return filePath;
  }

  async imageVariation({baseImage}: ImageVariationDto){
    return await imageVariationUseCase(this.openai, {baseImage});
  }
}