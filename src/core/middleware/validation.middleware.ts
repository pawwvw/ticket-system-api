import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, RequestHandler, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";

export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  valueSource: "body" | "query" | "params" = "body"
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const dataToValidate = req[valueSource];
    const dtoInstance = plainToInstance(dtoClass, dataToValidate);
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new BadRequestError(`Ошибка валидации ${errors}`);
    } else {
      req[valueSource] = dtoInstance;
      next();
    }
  };
};
