

import { AIConfig, AIProvider } from "../interfaces/AIProvider";

interface Data {
  prompt: string;
  lang: string;
}


export const translateTextUseCase = async (
  aiProvider: AIProvider,
  data: Data
) => {

  const { prompt, lang } = data;

  const finalPrompt= `
    Traduce el siguiente texto al idioma ${lang}:${prompt}
  `;

  const configResponse : AIConfig = {
    formatResponse: "json",
    temperature: 0.2,
    // maxTokens: 800
  };

  const resp = await aiProvider.generateText(
    finalPrompt, 
    configResponse
  );

  return {
    data: resp
  }

}