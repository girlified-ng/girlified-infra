import {
  MonthlySurvey,
  MonthlySurveyInfo,
} from '../models/monthly.survey.model';
import { Order, OrderInfo } from '../models/order.model';
import { AccountInfo, Account } from '../models/account.model';
import { Notification, NotificationInfo } from '../models/notification.model';
import { FormatMonthlySurveyPeriodDurationEnum } from '../helpers/enum.helper';
import { Testimonial, TestimonialInfo } from '../models/testimonial.model';

export function FormatAccountInfo(account: Account): AccountInfo {
  delete account.password;
  delete account.newEmail;
  delete account.newPhone;
  delete account.createdAt;
  delete account.updatedAt;
  delete account.lastLogin;
  delete account.referredBy;
  delete account.activationCode;
  delete account.passwordResetCode;
  delete account.passwordResetToken;
  delete account.temporalAccessToken;
  delete account.activationCodeExpires;
  delete account.signupVerificationHash;
  delete account.passwordResetCodeExpires;

  return {
    ...account,
    id: account.id.toString(),
  } as AccountInfo;
}

export function FormatNotification(
  notification: Notification,
): NotificationInfo {
  delete notification.account;

  return {
    id: notification.id.toString(),
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  } as unknown as NotificationInfo;
}

export function FormatMonthlySurveyInfo(
  monthlySurvey: MonthlySurvey,
): MonthlySurveyInfo {
  return {
    id: monthlySurvey.id.toString(),
    hasAccessToPad: monthlySurvey.hasAccessToPad,
    daysManagingPeriod: FormatMonthlySurveyPeriodDurationEnum(
      monthlySurvey.daysManagingPeriod,
    ),
    challengesFaced: JSON.parse(monthlySurvey.challengesFaced),
  } as MonthlySurveyInfo;
}

export function FormatOrderInfo(order: Order): OrderInfo {
  return {
    address: order.address,
    orderId: order.orderId,
    id: order.id.toString(),
    quantity: order.quantity,
    isCompleted: order.isCompleted,
    deliveryMethod: order.deliveryMethod,
    buildingNumber: order.buildingNumber,
    nearestLandmark: order.nearestLandmark,
  } as OrderInfo;
}

export function FormatTestimonialInfo(
  testimonial: Testimonial,
): TestimonialInfo {
  return {
    age: testimonial.age,
    author: testimonial.author,
    id: testimonial.id.toString(),
    avatarUrl: testimonial.avatarUrl,
    createdAt: testimonial.createdAt,
    testimonial: testimonial.testimonial,
  } as TestimonialInfo;
}

export default {
  FormatOrderInfo,
  FormatAccountInfo,
  FormatNotification,
  FormatTestimonialInfo,
  FormatMonthlySurveyInfo,
};
