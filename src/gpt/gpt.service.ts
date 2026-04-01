import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dtos';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { orthographyCheckUseCase } from './use-cases';
// import OpenAI from 'openai';

@Injectable()
export class GptService {

  // private openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY
  // });


  private genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

  private model = this.genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  async orthographyCheck(orthographyDto: OrthographyDto){
    return await orthographyCheckUseCase(
      this.model,
      {
        prompt: orthographyDto.prompt
      }
    );
  }
}
