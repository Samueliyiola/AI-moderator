import type { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import responseHandler from "../../utils/responseHandler";
import HttpStatus from "../../utils/statusCodes";
import AppError from "../../utils/appError";
import { createContentService } from "./content.service";

import { prisma } from "../../core/config/db";

export const createContent = catchAsync(
  async (req: Request, res: Response) => {

    const { text } = req.body;

    if (!text) {
      throw new AppError(
        "Text is required",
        HttpStatus.BAD_REQUEST
      );
    }

    const content = await createContentService(text);

    return responseHandler.success(
      res,
      HttpStatus.CREATED,
      content
    );
  }
);