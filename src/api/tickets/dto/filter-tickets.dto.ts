import { IsOptional, IsDateString } from "class-validator";

export class FilterTicketsDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: "Некорректный формат конкретной даты (ожидается YYYY-MM-DD)." }
  )
  date?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        "Некорректный формат начальной даты диапазона (ожидается YYYY-MM-DD).",
    }
  )
  startDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        "Некорректный формат конечной даты диапазона (ожидается YYYY-MM-DD).",
    }
  )
  endDate?: string;
}
