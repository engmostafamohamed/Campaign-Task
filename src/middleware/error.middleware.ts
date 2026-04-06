import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../core/response/api.response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  return ApiResponse.error(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500
  );
};