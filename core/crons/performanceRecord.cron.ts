import cron from "node-cron";
import { performanceRepository } from "../repositories/performance.repository";

export const scheduleMetricRecorder = (cronRange: string) => {
  if (!cron.validate(cronRange)) {
    throw new Error("Invalid cron expression: " + cronRange);
  }

  // Start a cron job
  const job = cron.schedule(cronRange, async () => {
    const metricToRecord = process.env.METRIC_TO_RECORD || "ram";
    performanceRepository.create(metricToRecord);
  });
  return job;
};
