import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { DB_CONFIG } from "../config";
import { Sequelize } from "sequelize-typescript";
import { PerformanceMetric } from "./models/performance.model";
import performanceMetricrouter from "./routers/performance.router";
import { scheduleMetricRecorder } from "./crons/performanceRecord.cron";
import { errorHandler } from "./middleware/generalErrorHandler.middleware";

const app = express();
app.use(express.json());
app.use(errorHandler);
app.use("/performance", performanceMetricrouter);

export const sequelize = new Sequelize({
  database: DB_CONFIG.DB_NAME,
  username: DB_CONFIG.DB_USER,
  password: DB_CONFIG.DB_PASS,
  host: DB_CONFIG.DB_HOST,
  port: DB_CONFIG.DB_PORT,
  dialect: "postgres",
  models: [PerformanceMetric],
  logging: false, // LOGGER -> console.log()
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connected");

    // Record performance metrics every 5 minutes
    console.log("Starting *recording* all personal PCs...");
    const cronRange = String(process.env.METRIC_LISTEN_RANGE);
    console.log("cronRange: ", cronRange);
    scheduleMetricRecorder(cronRange);

    await sequelize.sync({ alter: true });
    console.log("Models synchronized");
  } catch (error) {
    console.error(error);
  }
})();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
