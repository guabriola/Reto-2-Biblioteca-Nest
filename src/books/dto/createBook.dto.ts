import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
  /**
   * Required
   */
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  /**
   * Required
   */
  @IsString()
  @IsNotEmpty()
  readonly genre: string;

  @IsString()
  readonly description: string;

  /**
   * Required
   */
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