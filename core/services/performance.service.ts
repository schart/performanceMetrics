import { Op } from "sequelize";
import { performanceRepository } from "../repositories/performance.repository";
import { randomUUID } from "crypto";

const pendingIds: Map<string, string> = new Map();
export const performanceService = {
  async getMetricsService(
    start?: string,
    end?: string,
    device?: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    const filters: any = {};
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Start date parse & validation
    if (start) {
      startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        throw new Error(
          "Invalid start date format. Use ISO format or yyyy-mm-dd."
        );
      }
    }

    // End date parse & validation
    if (end) {
      endDate = new Date(end);
      if (isNaN(endDate.getTime())) {
        throw new Error(
          "Invalid end date format. Use ISO format or yyyy-mm-dd."
        );
      }
    }

    if (device) {
      const targetModel = performanceRepository.findTargetModel(device);
      if (!targetModel) {
        throw new Error("Model not found.");
      }
    }

    console.log("Device: ", device);

    // Filter date range
    if (startDate && endDate) {
      filters.createdAt = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      filters.createdAt = { [Op.gte]: startDate };
    } else if (endDate) {
      filters.createdAt = { [Op.lte]: endDate };
    }
    console.log("Filters: ", filters);

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    return performanceRepository.findAll(filters, { limit, offset }, device);
  },

  async getMetricsByIdService(computerId: string, device?: string) {
    if (!computerId) {
      throw new Error("computerId param is required.");
    }

    if (device && !performanceRepository.findTargetModel(device)) {
      throw new Error("Model not found for device: " + device);
    }

    const result = await performanceRepository.findById(computerId, device);

    if (!result) {
      throw new Error("Metric not found.");
    }

    return result;
  },

  async generateId(): Promise<string> {
    const placeholderId = randomUUID();

    setTimeout(() => {
      const actualId = randomUUID();
      pendingIds.set(placeholderId, actualId);
      console.log(`[generateAsyncId] Real id generated: ${actualId}`);
    }, 5000);

    return placeholderId;
  },

  getRealId(placeholderId: string): string | null {
    return pendingIds.get(placeholderId) || null;
  },
};
