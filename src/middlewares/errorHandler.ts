import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";


const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Internal Server Error";

  // If not an AppError, treat as generic error
  if ( err instanceof AppError) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  console.error("Error:", err);
};


export default errorHandler;