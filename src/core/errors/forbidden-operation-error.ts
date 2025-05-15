import { ApiError } from "./api-errors";

export class ForbiddenOperationError extends ApiError {
  constructor(message: string = "Доступ запрещен") {
    super(403, message);
  }
}
