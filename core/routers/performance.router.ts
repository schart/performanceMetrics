import { Router } from "express";
import PerformanceMetricsController from "../controllers/performance.controller";
// import {
//   getAllMetricsController,
//   getMetricsDetailController,
// } from "../controllers/performance.controller";

const router = Router();

router.get(
  "/metrics", //:start/:end/:device/:page/:pageSize",
  PerformanceMetricsController.getAllMetrics
);

router.get(
  "/metrics/:computerId", //:start/:end/:device/:page/:pageSize",
  PerformanceMetricsController.getMetricsById
);

router.get("/id/generate", PerformanceMetricsController.getAsyncId);
router.get("/id/:placeHolderId", PerformanceMetricsController.getActualId);
export default router;
