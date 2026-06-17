
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

export const saveBase64AsPng = async ( base64: string, fullPath = false,) => {

  if (!base64)
    throw new Error("No se recibió una imagen en base64");

  const folderPath = path.resolve("./generated/images");
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${Date.now()}.png`;
  const completePath = path.join(folderPath, imageName);

  const cleanBase64 = base64.replace(
    /^data:image\/\w+;base64,/,
    "",
  );

  const buffer = Buffer.from(cleanBase64, "base64");

  await sharp(buffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageName;
};



export const downloadImageFromUrl = async (
  imageUrl: string,
  fullPath = false,
) => {

  if (!imageUrl)
    throw new Error("No se recibió una URL");

  const folderPath = path.resolve("./generated/images");
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${Date.now()}.png`;
  const completePath = path.join(folderPath, imageName);

  const response = await fetch(imageUrl);

  if (!response.ok)
    throw new Error("No se pudo descargar la imagen");

  const buffer = Buffer.from(
    await response.arrayBuffer(),
  );

  await fs.promises.writeFile(
    completePath,
    buffer,
  );

  return fullPath ? completePath : imageName;
};
