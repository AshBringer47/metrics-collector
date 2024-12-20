import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Metrics, MetricsSchema } from "./schemas/metrics.schema";
import { MetricsCollectionRepository } from "~src/modules/metrics/repositories/metrics-collection.repository";
import { MetricsController } from "~src/modules/metrics/controllers/metrics.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Metrics.name, schema: MetricsSchema }]),
  ],
  providers: [MetricsCollectionRepository],
  controllers: [MetricsController],
  exports: [MetricsCollectionRepository],
})
export class MetricsModule {}
