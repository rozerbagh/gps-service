import { Response } from "express";

declare module "express-serve-static-core" {
  interface Response {
    successResponse: (data: any, message: string, statusCode?: number) => void;
    errorResponse: (data: any, message: string, statusCode?: number) => void;
  }
}
