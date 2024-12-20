import {Controller, Get, HttpStatus, Query} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ExceptionErrorDto } from "~common/dto/exception.error.dto";
import {MetricsCollectionRepository} from "~src/modules/metrics/repositories/metrics-collection.repository";

@ApiTags("messages")
@Controller("messages")
export class MetricsController {
  constructor(private readonly metricsCollectionRepository: MetricsCollectionRepository) {}
  @Get("/")
  @ApiBadRequestResponse({ type: ExceptionErrorDto })
  @ApiNotFoundResponse({ type: ExceptionErrorDto })
  public async getByCorrelationId(@Query() querystring: any): Promise<any> {
    return await this.metricsCollectionRepository.findByCorrelationId(querystring.correlation_id);
  }
}
