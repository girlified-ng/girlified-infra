import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from 'libs/common/src/models/account.model';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { Referral } from '@app/common/src/models/referral.model';
import { EngagementService } from './services/engagement.service';
import { EngagementServiceEventHandlers } from './events/handlers';
import { AppLogger } from '../../common/src/logger/logger.service';
import { EngagementServiceQueryHandlers } from './queries/handlers';
import { Testimonial } from '@app/common/src/models/testimonial.model';
import { EngagementServiceCommandHandlers } from './commands/handlers';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { EngagementController } from './controllers/engagement.controller';
import { HelperServiceModule } from 'libs/helper-service/src/helper-service.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    GetSystemJWTModule(),
    HelperServiceModule,
    TypeOrmModule.forFeature([
      Account,
      Referral,
      Testimonial,
      Notification,
    ]),
  ],
  providers: [
    EngagementService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    ...EngagementServiceQueryHandlers,
    ...EngagementServiceEventHandlers,
    ...EngagementServiceCommandHandlers,
  ],
  exports: [EngagementService],
  controllers: [EngagementController  ],
})
export class EngagementServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'engagement-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Engagement Docs')
        .setDescription('Engagement endpoints...')
        .setVersion('1.0')
        .build(),
    )(EngagementServiceModule);
  }
}
