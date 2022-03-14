import {
  forOwn,
} from 'lodash';

import {
  exportToCsv,
} from '@folio/stripes-components';

import {
  NO_ITEMS_FOUND,
  REPORT_COLUMNS,
  REPORT_SETTINGS,
  TRANSACTION_FIELDS,
} from '../../constants';
import {
  formatDateAndTime,
} from './utils';

const {
  HOLD,
} = TRANSACTION_FIELDS;

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

  async generate(mutator, type, record, getLoansToCsv) {
    this.setUp(type, record);
    const loans = await this.fetchData(mutator.transactionRecords);

    if (loans.length !== 0) {
      const loansToCsv = await getLoansToCsv(loans);

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
