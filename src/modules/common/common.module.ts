import { Module } from "@nestjs/common";
import { MongooseDatabaseModule } from "~src/database/database.module";
import { CommonController } from "./controllers/common.controller";

@Module({
  imports: [MongooseDatabaseModule],
  controllers: [CommonController],
  providers: [],
})
export class CommonModule {}
