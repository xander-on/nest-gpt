import { GoogleGenAI } from "@google/genai";
import { AIConfig, AIProvider, GenerateImageResponse } from "../interfaces/AIProvider";
import wav from "wav";
import { PassThrough } from "stream";

export class GeminiProvider implements AIProvider {

  private ai;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateText(prompt: string, config?: AIConfig): Promise<string> {

    const formatResponse = config?.formatResponse === "json"
      ? "application/json"
      : "text/plain";

    const temperature = config?.temperature ?? 0.3;
    const maxTokens = config?.maxTokens ?? 1500;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: formatResponse,
      }
    });

    return response.text ?? "";
  }


  async *generateTextStream(
    prompt: string,
    config?: AIConfig
  ): AsyncIterable<string> {

    const temperature = config?.temperature ?? 0.3;
    const maxTokens = config?.maxTokens ?? 1500;

    const stream = await this.ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
    }
  }

  async generateAudio(prompt: string, config?: AIConfig): Promise<Buffer> {

    const voiceName = config?.voiceName ?? "Kore";

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );

    if (!audioPart?.inlineData?.data) {
      throw new Error("No se recibió audio del modelo");
    }

     const pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");
     return await this.pcmToWavBuffer(pcmBuffer);
  }


  private pcmToWavBuffer(
    pcmBuffer: Buffer,
    sampleRate = 24000
  ): Promise<Buffer> {

    return new Promise((resolve, reject) => {

      const writer = new wav.Writer({
        channels: 1,
        sampleRate,
        bitDepth: 16,
      });

      const stream = new PassThrough();
      const chunks: Buffer[] = [];

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);

      writer.pipe(stream);
      writer.write(pcmBuffer);
      writer.end();
    });
  }


  async generateTextFromAudio(
    prompt: string,
    audio: { data: string; mimeType: string },
  ): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: audio.mimeType,
                data: audio.data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    return response.text ?? "";
  }


  async generateImage(
    options:{
      prompt: string;
      originalImage?: string;
      maskImage?: string;
    }
  ): Promise<GenerateImageResponse> {


    try{

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: options.prompt,
      });

      console.log("Gemini image response:", response);

      return response.candidates[0].content.parts[0].inlineData.data;
    }catch(error){
      console.error("Error generating image with Gemini:", error);
      throw error;
    }

  }

}