import OpenAI, { toFile } from "openai";
import * as fs from "fs";
import * as path from "path";
import { AIConfig, AIProvider, GenerateImageResponse } from "../interfaces/AIProvider";
import { downloadImageFromUrl, saveBase64AsPng } from "src/helpers";

export class OpenAIProvider implements AIProvider {

  private openai: OpenAI;

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


  generateTextStream?(prompt: string, config?: AIConfig): AsyncIterable<string> {
    throw new Error("Method not implemented.");
  }


  generateAudio(prompt: string, config?: AIConfig): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }


  generateTextFromAudio (
    prompt: string, 
    audio: { data: string; mimeType: string; }
  ): Promise<string>{
    throw new Error("Method not implemented.");
  };



  
  async generateImage (
    options: { prompt: string; originalImage?: string; maskImage?: string; }
  ):Promise<GenerateImageResponse> {
    const { prompt, originalImage, maskImage } = options;

    try{

      if(!originalImage && !maskImage){

        const response = await this.openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "low",
        });
  
        const image = response.data?.[0];
  
        if (!image?.b64_json) 
          throw new Error("No se pudo generar la imagen");
  
        const fileName = await saveBase64AsPng(image.b64_json);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

        return {
          url,
        };
      }

      const pngImagePath = await downloadImageFromUrl(originalImage!, true);
      const maskImagePath = await saveBase64AsPng(maskImage!, true);

      const imageFile = await toFile(
        fs.createReadStream(pngImagePath),
        null,
        {type: "image/png"}
      );

      const maskFile = await toFile(
        fs.createReadStream(maskImagePath),
        "null",
        { type: "image/png" }
      );

      const response = await this.openai.images.edit({
        model: 'gpt-image-1',
        prompt,
        image: imageFile,
        mask: maskFile,
        size: '1024x1024',
        quality: 'low',
        n: 1,
      });

      const image = response.data?.[0];

      if (!image?.b64_json) 
        throw new Error("No se pudo generar la imagen");
      const fileName = await saveBase64AsPng(image.b64_json);
      const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

      return {
        url  
      }

    }catch(error){
      console.error("Error generating image with OpenAI:", error);
      throw error;
    }
    
  };

  
}