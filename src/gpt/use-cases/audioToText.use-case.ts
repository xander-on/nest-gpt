import * as fs from "fs";
import { AIProvider } from "../interfaces/AIProvider";

interface Data {
  audioFile: Express.Multer.File;
  prompt ?: string
}

export const audioToTextUseCase = async (
  aiProvider: AIProvider,
  data: Data
) => {
  const { audioFile, prompt="" } = data;

  const audioBuffer = fs.readFileSync(audioFile.path);
  const base64Audio = audioBuffer.toString("base64");
  const mimeType    = audioFile.mimetype ?? "audio/mp4";

  const finalPrompt = `
    Transcribe el siguiente audio en texto.
    Devuelve solo la transcripción, sin explicaciones.

    puedes devolver en arrays cada objeto es un parrafo con el formato como el siguiente ejemplo:
    [
      {text: "texto traido del audio", time: "00:00:01"}, 
      {text: "texto traido del audio", time: "00:00:05"}, 
      {text: "texto traido del audio", time: "00:00:12"}, 
    ]
    ${prompt}
  `;

  const dataAudio = {
    data: base64Audio,
    mimeType,
  }

  const response = await aiProvider.generateTextFromAudio(finalPrompt, dataAudio);
  let parsed;

  try { parsed = JSON.parse(response);} 
  catch { parsed = response; }

  return {
    data: parsed,
  };
};