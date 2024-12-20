import { IConfig, NodeEnvTypes } from "../types/interface";
import process from "node:process";

const applicationDevelopmentConfig: IConfig = {
  nodeEnv: NodeEnvTypes.development,
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT),
  },
  db: {
    connectionName: "default",
    uri: process.env.MONGO_DB_URI,
  },
  app: {
    name: "Metrics Collector Service",
    abbr: "LB",
    version: "1.0.0",
    documentation: {
      title: "API",
      description: "REST API Documentation",
      prefix: "/api/docs",
    },
    routes: {
      mainPrefix: "/api/v1",
    },
  },
  microserviceFunctionGroups: {
    sendNotification: process.env.SEND_NOTIFICATION_FUNCTION_GROUP,
    processData: process.env.PROCESS_DATA_FUNCTION_GROUP,
  },
  services: {
    consul: "http://localhost:8500",
    loadBalancer: "http://localhost:3000",
  }
} as const;

export default applicationDevelopmentConfig;
