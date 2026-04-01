import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  model: GenerativeModel,
  options: Options
) => {
  const { prompt } = options;

  const finalPrompt = `
Eres un asistente muy útil.
Corrige la ortografía del siguiente texto sin cambiar el significado:

${prompt}
`;

  try {
    const result = await model.generateContent(finalPrompt);

    return {
      content: result.response.text(),
    };

  } catch (error) {
    console.error("Gemini error:", error);

    throw new Error("Error procesando texto con IA");
  }
};