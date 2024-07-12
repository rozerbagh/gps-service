import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../interface/responseIntreface";
export const responseEnhancer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (res as CustomResponse).successResponse = (
    data: any,
    message: string,
    statusCode: number = 200
  ) => {
    res.status(statusCode).json({ data, message, statusCode });
  };

  (res as CustomResponse).errorResponse = (
    error: any,
    message: string,
    statusCode: number = 500
  ) => {
    res.status(statusCode).json({ error, message, statusCode });
  };
  next();
};
