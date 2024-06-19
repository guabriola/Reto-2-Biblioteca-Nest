import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  readonly title: string;
  
  @IsString()
  @IsOptional()
  readonly genre: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly author: string;

  @IsString()
  @IsOptional()
  readonly publisher: string;

  @IsNumber()
  @IsOptional()
  readonly pages: number;

  @IsString()
  @IsOptional()
  readonly image_url: string;
}