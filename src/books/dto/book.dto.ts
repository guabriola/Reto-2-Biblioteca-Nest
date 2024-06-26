import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BookDto {

  @IsNumber()
  readonly id: number;

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