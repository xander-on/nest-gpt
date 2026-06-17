import OpenAI, { toFile } from "openai";
import { downloadImageFromUrl, saveBase64AsPng } from "src/helpers";
import * as fs from "fs";


interface Options{
  baseImage: string;
}


export const imageVariationUseCase = async(
  openai: OpenAI, 
  options:Options
) => {
  const { baseImage } = options;

  try{
    
    const pngImagePath = await downloadImageFromUrl(baseImage, true);

    const imageFile = await toFile(fs.createReadStream(pngImagePath), null,{
      type:"image/png"
    });

    const response = await openai.images.edit({
      model:"gpt-image-1",
      image: imageFile,
      prompt:"para una variacion creativa de la imagen, manteniendo el estilo y sujeto, pero con diferente composicion o detalles",
      n:1,
      size:"1024x1024",
      quality:"low"
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
    console.error(error);
  }

}