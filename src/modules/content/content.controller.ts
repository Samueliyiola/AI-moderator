import type { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import responseHandler from "../../utils/responseHandler";
import HttpStatus from "../../utils/statusCodes";
import AppError from "../../utils/appError";
import { createContentService, getContentService } from "./content.service";

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

export const getContent = catchAsync(
    async (req: Request, res: Response) => {
        const contentId = Number(req.params.id);
        if(isNaN(contentId) || contentId <= 0 || !contentId) {
            throw new AppError(
                "Invalid content ID",
                HttpStatus.BAD_REQUEST
            );
        }
        const content = await getContentService(contentId);
        if (!content) {
            throw new AppError(
                "Content not found",
                HttpStatus.NOT_FOUND
            );
        }
        return responseHandler.success(
            res,
            HttpStatus.OK,
            content
        );
    }
);