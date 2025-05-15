import { IsOptional, IsString } from "class-validator";

export class CompleteTicketDto {
  @IsOptional()
  @IsString({ message: "Текст обращения должен быть строкой" })
  solutionText?: string;
}
