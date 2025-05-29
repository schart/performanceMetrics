import { Router } from "express";
import {
  getAllMetricsController,
  getMetricsDetailController,
} from "../controllers/performance.controller";

const router = Router();

router.get(
  "/metrics", //:start/:end/:device/:page/:pageSize",
  getAllMetricsController
);
router.get("/metrics/:computerId", getMetricsDetailController);

export default router;
