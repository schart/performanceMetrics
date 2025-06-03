import {
  CpuMetrics,
  DiskMetrics,
  IncomingRequestLog,
  RamMetrics,
  Users,
} from "../models/performance.model";
import { sequelize } from "../app";
import { randomUUID } from "crypto";
import { timeStamp } from "console";

export const performanceRepository = {
  create: async (_device: string) => {
    const targetModel = performanceRepository.findTargetModel(_device);
    if (targetModel) {
      targetModel.create({
        computerId: randomUUID(),
        device: _device,
        name: _device,
        performance: parseFloat((Math.random() * 100).toFixed(2)),
      });
      console.log("Created new record");
    }
    return;
  },

  findTargetModel: (_device?: string | "ram") => {
    for (const model of sequelize.modelManager.all) {
      const castedModel =
        (model as typeof RamMetrics) || CpuMetrics || DiskMetrics;

      const targetModel = castedModel.deviceType == _device;
      if (targetModel === true) return castedModel;
    }
  },

  findAll: async (
    filters: any,
    pagination?: { limit: number; offset: number },
    deviceFilter?: string
  ) => {
    console.log("device filter: ", deviceFilter);
    if (!deviceFilter) {
      const allModels = sequelize.modelManager.all;

      const allResults = await Promise.all(
        allModels.map((model: any) =>
          model
            .findAll({
              where: filters,
              limit: pagination?.limit,
              offset: pagination?.offset,
              order: [["createdAt", "DESC"]],
            })
            .catch(() => [])
        )
      );

      return allResults.flat();
    }

    const targetModel = performanceRepository.findTargetModel(deviceFilter);
    if (!targetModel) {
      console.warn("[findAll] No model found for device filter:", deviceFilter);
      return [];
    }

    return targetModel.findAll({
      where: filters,
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [["createdAt", "DESC"]],
    });
  },

  findById: (computerId: string, deviceFilter?: string) => {
    const targetModel = performanceRepository.findTargetModel(deviceFilter);
    if (targetModel) {
      return targetModel.findOne({
        where: { computerId: computerId },
        order: [["createdAt", "DESC"]],
      });
    }

    console.log("[findById] targetModel not found for device:", deviceFilter);
    return null;
  },

  async logIncomingRequest(payload: any, transaction: any) {
    payload.id = randomUUID();
    payload.createAt = new Date().toISOString();

    return IncomingRequestLog.create(
      {
        payload: JSON.stringify(payload),
      },
      { transaction }
    );
  },

  async insertUser(payload: any, transaction: any) {
    return Users.create(
      {
        operation: "INSERT",
        payload: JSON.stringify(payload),
      },
      { transaction }
    );
  },
};
