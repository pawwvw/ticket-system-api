import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ApiError } from "./core/errors/api-errors";
import ticketRoutes from "./api/tickets/ticket.routes";
import logger from "./core/logger";
const app: Application = express();

app.use(express.json());

app.use("/api/tickets", ticketRoutes);

const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
        ...(err instanceof ApiError && {
          statusCode: err.statusCode,
          isOperational: err.isOperational,
        }),
      },
      req: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      },
    },
    `Произошла ошибка при обработке запроса: ${err.message}`
  );
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }
  res.status(500).json({ status: "error", message: err.message });
};

app.use(globalErrorHandler);

export default app;
