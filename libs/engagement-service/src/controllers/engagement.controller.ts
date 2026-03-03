import {
  Req,
  Post,
  Controller,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FetchTestimonialsQuery } from '../queries/impl';
import { EngagementService } from '../services/engagement.service';
import { TestimonialInfo } from '@app/common/src/models/testimonial.model';

@Controller({ path: 'testimonials' })
export class EngagementController {
  constructor(
    public queryBus: QueryBus,
    public commandBus: CommandBus,
    public readonly authService: EngagementService,
  ) { }

  @ApiTags('testimonials')
  @Get('feed')
  @ApiOkResponse({ isArray: true, type: TestimonialInfo })
  @ApiInternalServerErrorResponse()
  async fetchTestimonialsFeed(@Req() req: Request): Promise<TestimonialInfo[]> {
    return await this.queryBus.execute(new FetchTestimonialsQuery());
  }
}
