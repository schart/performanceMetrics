import { PerformanceMetric } from "../models/performance.model";

export const performanceRepository = {
  async getMetricsBetween(
    filters: any,
    pagination?: { limit: number; offset: number },
    deviceFilter?: string
  ) {
    return PerformanceMetric.findAll({
      where: filters,
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [["createdAt", "DESC"]],
    });
  },

  async findByComputerIdWithFilters(
    filters: any,
    pagination?: { limit: number; offset: number }
  ) {
    return PerformanceMetric.findAll({
      where: filters,
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [["createdAt", "DESC"]],
    });
  },
};
//
