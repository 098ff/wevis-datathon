import { Router, type Router as ExpressRouter } from "express";
import {
    getPartiesHandler,
    getPartiesClusteringHandler,
    getPartiesSpiderHandler,
    getPartiesPerformanceHandler,
} from "../controller/partiesController.js";

export const partiesRouter: ExpressRouter = Router();

partiesRouter.get("/", getPartiesHandler);
partiesRouter.get("/clustering", getPartiesClusteringHandler);
partiesRouter.get("/spider", getPartiesSpiderHandler);
partiesRouter.get("/performance", getPartiesPerformanceHandler);
