import { IsOptional, IsString } from "class-validator";


export class TextToAudioDto {

  @IsString()
  readonly prompt!: string;

  @IsOptional()
  @IsString()
  voice?: string;
}