import { Router, type Router as ExpressRouter } from "express";
import { getCommentsHandler } from "../controller/commentsController.js";

export const commentsRouter: ExpressRouter = Router();

commentsRouter.get("/", getCommentsHandler);
