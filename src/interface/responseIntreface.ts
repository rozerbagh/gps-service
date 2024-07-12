import { Response } from "express";
export interface CustomResponse extends Response {
  successResponse(data: any, message: string, statusCode?: number): void;
  errorResponse(error: any, message: string, statusCode?: number): void;
}
