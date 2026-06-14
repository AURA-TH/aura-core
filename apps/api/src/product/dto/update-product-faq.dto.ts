import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProductFaqDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  question?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  answer?: string;
}
