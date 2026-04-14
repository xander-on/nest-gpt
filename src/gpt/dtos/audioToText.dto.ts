import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";



export class AudioToTextDto {
  @Transform(({ value }) => value ?? undefined)
  @IsOptional()
  @IsString()
  prompt?:string
}