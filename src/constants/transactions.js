export const TRANSACTION_STATUSES = {
  ITEM_HOLD: 'ITEM_HOLD',
  PATRON_HOLD: 'PATRON_HOLD',
  LOCAL_HOLD: 'LOCAL_HOLD',
  TRANSFER: 'TRANSFER',
  ITEM_SHIPPED: 'ITEM_SHIPPED',
  ITEM_IN_TRANSIT: 'ITEM_IN_TRANSIT',
  ITEM_RECEIVED: 'ITEM_RECEIVED',
  RECEIVE_UNANNOUNCED: 'RECEIVE_UNANNOUNCED',
  RETURN_UNCIRCULATED: 'RETURN_UNCIRCULATED',
  LOCAL_CHECKOUT: 'LOCAL_CHECKOUT',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  BORROWING_SITE_CANCEL: 'BORROWING_SITE_CANCEL',
  BORROWER_RENEW: 'BORROWER_RENEW',
  CLAIMS_RETURNED: 'CLAIMS_RETURNED',
  RECALL: 'RECALL',
  FINAL_CHECKIN: 'FINAL_CHECKIN',
};

export const TRANSACTION_FILTER_NAMES = {
  TRANSACTION_TYPE: 'transactionType',
  TRANSACTION_STATUS: 'transactionStatus',
  CENTRAL_SERVER: 'centralServer',
  PATRON_AGENCY: 'patronAgency',
  ITEM_AGENCY: 'itemAgency',
  PATRON_TYPE: 'patronType',
};

export const TRANSACTION_TYPES = {
  ITEM: 'item',
  PATRON: 'patron',
  LOCAL: 'local',
};

export const TRANSACTION_FIELDS = {
  ID: 'id',
  TIME: 'time',
  TYPE: 'type',
  ITEM_TITLE: 'itemTitle',
  PATRON_NAME: 'patronName',
  STATUS: 'status',
};

export const TRANSACTION_LIST_DEFAULT_SORT_FIELD = TRANSACTION_FIELDS.TIME;

export const RESULT_COUNT_INCREMENT = 100;

export const TRANSACTION_SUMMARY = 'transactionSummary';
export const PATRON_INFORMATION = 'patronInformation';
export const ITEM_INFORMATION = 'itemInformation';

export const TRANSACTION_DETAIL_ACCORDION_STATE = {
  [TRANSACTION_SUMMARY]: true,
  [PATRON_INFORMATION]: true,
  [ITEM_INFORMATION]: true,
};

export const TRANSACTION_DETAIL_FIELDS = {
  TITLE: 'title',
  TRANSACTION_TIME: 'transactionTime',
  TRACKING_ID: 'trackingId',
  TYPE: 'type',
  STATE: 'state',
  PATRON_NAME: 'patronName',
  PICKUP_LOCATION: 'pickupLocation',
  PATRON_ID: 'patronId',
  ITEM_ID: 'itemId',
  CENTRAL_PATRON_TYPE: 'centralPatronType',
  PATRON_AGENCY: 'patronAgencyCode',
  CENTRAL_ITEM_TYPE: 'centralItemType',
  AUTHOR: 'author',
  CALL_NUMBER: 'callNumber',
  ITEM_AGENCY_CODE: 'itemAgencyCode',
  METADATA: 'metadata',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  HOLD: 'hold',
  CENTRAL_SERVER_CODE: 'centralServerCode',
  CREATED_BY_USER_NAME: 'createdByUsername',
  FOLIO_REQUEST_ID: 'folioRequestId',
  FOLIO_LOAN_ID: 'folioLoanId',
  FOLIO_PATRON_ID: 'folioPatronId',
  FOLIO_ITEM_ID: 'folioItemId',
  INSTANCE_ID: 'instanceId',
  HOLDINGS_ID: 'holdingsId',
};
