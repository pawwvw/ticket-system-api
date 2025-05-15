import app from "./app";
import dotenv from "dotenv";
import logger from "./core/logger";
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
  logger.info(`Доступен по адресу: http://localhost:${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  logger.warn(`Получен сигнал  ${signal}. Завершаю процесс`);
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Ошибка при закрытии сервера");
      process.exit(1);
    }
    logger.info("Сервер успешно закрыт");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error(
      "Не удалось закрыть сервер за отведенное время, принудительное завершение."
    );
    process.exit(1);
  }, 15000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  logger.fatal(
    { err: reason, promiseDetails: promise },
    "КРИТИЧЕСКАЯ ОШИБКА: Необработанное отклонение промиса (Unhandled Rejection)!"
  );
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.fatal(
    { err: error },
    "КРИТИЧЕСКАЯ ОШИБКА: Неперехваченное исключение (Uncaught Exception)!"
  );
  process.exit(1);
});