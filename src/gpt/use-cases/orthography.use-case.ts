import { AIProvider } from "../interfaces/AIProvider";

interface Data {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  aiProvider: AIProvider,
  data: Data
) => {
  const { prompt } = data;

  const finalPrompt = `
Te seran proveidos textos en español con posibles errores ortograficos y gramaticales,
Las palabras usadas deben existir en el diccionario de la real academia de la lengua española,
Debes de responder en formato JSON,
tu tarea es corregirlos y retornar informacion soluciones,
tambien debes de dar un porcentaje de acierto por el usuario,

si no hay errores, debes retornar un mensaje de felicitaciones.

Ejemplo de salida:
{
  userScore: number,
  errors: string[], // ["error" -> "correccion"]
  message: string, // Usa emojis para felicitar al usuario
}

Responde SOLO en JSON válido.
NO uses markdown.
NO uses \`\`\`json.

${prompt}
`;

  return await aiProvider.generateText(finalPrompt);
};