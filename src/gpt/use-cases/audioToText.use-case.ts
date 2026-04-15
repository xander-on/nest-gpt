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

    Responde SOLO en JSON válido.
    NO uses markdown.
    NO uses \`\`\`json.

    Ejemplo de salida:

    {
      "totalTime": "00:00:01",
      "lang": "es",
      "segments":[],
      "rawText": "texto traido del audio",
    }

    los segments deben ser parrafos con maximo unos 180 caracteres y se pasa de esta cantidad cortalos en el signo de punto (.) anterior a los 180 caracteres

    puedes devolver las "segments" en arrays con el formato como el siguiente ejemplo horas:minutos:segundos ej:
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

  return parsed;
};

