import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountSocialHandlesCommand } from '../impl';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import modelsFormatter from '@app/common/src/middlewares/models.formatter';
import { Account, AccountInfo } from 'libs/common/src/models/account.model';

@CommandHandler(UpdateAccountSocialHandlesCommand)
export class UpdateAccountSocialHandlesHandler
  implements ICommandHandler<UpdateAccountSocialHandlesCommand, AccountInfo> {
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }

  async execute(command: UpdateAccountSocialHandlesCommand) {
    try {
      this.logger.log(`[UPDATE-ACCOUNT-SOCIAL-HANDLES-HANDLER-PROCESSING]`);

      const { payload, secureUser } = command;

      const account = await this.accountRepository.findOne({
        where: {
          id: secureUser.id,
        },
      });

      if (!account) {
        throw new UnauthorizedException('Account not found.');
      }

      Object.assign(account, {
        xHandle: payload.xHandle,
        tiktokHandle: payload.tiktokHandle,
        snapchatHandle: payload.snapchatHandle,
        instagramHandle: payload.instagramHandle,
      });

      await this.accountRepository.save(account);

      this.logger.log(`[UPDATE-ACCOUNT-SOCIAL-HANDLES-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatAccountInfo(account);
    } catch (error) {
      this.logger.log(`[UPDATE-ACCOUNT-SOCIAL-HANDLES-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
