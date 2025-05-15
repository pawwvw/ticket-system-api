import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, RequestHandler, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import logger from "../logger";
export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  valueSource: "body" | "query" | "params" = "body"
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const dataToValidate = req[valueSource] || {};
    const dtoInstance = plainToInstance(dtoClass, dataToValidate);
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const errorMessages = errors
      .map((error: ValidationError) => {
        return Object.values(error.constraints || {}).join(". ");
      })
      .join("; ");
    logger.warn(`Ошибка валидации для DTO ${dtoClass.name}: ${errorMessages}`);
    if (errors.length > 0) {
      throw new BadRequestError(`Ошибка валидации ${errorMessages}`);
    } else {
      if (valueSource === "query") {
        res.locals.validatedQuery = dtoInstance;
      } else if (valueSource === "body") {
        req.body = dtoInstance;
      } else if (valueSource === "params") {
        res.locals.validatedParams = dtoInstance;
      }
      next();
    }
  };
};
