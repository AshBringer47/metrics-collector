import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { LoggerModule } from "~common/logger/logger.module";
import { MongooseDatabaseModule } from "~src/database/database.module";
import { CommonModule } from "~src/modules/common/common.module";
import { MetricsModule } from "~src/modules/metrics/metrics.module";

@Module({
  imports: [
    ConfigModule,
    MongooseDatabaseModule,
    LoggerModule,
    MetricsModule,
    CommonModule,
  ],
})
export class AppModule {}
