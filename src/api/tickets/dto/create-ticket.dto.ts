import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTicketDto {
  @IsString({ message: "Тема обращения должна быть строкой." })
  @IsNotEmpty({ message: "Тема обращения не может быть пустой." })
  @MinLength(3, {
    message: "Тема обращения должна содержать не менее 3 символов.",
  })
  @MaxLength(255, {
    message: "Тема обращения не должна превышать 255 символов.",
  })
  subject!: string;

  @IsString({ message: "Текст обращения должен быть строкой." })
  @IsNotEmpty({ message: "Текст обращения не может быть пустым." })
  @MinLength(10, {
    message: "Текст обращения должен содержать не менее 10 символов.",
  })
  text!: string;
}
