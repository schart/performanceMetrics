import { Op } from "sequelize";
import { performanceRepository } from "../repositories/performance.repository";

export const performanceService = {
  async getMetrics(
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

    if (startDate && endDate) {
      filters.createdAt = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      filters.createdAt = { [Op.gte]: startDate };
    } else if (endDate) {
      filters.createdAt = { [Op.lte]: endDate };
    }

    if (device) {
      const deviceLower = device.toLowerCase();

      if (deviceLower === "cpu") {
        filters.cpu = { [Op.ne]: null };
      } else if (deviceLower === "disk") {
        filters.disk = { [Op.ne]: null };
      } else if (deviceLower === "ram") {
        filters.ram = { [Op.ne]: null };
      } else {
        throw new Error("Invalid device type. Must be cpu, disk or ram.");
      }
    }

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    return performanceRepository.getMetricsBetween(
      filters,
      { limit, offset },
      device
    );
  },

  async getMetricDetailById(
    computerId: string,
    start?: string,
    end?: string,
    device?: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    const filters: any = { computerId };

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

    if (startDate && endDate) {
      filters.createdAt = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      filters.createdAt = { [Op.gte]: startDate };
    } else if (endDate) {
      filters.createdAt = { [Op.lte]: endDate };
    }

    if (device) {
      const deviceLower = device.toLowerCase();

      if (deviceLower === "cpu") {
        filters.cpu = { [Op.ne]: null };
      } else if (deviceLower === "disk") {
        filters.disk = { [Op.ne]: null };
      } else if (deviceLower === "ram") {
        filters.ram = { [Op.ne]: null };
      } else {
        throw new Error("Invalid device type. Must be cpu, disk or ram.");
      }
    }

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    return performanceRepository.findByComputerIdWithFilters(filters, {
      limit,
      offset,
    });
  },
};
