import cron from "node-cron";
import { randomUUID } from "crypto";
import { PerformanceMetric } from "../models/performance.model";

export const scheduleMetricRecorder = (cronRange: string) => {
  if (!cron.validate(cronRange)) {
    throw new Error("Invalid cron expression: " + cronRange);
  }

  const job = cron.schedule(cronRange, async () => {
    const metricToRecord = process.env.METRIC_TO_RECORD || "ram";
    console.log(
      `[Record Performance Metrics] -> Recording metric: ${metricToRecord}`
    );

    const computerIds = await PerformanceMetric.findAll({
      attributes: ["computerId"],
    });

    const generateMetricValue = () =>
      parseFloat((Math.random() * 100).toFixed(2));

    // If any data does not exists
    if (computerIds.length === 0) {
      for (let i = 0; i < 20; i++) {
        const newMetric = {
          computerId: randomUUID(),
          cpu: generateMetricValue(),
          ram: generateMetricValue(),
          disk: generateMetricValue(),
        };

        // if (metricToRecord === "cpu" || metricToRecord === "all") {
        //   newMetric.cpu = generateMetricValue();
        // }
        // if (metricToRecord === "ram" || metricToRecord === "all") {
        //   newMetric.ram = generateMetricValue();
        // }
        // if (metricToRecord === "disk" || metricToRecord === "all") {
        //   newMetric.disk = generateMetricValue();
        // }

        await PerformanceMetric.create(newMetric);
      }
    }

    // If already exists least 20 record
    const computerIdValues = computerIds.map((m) => m.computerId);
    console.log(
      "[Record Performance Metrics] -> Computer Id Values Count:",
      computerIdValues.length
    );

    for (const computerId of computerIdValues) {
      const newMetric = {
        computerId,
        cpu: 0,
        ram: 0,
        disk: 0,
      };

      if (metricToRecord === "cpu" || metricToRecord === "all") {
        newMetric.cpu = generateMetricValue();
      }
      if (metricToRecord === "ram" || metricToRecord === "all") {
        newMetric.ram = generateMetricValue();
      }
      if (metricToRecord === "disk" || metricToRecord === "all") {
        newMetric.disk = generateMetricValue();
      }

      await PerformanceMetric.create(newMetric);
    }

    console.log("[Record Performance Metrics] -> Metrics saved to DB.");
  });

  return job;
};
