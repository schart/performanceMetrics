import { Request, Response } from "express";
import { performanceService } from "../services/performance.service";
import {
  validateListComputerId,
  validateListPerformanceParams,
} from "../validations/performance.validation";

export async function getAllMetricsController(
  req: Request,
  res: Response
): Promise<any> {
  const { error, value } = validateListPerformanceParams(req.query);
  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details.map((d: any) => d.message).join(", "),
    });
  }

  try {
    const start = Array.isArray(value.start) ? value.start[0] : value.start;
    const end = Array.isArray(value.end) ? value.end[0] : value.end;
    const device = Array.isArray(value.device) ? value.device[0] : value.device;

    const page =
      typeof value.page === "string" ? parseInt(value.page) : value.page || 1;
    const pageSize =
      typeof value.pageSize === "string"
        ? parseInt(value.pageSize)
        : value.pageSize || 10;

    const result = await performanceService.getMetrics(
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

export async function getMetricsDetailController(
  req: Request,
  res: Response
): Promise<any> {
  const { error } = validateListComputerId(req.params);
  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details.map((d: any) => d.message).join(", "),
    });
  }
  //
  try {
    const { computerId } = req.params;

    const start = Array.isArray(req.query.start)
      ? (req.query.start[0] as string | undefined)
      : (req.query.start as string | undefined);
    const end = Array.isArray(req.query.end)
      ? (req.query.end[0] as string | undefined)
      : (req.query.end as string | undefined);
    const device = Array.isArray(req.query.device)
      ? (req.query.device[0] as string | undefined)
      : (req.query.device as string | undefined);

    const page =
      typeof req.query.page === "string"
        ? parseInt(req.query.page)
        : Number(req.query.page) || 1;
    const pageSize =
      typeof req.query.pageSize === "string"
        ? parseInt(req.query.pageSize)
        : Number(req.query.pageSize) || 10;

    const detail = await performanceService.getMetricDetailById(
      computerId,
      start,
      end,
      device,
      page,
      pageSize
    );

    if (!detail || detail.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: `No metric found with id: ${computerId}`,
      });
    }

    return res.status(200).json(detail);
  } catch (error: any) {
    console.error("Error in getMetricsDetailController:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
