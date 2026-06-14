import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProductFaqDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  question!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  answer!: string;
}
