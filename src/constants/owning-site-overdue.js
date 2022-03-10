import {
  CREATED_DATE_OP,
  CREATED_DATE_OPERATIONS,
  HOLD_FIELDS,
  INVENTORY_ITEM_FIELDS,
  TRANSACTION_FIELDS,
  TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from './transactions';
import {
  ASC_ORDER,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
} from './search';
import {
  METADATA_FIELDS,
} from './base';
import {
  roundHours,
} from '../utils';

const {
  PATRON_ID,
  CALL_NUMBER,
  FOLIO_ITEM_BARCODE,
  TITLE,
  PATRON_AGENCY_CODE,
  DUE_DATE_TIME,
} = HOLD_FIELDS;

const {
  EFFECTIVE_LOCATION,
} = INVENTORY_ITEM_FIELDS;

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  HOLD,
  TYPE,
  STATUS,
} = TRANSACTION_FIELDS;

const {
  LESS,
} = CREATED_DATE_OPERATIONS;

const {
  ITEM,
} = TRANSACTION_TYPES;

const {
  OWNER_RENEW,
  ITEM_RECEIVED,
  ITEM_SHIPPED,
  ITEM_IN_TRANSIT,
  BORROWER_RENEW,
} = TRANSACTION_STATUSES;

export const OVERDUE = 'overdue';

export const REPORT_COLUMNS = [
  `${HOLD}.${PATRON_ID}`,
  EFFECTIVE_LOCATION,
  CALL_NUMBER,
  `${HOLD}.${FOLIO_ITEM_BARCODE}`,
  `${HOLD}.${TITLE}`,
  PATRON_AGENCY_CODE,
  `${HOLD}.${DUE_DATE_TIME}`,
];

export const OWNING_SITE_OVERDUE_FIELDS = {
  MINIMUM_DAYS_OVERDUE: 'minDaysOverdue',
};

const {
  MINIMUM_DAYS_OVERDUE,
} = OWNING_SITE_OVERDUE_FIELDS;

export const REPORT_SETTINGS = {
  [OVERDUE]: {
    getParams: (record) => {
      const overdueDate = new Date();

      overdueDate.setDate(overdueDate.getDate() - record[MINIMUM_DAYS_OVERDUE]);

      return {
        [SORT_PARAMETER]: TRANSACTION_LIST_DEFAULT_SORT_FIELD,
        [SORT_ORDER_PARAMETER]: ASC_ORDER,
        [TYPE]: ITEM,
        [STATUS]: [ITEM_RECEIVED, BORROWER_RENEW, OWNER_RENEW, ITEM_IN_TRANSIT, ITEM_SHIPPED],
        [UPDATED_DATE]: roundHours(overdueDate).toISOString(),
        [CREATED_DATE_OP]: LESS,
      };
    },
  },
};
