import { Router } from "express";
import { createContent } from "./content.controller";

const contentRouter = Router();

// POST /content
contentRouter.post("/", createContent);

export default contentRouter;