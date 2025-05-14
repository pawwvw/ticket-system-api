import { ApiError } from "./api-errors";

export class NotFoundError extends ApiError {
  constructor(message: string = "Ресурс не найден") {
    super(404, message);
  }
}

