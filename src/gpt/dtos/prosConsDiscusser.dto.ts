import { IsString } from "class-validator";


export class ProsConstDiscusserDto {

  @IsString()
  readonly prompt!: string;
}