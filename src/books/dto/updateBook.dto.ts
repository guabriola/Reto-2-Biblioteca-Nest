import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly title: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly genre: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly description: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly author: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly publisher: string;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsNumber()
  @IsOptional()
  readonly pages: number;

  /**
  * VALUE IS OPTIONAL /
  */
  @IsString()
  @IsOptional()
  readonly image_url: string;
}