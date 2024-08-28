import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  title: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  genre: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  description: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  author: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  publisher: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsNumber()
  @IsOptional()
  pages: number;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  image_url: string;
}