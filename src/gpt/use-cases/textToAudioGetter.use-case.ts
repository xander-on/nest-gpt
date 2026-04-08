import * as path from "path";
import * as fs from "fs";
import { NotFoundException } from "@nestjs/common";


export const textToAudioGetterUseCase = async (fileId: string) => {
  const filePath = path.resolve(__dirname, '../../../generated/audios/', `${fileId}.wav`);
  const fileExists = fs.existsSync(filePath);
  if (!fileExists) throw new NotFoundException('No se encontro el archivo');
  return filePath;
}