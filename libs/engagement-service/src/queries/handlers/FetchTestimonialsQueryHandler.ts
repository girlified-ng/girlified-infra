import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { FetchTestimonialsQuery } from '../impl';
import {
  Testimonial,
  TestimonialInfo,
} from '@app/common/src/models/testimonial.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { FormatTestimonialInfo } from '@app/common/src/middlewares/models.formatter';

@QueryHandler(FetchTestimonialsQuery)
export class FetchTestimonialsQueryHandler
  implements IQueryHandler<FetchTestimonialsQuery, TestimonialInfo[]>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async execute(query: FetchTestimonialsQuery) {
    try {
      const cacheKey = `testimonials`;

      // await this.cacheManager.del(cacheKey);

      // Try cache first
      // const cachedResult =
      //   await this.cacheManager.get<TestimonialInfo[]>(cacheKey);
      // if (cachedResult) {
      //   this.logger.log(
      //     `[FETCH-TESTIMONIALS-QUERY-HANDLER-CACHE-HIT]: ${cacheKey}`,
      //   );
      //   return cachedResult;
      // }

      this.logger.log(
        `[FETCH-TESTIMONIALS-QUERY-HANDLER-PROCESSING]: ${JSON.stringify(query)}`,
      );

      const testimonials = await this.testimonialRepository.find();

      const result = testimonials.map(FormatTestimonialInfo);

      const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

      await this.cacheManager.set(cacheKey, result, CACHE_TTL_MS);

      this.logger.log(`[FETCH-TESTIMONIALS-QUERY-HANDLER-SUCCESS]`);

      return result;
    } catch (error) {
      this.logger.log(`[FETCH-TESTIMONIALS-QUERY-HANDLER]: ${error}`);

      throw error;
    }
  }
}
