import { Request, Response } from "express";
import { performanceService } from "../services/performance.service";
import {
  validateCreateUser,
  validateListPerformanceParams,
} from "../validations/performance.validation";

class PerformanceMetricsController {
  async getAllMetrics(req: Request, res: Response): Promise<any> {
    const { error, value } = validateListPerformanceParams(req.query);

    if (error) {
      const messages = error.details.map((d: any) => d.message).join(", ");
      return res
        .status(400)
        .json({ error: "Validation Error", message: messages });
    }

    try {
      const getFirst = (param: any) =>
        Array.isArray(param) ? param[0] : param;

      const start = getFirst(value.start);
      const end = getFirst(value.end);
      const device = getFirst(value.device);

      const page = parseInt(value.page as string) || 1;
      const pageSize = parseInt(value.pageSize as string) || 10;

      const result = await performanceService.getMetricsService(
        start,
        end,
        device,
        page,
        pageSize
      );
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in controller:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Internal Server Error" });
    }
  }

  async getMetricsById(req: Request, res: Response): Promise<any> {
    try {
      const { computerId } = req.params;
      if (!computerId) {
        return res.status(400).json({ error: "Missing computerId in params." });
      }

      const device = req.query.device as string | undefined;

      const result = await performanceService.getMetricsByIdService(
        computerId,
        device
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in getMetricsById:", error);
      return res.status(error.status || 500).json({
        error: error.message || "Internal Server Error",
      });
    }
  }

  async getAsyncId(req: Request, res: Response): Promise<any> {
    try {
      const id = await performanceService.generateId();
      return res.status(200).json({ id });
    } catch (err) {
      return res.status(500).json({ error: "ID was not generated." });
    }
  }

  async userCreate(req: Request, res: Response): Promise<any> {
    const { error } = validateCreateUser(req.body);
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return res
        .status(400)
        .json({ error: "Validation Error", message: messages });
    }

    try {
      await performanceService.createUserWithLogs(req.body);
      return res.status(201).json({ message: "User created and logged." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export = new PerformanceMetricsController();
