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
  OWNER_RENEW: 'OWNER_RENEW',
};

export const TRANSACTION_TYPES = {
  ITEM: 'ITEM',
  PATRON: 'PATRON',
  LOCAL: 'LOCAL',
};

export const HOLD_FIELDS = {
  ID: 'id',
  TRANSACTION_TIME: 'transactionTime',
  PICK_UP_LOCATION: 'pickupLocation',
  PATRON_ID: 'patronId',
  PATRON_AGENCY_CODE: 'patronAgencyCode',
  ITEM_AGENCY_CODE: 'itemAgencyCode',
  ITEM_ID: 'itemId',
  NEED_BEFORE: 'needBefore',
  CENTRAL_ITEM_TYPE: 'centralItemType',
  CENTRAL_PATRON_TYPE: 'centralPatronType',
  PATRON_NAME: 'patronName',
  PATRON_HOME_LIBRARY: 'patronHomeLibrary',
  PATRON_PHONE: 'patronPhone',
  TITLE: 'title',
  AUTHOR: 'author',
  CALL_NUMBER: 'callNumber',
  SHIPPED_ITEM_BARCODE: 'shippedItemBarcode',
  METADATA: 'metadata',
  FOLIO_ITEM_ID: 'folioItemId',
  FOLIO_PATRON_ID: 'folioPatronId',
  FOLIO_REQUEST_ID: 'folioRequestId',
  FOLIO_INSTANCE_ID: 'folioInstanceId',
  FOLIO_HOLDING_ID: 'folioHoldingId',
  FOLIO_LOAN_ID: 'folioLoanId',
  FOLIO_PATRON_BARCODE: 'folioPatronBarcode',
  FOLIO_ITEM_BARCODE: 'folioItemBarcode',
  DUE_DATE_TIME: 'dueDateTime',
  BARCODE: 'barcode',
  HRID: 'hrid',
};

export const TRANSACTION_FIELDS = {
  ID: 'id',
  CENTRAL_SERVER_CODE: 'centralServerCode',
  TYPE: 'type',
  TRACKING_ID: 'trackingId',
  HOLD: 'hold',
  STATUS: 'state',
  ITEM_BARCODE: 'itemBarcode',
  ITEM_AGENCY_CODE: HOLD_FIELDS.ITEM_AGENCY_CODE,
  PATRON_AGENCY_CODE: HOLD_FIELDS.PATRON_AGENCY_CODE,
  TIME: HOLD_FIELDS.TRANSACTION_TIME,
};

export const TRANSACTION_OPERATIONS = {
  CREATED_DATE_OP: 'createdDateOp',
  UPDATED_DATE_OP: 'updatedDateOp',
  HOLD_CREATED_DATE_OP: 'holdCreatedDateOp',
  HOLD_UPDATED_DATE_OP: 'holdUpdatedDateOp',
  DUE_DATE_OP: 'dueDateOp',
};

export const DUE_DATE = 'dueDate';

export const CREATED_DATE_OPERATIONS = {
  LESS: 'less',
  LESS_OR_EQUAL: 'lessOrEqual',
  EQUAL: 'equal',
  NOT_EQUAL: 'notEqual',
  GREATER: 'greater',
  GREATER_OR_EQUAL: 'greaterOrEqual',
  BETWEEN: 'between',
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
