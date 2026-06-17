import { AIProvider } from "../interfaces/AIProvider";


interface Options{
  prompt:string;
  originalImage?: string;
  maskImage?: string;
}


export const imageGenerationUseCase = async (
  aiProvider: AIProvider,
  options: Options
) => {
  const { prompt, originalImage, maskImage } = options;

  const response = await aiProvider.generateImage({
    prompt,
    originalImage,
    maskImage
  });

  return response;
}