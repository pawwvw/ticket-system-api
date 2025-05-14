import { ApiError } from "./api-errors";

export class BadRequestError extends ApiError {
  constructor(message: string = "Некорректный запрос") {
    super(400, message);
  }
}
