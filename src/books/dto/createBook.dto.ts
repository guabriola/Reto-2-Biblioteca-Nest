import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {

  @IsString()
  @IsNotEmpty()
  readonly title: string;
  
  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @IsString()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsString()
  readonly publisher: string;

  @IsNumber()
  readonly pages: number;

  @IsString()
  readonly image_url: string;
}