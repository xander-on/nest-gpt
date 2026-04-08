import * as path from "path";
import * as fs from "fs";
import { AIProvider } from "../interfaces/AIProvider";

interface Data{
  prompt : string;
  voice ?: string;
}


const voices = {
  'zephyr' : 'Zephyr' ,	
  'puck'   : 'Puck',	
  'charon' : 'Charon',
  'kore'   : 'Kore',	
  'fenrir' : 'Fenrir',	
  'leda'   : 'Leda'
}

export const textToAudioUseCase = async(
  aiProvider: AIProvider,
  data: Data
) => {

  const { prompt, voice } = data;
  const selectedVoice = voices[voice?.toLowerCase() ?? 'zephyr'] ;

  const folderPath = path.resolve(__dirname, "../../../generated/audios");
  const speechFile = path.resolve(`${folderPath}/${Date.now()}.wav`);
  await fs.mkdirSync(folderPath, { recursive: true });

  const buffer = await aiProvider.generateAudio(prompt, { voiceName: selectedVoice });
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
}