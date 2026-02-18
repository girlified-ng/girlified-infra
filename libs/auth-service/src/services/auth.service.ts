import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import {
  AvailabilityCheckInfo,
  ClinicalTrialSimulationDTO,
} from '../interface';
import { Account } from 'libs/common/src/models/account.model';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { AppLogger } from '../../../common/src/logger/logger.service';
import FCMessaging from '@app/notification-service/src/bases/FCMessaging';
import { ReferralCodeGenerator } from '@app/common/src/utils/id.generator';
import { EmailSenderService } from '@app/helper-service/src/services/email-sender.service';
import { AuthEmailNotificationService } from '@app/notification-service/src/services/email/auth.email.notification.service';

@Injectable()
export class AuthService {
  private geminiAI: GoogleGenAI;

  constructor(
    public jwtService: JwtService,
    public commandBus: CommandBus,
    private configService: ConfigService,
    private authEmailNotificationService: AuthEmailNotificationService,
    @Inject('Logger') private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Account)
    private readonly userRepository: Repository<Account>,
  ) {
    this.geminiAI = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  generateUserJWT(user: Account) {
    try {
      this.logger.log(`[SIGN-JWT-PROCESSING] : {User - ${user.id}}`);

      const jwt = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          status: user.status,
          role: `${user.accountType}`,
        },
        {
          subject: `${user.id}`,
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      this.logger.log(`[SIGN-JWT-SUCCESS]`);

      return 'Bearer ' + jwt;
    } catch (error) {
      this.logger.error(`[SIGN-JWT-ERROR] : ${error}`);
    }
  }

  async generateReferralCode(): Promise<string> {
    let referralCode: string;

    do {
      referralCode = ReferralCodeGenerator();
    } while (
      await this.userRepository.exists({
        where: { referralCode: referralCode },
      })
    );

    return referralCode;
  }

  async isEmailAvailable(email: string): Promise<AvailabilityCheckInfo> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    const isAvailable = !existingUser || !!existingUser.signupVerificationHash;

    this.logger.log(`[IS-EMAIL-AVAILABLE] : ${isAvailable}`);

    return {
      isAvailable,
    };
  }

  async sendTestNotification(fcmToken: string): Promise<void> {
    try {
      this.logger.log(`[SEND-TEST-NOTIFICATION-PROCESSING]`);

      await FCMessaging.sendNotification(fcmToken, {
        title: 'Test Notification',
        body: 'This is a test notification',
        data: {
          type: 'test',
        },
      });

      this.logger.log(`[SEND-TEST-NOTIFICATION-SUCCESS]`);
    } catch (error) {
      this.logger.error(`[SEND-TEST-NOTIFICATION-ERROR] :: ${error}`);
    }
  }

}
