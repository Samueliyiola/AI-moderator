import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";


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
  if (!(err instanceof AppError)) {
    console.error("Unexpected error:", err); // Optional for debugging
  }

  res.status(statusCode).json({
    status,
    message,
  });
};


// const errorHandler = (
//   err: AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const statusCode = err.statusCode || 500;
//   const status = err.status || "error";

//   res.status(statusCode).json({
//     status,
//     message: err.message,
//   });
// };

export default errorHandler;