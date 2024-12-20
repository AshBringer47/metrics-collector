import {MetricsDocument, Metrics} from "../schemas/metrics.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class MetricsCollectionRepository {
  constructor(
    @InjectModel(Metrics.name)
    private messageModel: Model<MetricsDocument>,
  ) {}

  async create(body: any): Promise<Metrics> {
    const response = new this.messageModel(body);
    return await response.save();
  }

  async findByCorrelationId(correlationId: string): Promise<Metrics> {
    return this.messageModel
      .findOne({
        correlation_id: correlationId,
      })
      .exec();
  }
}
