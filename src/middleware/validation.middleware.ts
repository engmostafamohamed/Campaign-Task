import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }
    req.body = result.data;

    next();
  };
};