import type { Response } from "express";

/**
 * A helper function to standardize the response format for success and error responses.
 */

const responseHandler = {
  success: (res: Response, statusCode: number, data: any) => {
    res.status(statusCode).json({
      status: "success",
      data,
    });
  },

  error: (res: Response, error: { statusCode?: number; message: string }) => {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  },
};

export default responseHandler;