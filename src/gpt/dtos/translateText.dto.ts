import { IsString } from "class-validator";



export class TranslateTextDto {

  @IsString()
  readonly prompt!: string;

  @IsString()
  readonly lang!: string;
}