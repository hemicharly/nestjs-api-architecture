export const CodeError = {
  ORDER_NOT_FOUND: { code: 'TT_000001', message: 'Order not found.' },
  ORDER_NOT_OPEN: { code: 'TT_000002', message: 'Order is not open.' },
  ORDER_NOT_IN_PROGRESS: {
    code: 'TT_000003',
    message: 'Order is not in progress.'
  },
  ORDER_INVALID_GEOLOCATION: {
    code: 'TT_000004',
    message: 'Invalid geolocation.'
  },
  ORDER_INVALID_GEOLOCATION_LOCAL: {
    code: 'TT_000005',
    message: 'You are not at the location where the service is provided. Try again.'
  },
  INVALID_BETWEEN_DATES: {
    code: 'TT_000006',
    message: 'The start date end date are required. Try again.'
  },
  START_DATE_GREATER_THAN_END_DATE: {
    code: 'TT_000007',
    message: 'The start date cannot be greater than the end date. Try again.'
  }
};
