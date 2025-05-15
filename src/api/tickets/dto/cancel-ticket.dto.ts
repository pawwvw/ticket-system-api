import { IsOptional, IsString } from "class-validator";

export class CancelTicketDto {
  @IsOptional()
  @IsString({ message: "Причина отмены должна быть строкой" })
  cancellationReason?: string;
}
