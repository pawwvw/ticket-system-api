import express, {
  Application,
  ErrorRequestHandler,
  Request,
  Response,
} from "express";
import { ApiError } from "./core/errors/api-errors";

const app: Application = express();

app.use(express.json());

const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }
  res.status(500).json({ status: "error", message: err.message });
};

app.use(globalErrorHandler);

export default app;
