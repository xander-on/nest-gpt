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
      "duration": 578,
      "lang": "es",
      "segments":[],
      "rawText": "texto traido del audio",
    }

    duration debe ser siempre en segundos y es un number,
    los segments deben ser parrafos siempre con maximo unos 180 caracteres y se pasa de esta cantidad cortalos en el signo de punto (.) anterior a los 180 caracteres

    puedes devolver las "segments" en arrays con el formato como el siguiente ejemplo horas:minutos:segundos ej:
    [
      {text: "texto traido del audio no mas de 180 caracteres", time: "00:00:01"}, 
      {text: "texto traido del audio no mas de 180 caracteres", time: "00:00:05"}, 
      {text: "texto traido del audio no mas de 180 caracteres", time: "00:00:12"}, 
    ]

    por favor respeta siempre el max de 180 caracteres en las "segments"
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

