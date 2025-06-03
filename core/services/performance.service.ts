import { Op } from "sequelize";
import { performanceRepository } from "../repositories/performance.repository";
import { randomUUID } from "crypto";
import { sequelize } from "../app";

const idCache: string[] = [];
const MAX_CACHE_SIZE = 100;
let isRefilling = false;

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

    if (start) {
      startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        throw new Error(
          "Invalid start date format. Use ISO format or yyyy-mm-dd."
        );
      }
    }

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

    if (startDate && endDate) {
      filters.createdAt = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      filters.createdAt = { [Op.gte]: startDate };
    } else if (endDate) {
      filters.createdAt = { [Op.lte]: endDate };
    }

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    return performanceRepository.findAll(filters, { limit, offset }, device);
  },

  async getMetricsByIdService(computerId: string, device?: string) {
    if (!computerId) throw new Error("computerId param is required.");
    if (device && !performanceRepository.findTargetModel(device)) {
      throw new Error("Model not found for device: " + device);
    }

    const result = await performanceRepository.findById(computerId, device);
    if (!result) throw new Error("Metric not found.");
    return result;
  },

  /*
    @ GENERATE IDS
  */

  async generateId(): Promise<string> {
    return performanceService.getCachedId();
  },

  async preloadIds(count: number) {
    if (isRefilling) return;
    isRefilling = true;

    try {
      const newIds = Array.from({ length: count }, () => randomUUID());
      idCache.push(...newIds);
    } finally {
      isRefilling = false;
    }
  },

  getCachedId(): string {
    if (idCache.length === 0) {
      throw new Error("ID cache is empty, please wait.");
    }

    const id = idCache.shift()!;

    if (idCache.length < MAX_CACHE_SIZE) {
      const refillCount = MAX_CACHE_SIZE - idCache.length;
      performanceService.preloadIds(refillCount);
    }

    return id;
  },

  /*
   *  USER CREATE
   */

  async createUserWithLogs(data: any) {
    const transaction = await sequelize.transaction();

    try {
      await performanceRepository.logIncomingRequest(data, transaction);

      await performanceRepository.insertUser(data, transaction);

      await transaction.commit();
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw new Error("Transaction failed: " + (error as any).message);
    }
  },
};

performanceService.preloadIds(MAX_CACHE_SIZE);
