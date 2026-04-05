// middleware/error.middleware.ts
import { Response} from "express";

export const errorHandler = (
  err: any,
  res: Response,
) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};