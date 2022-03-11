import {
  forOwn,
  chunk,
} from 'lodash';

import {
  exportToCsv,
} from "@folio/stripes-components";

import {
  HOLD_FIELDS,
  INVENTORY_ITEM_FIELDS,
  NO_ITEMS_FOUND,
  REPORT_COLUMNS,
  REPORT_SETTINGS,
  TRANSACTION_FIELDS,
} from '../../constants';
import {
  formatDateAndTime,
  getAgencyCodeMap,
  getCentralServerCodesSet,
  getCentralServersMap,
  getLoansMap,
} from './utils';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  PATRON_AGENCY_CODE,
  FOLIO_ITEM_BARCODE,
  CALL_NUMBER,
} = HOLD_FIELDS;

const {
  EFFECTIVE_LOCATION,
} = INVENTORY_ITEM_FIELDS;

class CsvReport {
  constructor(options) {
    const {
      intl: {
        formatMessage,
        formatTime,
      },
    } = options;

    this.formatMessage = formatMessage;
    this.formatTime = formatTime;
  }

  setUp(type, record) {
    this.params = REPORT_SETTINGS[type].getParams(record);

    this.columnsMap = REPORT_COLUMNS.map(value => ({
      label: this.formatMessage({ id: `ui-inn-reach.reports.${value}` }),
      value,
    }));
  }

  async fetchData(mutator) {
    const { GET, reset } = mutator;
    const params = this.params;
    const limit = 1000;
    const data = [];

    let offset = 0;
    let hasData = true;

    while (hasData) {
      try {
        reset();
        const { transactions } = await GET({ params: { ...params, limit, offset } });

        hasData = transactions.length;
        offset += limit;
        if (hasData) {
          data.push(...transactions);
          hasData = false;
        }
      } catch (err) {
        hasData = false;
      }
    }

    return data;
  }

  async fetchBatchItems(mutator, loans) {
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
  }

  async fetchLocalServers(mutator, loans) {
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
  }

  async generate(mutator, type, record) {
    this.setUp(type, record);
    const loans = await this.fetchData(mutator.transactionRecords);

    if (loans.length !== 0) {
      const localServers = await this.fetchLocalServers(mutator, loans);
      const agencyCodeMap = getAgencyCodeMap(localServers);
      const items = await this.fetchBatchItems(mutator, loans);
      const loansMap = getLoansMap(loans);

      const loansToCsv = items.map(item => {
        const patronAgencyCode = loansMap.get(item.id)[HOLD][PATRON_AGENCY_CODE];
        const agencyDescription = agencyCodeMap.get(patronAgencyCode);

        return {
          ...loansMap.get(item.id),
          [CALL_NUMBER]: item[CALL_NUMBER],
          [EFFECTIVE_LOCATION]: item[EFFECTIVE_LOCATION].name,
          [PATRON_AGENCY_CODE]: `${agencyDescription} (${patronAgencyCode})`,
        };
      });

      this.toCSV(loansToCsv);
    } else { throw new Error(NO_ITEMS_FOUND); }
  }

  parseDates(record) {
    const result = {
      ...record,
      [HOLD]: {
        ...record[HOLD],
      },
    };

    forOwn(record[HOLD], (value, key) => {
      if (key.match(/date/i)) {
        result[HOLD][key] = formatDateAndTime(value, this.formatTime);
      } else {
        result[HOLD][key] = value;
      }
    });

    return result;
  }

  parse(records) {
    return records.map(record => {
      return this.parseDates(record);
    });
  }

  toCSV(records) {
    const onlyFields = this.columnsMap;
    const parsedRecords = this.parse(records);

    exportToCsv(parsedRecords, { onlyFields });
  }
}

export default CsvReport;
