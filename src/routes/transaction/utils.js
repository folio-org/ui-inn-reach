import {
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
} from '../../constants';

const {
  HOLD,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  FOLIO_ITEM_ID,
} = HOLD_FIELDS;

export const formatDateAndTime = (date, formatter) => {
  return date ? formatter(date, { day: 'numeric', month: 'numeric', year: 'numeric' }) : '';
};

export const getAgencyCodeMap = (localServers) => {
  return localServers.reduce((accum, { localServerList }) => {
    localServerList.forEach(({ agencyList }) => {
      agencyList.forEach(({ agencyCode, description }) => {
        accum.set(agencyCode, description);
      });
    });

    return accum;
  }, new Map());
};

export const getLoansMap = (loans) => {
  return loans.reduce((accum, loan) => {
    accum.set(loan[HOLD][FOLIO_ITEM_ID], loan);

    return accum;
  }, new Map());
};

export const getCentralServerCodesSet = (loans) => {
  return loans.reduce((accum, loan) => {
    accum.add(loan[CENTRAL_SERVER_CODE]);

    return accum;
  }, new Set());
};

export const getCentralServersMap = (centralServers) => {
  return centralServers.reduce((accum, { centralServerCode, id }) => {
    accum.set(centralServerCode, id);

    return accum;
  }, new Map());
};
