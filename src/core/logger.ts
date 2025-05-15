import pino, { LoggerOptions, DestinationStream } from "pino";
import dotenv from 'dotenv';
dotenv.config();

const pinoConfig: LoggerOptions | DestinationStream = {
  level: process.env.LOG_LEVEL || "info",
};

if (process.env.NODE_ENV !== "production") {
  (pinoConfig as LoggerOptions).transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "SYS:HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino(pinoConfig);

export default logger;
