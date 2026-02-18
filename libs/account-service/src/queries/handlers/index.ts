import { FetchDetailedAccountInfoQueryHandler } from './FetchDetailedAccountInfoQueryHandler';
import { FetchMonthlySurveyHistoryQueryHandler } from './FetchMonthlySurveyHistoryQueryHandler';
import { FetchSanitaryPadOrderHistoryQueryHandler } from './FetchSanitaryPadOrderHistoryQueryHandler';

export const AccountServiceQueryHandlers = [
  FetchDetailedAccountInfoQueryHandler,
  FetchMonthlySurveyHistoryQueryHandler,
  FetchSanitaryPadOrderHistoryQueryHandler,
];
