// mappers/performance.mapper.ts
import { PerformanceMetric } from "../models/performance.model";

export const mapToPublicMetric = (metric: PerformanceMetric) => ({
  id: metric.id,
  computerId: metric.computerId,
  cpu: metric.cpu,
  ram: metric.ram,
  disk: metric.disk,
});
