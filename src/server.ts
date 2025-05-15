import app from "./app";
import dotenv from "dotenv";
import logger from "./core/logger";
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
  logger.info(`Доступен по адресу: http://localhost:${PORT}`);
});
