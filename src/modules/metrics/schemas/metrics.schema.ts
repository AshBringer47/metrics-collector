import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {MetricsData} from "~src/modules/metrics/types/metrics-data.type";

export type MetricsDocument = HydratedDocument<Metrics>;

@Schema()
export class Metrics {
  @Prop()
  service_id: string;
  @Prop({ type: Object })
  metrics: MetricsData;
  @Prop({ default: Date.now })
  created_at: Date;
}

export const MetricsSchema = SchemaFactory.createForClass(Metrics);
