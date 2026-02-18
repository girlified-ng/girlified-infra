import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder } from '@nestjs/swagger';
import { Order } from '@app/common/src/models/order.model';
import { AccountService } from './services/account.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Report } from '@app/common/src/models/report.model';
import { Account } from 'libs/common/src/models/account.model';
import { AccountServiceEventHandlers } from './events/handlers';
import { setupSwaggerDocument } from '../../common/src/swagger';
import { AccountServiceQueryHandlers } from './queries/handlers';
import { OrderController } from './controllers/order.controller';
import { AppLogger } from '../../common/src/logger/logger.service';
import { AccountServiceCommandHandlers } from './commands/handlers';
import { AccountController } from './controllers/account.controller';
import { GetSystemJWTModule } from 'libs/common/src/middlewares/config';
import { Notification } from '@app/common/src/models/notification.model';
import { MonthlySurvey } from '@app/common/src/models/monthly.survey.model';
import { HelperServiceModule } from '@app/helper-service/src/helper-service.module';
import { SupportService } from '@app/notification-service/src/services/support.service';
import { EmailSenderService } from '@app/helper-service/src/services/email-sender.service';
import { SupportController } from '@app/notification-service/src/controllers/support.controller';
import { ImageUploadController } from '@app/helper-service/src/controllers/image-upload.controller';
import { AccountNotificationService } from '@app/notification-service/src/services/account.notification.service';
import { AccountNotificationController } from '@app/notification-service/src/controllers/account.notification.controller';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';
import { OrderEmailNotificationService } from '@app/notification-service/src/services/email/order.email.notification.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    HelperServiceModule,
    GetSystemJWTModule(),
    TypeOrmModule.forFeature([
      Order,
      Report,
      Account,
      Notification,
      MonthlySurvey,
    ]),
  ],
  controllers: [
    OrderController,
    AccountController,
    SupportController,
    ImageUploadController,
    AccountNotificationController,
  ],
  providers: [
    AccountService,
    {
      provide: 'Logger',
      useClass: AppLogger,
    },
    SupportService,
    EmailSenderService,
    AccountNotificationService,
    AuthEmailNotificationService,
    OrderEmailNotificationService,
    ...AccountServiceQueryHandlers,
    ...AccountServiceEventHandlers,
    ...AccountServiceCommandHandlers,
  ],
  exports: [AccountService],
})
export class AccountServiceModule {
  constructor(private configService: ConfigService) {
    setupSwaggerDocument(
      'account-service',
      new DocumentBuilder()
        .addBearerAuth()
        .addServer(this.configService.get<string>('API_HOST'))
        .setTitle('Account Docs')
        .setDescription('Account endpoints...')
        .setVersion('2.0')
        .build(),
    )(AccountServiceModule);
  }
}
