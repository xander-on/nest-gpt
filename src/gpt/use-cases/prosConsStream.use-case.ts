import { AIConfig, AIProvider } from "../interfaces/AIProvider";

interface Options {
  prompt: string;
}


export const prosConsStreamUseCase = async (
  aiProvider: AIProvider,
  options: Options
) => {

  const { prompt } = options;


  const finalPrompt= `
    Se te dara una pregunta y tu tarea es dar una respuesta con pros y contras,
    la respuesta debe ser en formato markdown,
    los pros y contras deben de estar en una lista

    Responde SOLO en formato markdown.
    ${prompt}
  `;

  const configResponse : AIConfig = {
    formatResponse: "markdown",
    temperature: 0.8,
    maxTokens: 800
  };

  return aiProvider.generateTextStream!(
    finalPrompt, 
    configResponse
  );

}