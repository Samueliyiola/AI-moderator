import { Router } from "express";
import { createContent, getContent } from "./content.controller";

const contentRouter = Router();

// POST /content
contentRouter.post("/", createContent);

// GET /content
contentRouter.get("/:id", getContent);

export default contentRouter;