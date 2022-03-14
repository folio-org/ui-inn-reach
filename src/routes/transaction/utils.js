import {
  chunk,
} from 'lodash';
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
  FOLIO_ITEM_BARCODE,
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

const getCentralServerCodesSet = (loans) => {
  return loans.reduce((accum, loan) => {
    accum.add(loan[CENTRAL_SERVER_CODE]);

    return accum;
  }, new Set());
};

const getCentralServersMap = (centralServers) => {
  return centralServers.reduce((accum, { centralServerCode, id }) => {
    accum.set(centralServerCode, id);

    return accum;
  }, new Map());
};

export const fetchLocalServers = async (mutator, loans) => {
  const centralServerCodesSet = getCentralServerCodesSet(loans);
  const requests = [];
  const { centralServers } = await mutator.centralServerRecords.GET();
  const centralServersMap = getCentralServersMap(centralServers);

  centralServerCodesSet.forEach(centralServerCode => {
    const centralServerId = centralServersMap.get(centralServerCode);
    const request = mutator.localServers.GET({
      path: `inn-reach/central-servers/${centralServerId}/d2r/contribution/localservers`,
    });

    requests.push(request);
  });

  return Promise.all(requests);
};

export const fetchBatchItems = async (mutator, loans) => {
  // Split the list of items into small chunks to create a short enough query string
  // that we can avoid request with error
  const CHUNK_SIZE = 100;
  const LIMIT = 1000;
  const chunkedItems = chunk(loans, CHUNK_SIZE);

  mutator.items.reset();

  const allRequests = chunkedItems.map(itemChunk => {
    const query = itemChunk
      .map(item => `barcode==${item[HOLD][FOLIO_ITEM_BARCODE]}`)
      .join(' or ');

    return mutator.items.GET({ params: { limit: LIMIT, query } });
  });

  return Promise.all(allRequests).then(res => {
    return res.map(itemResp => itemResp.items).flat();
  });
};
