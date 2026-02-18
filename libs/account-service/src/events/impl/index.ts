import { Order } from '@app/common/src/models/order.model';
import { Account } from '@app/common/src/models/account.model';

export class OrderSanitaryPadEvent {
  constructor(
    public readonly order: Order,
    public readonly account: Account,
  ) {}
}
