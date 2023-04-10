import React from 'react';
import { cloneDeep } from 'lodash';
import { act, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useStripes } from '@folio/stripes/core';
import TransactionListRoute from './TransactionListRoute';
import { translationsProperties, renderWithIntl } from '../../../test/jest/helpers';
import TransactionList from '../../components/transaction/TransactionList';
import TransactionDetailContainer from '../../components/transaction/TransactionDetails';
import {
  getParamsForOverdueReport,
  getParamsForRequestedTooLongReport,
  getParamsForReturnedTooLongReport,
  getParamsForOwningSitePagedTooLongReport,
  getParamsForInTransitTooLongReport,
} from './utils';

jest.mock('../../components/transaction/TransactionList', () => {
  return jest.fn(() => <div>TransactionList</div>);
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cloneElement: jest.fn(),
}));

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  getParamsForOverdueReport: jest.fn(),
  getParamsForRequestedTooLongReport: jest.fn(),
  getParamsForReturnedTooLongReport: jest.fn(),
  getParamsForOwningSitePagedTooLongReport: jest.fn(),
  getParamsForInTransitTooLongReport: jest.fn(),
  convertToSlipData: jest.fn(),
  getSlipTempllatesMap: jest.fn(),
}));

const transactionsMock = {
  transactions: [
    { state: 'ITEM_HOLD', type: 'ITEM' },
  ],
  totalRecords: 100,
};

const centralServersMock = {
  centralServers: [
    {
      id: 'b19a50d5-6757-4ba9-91a5-0c00fbb67962',
      centralServerCode: 'd2ir',
    }
  ]
};

const localServersMock = {
  localServerList: [
    {
      agencyList: [
        {
          agencyCode: 'moag1',
          description: 'Mobi Mobius Agency 1',
        }
      ]
    }
  ]
};

const itemsMock = {
  items: [
    {
      id: 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
      barcode: 'A14811392645',
      hrid: '1234567',
      callNumber: 'K1 .M44',
      effectiveLocation: {
        id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
        name: 'Main Library',
      }
    }
  ]
};

const mutatorMock = {
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
    reset: jest.fn(),
  },
  centralServerRecords: {
    GET: jest.fn(() => Promise.resolve(centralServersMock)),
  },
  localServers: {
    GET: jest.fn(() => Promise.resolve(localServersMock)),
  },
  items: {
    GET: jest.fn(() => Promise.resolve(itemsMock)),
    reset: jest.fn(),
  },
  pagingSlipTemplates: {
    GET: jest.fn(() => Promise.resolve(itemsMock)),
    reset: jest.fn(),
  },
  pagingSlips: {
    GET: jest.fn(() => Promise.resolve(itemsMock)),
    reset: jest.fn(),
  },
  servicePointId: {
    replace: jest.fn(),
  },
};

const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';
const path = '/innreach/transactions?centralItemType=200&centralServerCode=demo1&itemAgencyCode=5east&patronAgencyCode=5dlpl&centralPatronType=201&query=secrets&state=ITEM_HOLD&type=PATRON&type=ITEM';
const params = {
  'centralItemType': '200',
  'centralServerCode': 'demo1',
  'itemAgencyCode': '5east',
  'limit': 100,
  'offset': 0,
  'patronAgencyCode': '5dlpl',
  'centralPatronType': '201',
  'query': 'secrets',
  'sortBy': 'transactionTime',
  'sortOrder': 'desc',
  'state': 'ITEM_HOLD',
  'type': ['PATRON', 'ITEM'],
};

const childrenMock = <TransactionDetailContainer render={jest.fn} />;

const executeCommonTests = () => {
  it('should call the central server records', () => {
    expect(mutatorMock.centralServerRecords.GET).toHaveBeenCalled();
  });

  it('should call the local servers', () => {
    expect(mutatorMock.localServers.GET).toHaveBeenCalledWith({
      path: 'inn-reach/central-servers/b19a50d5-6757-4ba9-91a5-0c00fbb67962/d2r/contribution/localservers',
    });
  });

  it('should call the items', () => {
    expect(mutatorMock.items.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'id==f8b6d973-60d4-41ce-a57b-a3884471a6d6',
      },
    });
  });
};

const renderTransactionListRoute = ({
  history = createMemoryHistory(),
  mutator = mutatorMock,
  children = childrenMock,
  stripes,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <TransactionListRoute
        mutator={mutator}
        location={{ pathname: '/' }}
        history={history}
        stripes={stripes}
      >
        {children}
      </TransactionListRoute>
    </Router>,
    translationsProperties,
  );
};

describe('TransactionListRoute', () => {
  let stripes;

  beforeEach(() => {
    TransactionList.mockClear();
    mutatorMock.servicePointId.replace.mockClear();
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = {
      id: servicePointId,
      name: test
    };
  });

  it('should render TransactionList', async () => {
    await act(async () => { renderTransactionListRoute({ stripes }); });
    expect(screen.getByText('TransactionList')).toBeVisible();
  });

  it('should not pass any transactions ', async () => {
    await act(async () => { renderTransactionListRoute({ stripes }); });
    expect(TransactionList.mock.calls[0][0].transactions).toEqual([]);
  });

  it('should use React.cloneElement method for children prop', async () => {
    await act(async () => { renderTransactionListRoute({ stripes }); });
    expect(React.cloneElement).toHaveBeenCalled();
  });

  it('should call a GET paging slips templates request', () => {
    expect(mutatorMock.pagingSlipTemplates.GET).toHaveBeenCalled();
  });
  it('should call a GET paging slips request', () => {
    expect(mutatorMock.pagingSlips.GET).toHaveBeenCalled();
  });

  describe('when we select filters', () => {
    let history;

    beforeEach(async () => {
      history = createMemoryHistory();
      history.push(path);
      await act(async () => { renderTransactionListRoute({ history, stripes }); });
    });

    it('should pass the correct transactions list', () => {
      expect(TransactionList.mock.calls[4][0].transactions).toEqual(transactionsMock.transactions);
    });

    it('should call a GET request with the correct path', () => {
      expect(mutatorMock.transactionRecords.GET).toHaveBeenCalledWith({ params });
    });

    it('should path the correct count of the transactions', async () => {
      expect(TransactionList.mock.calls[4][0].transactionsCount).toEqual(transactionsMock.totalRecords);
    });

    it('should trigger a GET request with the correct offset number', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onNeedMoreData(); });
      expect(mutatorMock.transactionRecords.GET).toHaveBeenLastCalledWith({
        params: {
          ...params,
          offset: 100,
        },
      });
    });
  });

  describe('generate report', () => {
    const transactionsMock2 = {
      transactions: [
        {
          id: 'b42629b5-738b-4054-9764-3b4380c0b10f',
          centralServerCode: 'd2ir',
          hold: {
            folioItemBarcode: 'A14811392645',
            patronAgencyCode: 'moag1',
            folioItemId: 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
          }
        }
      ]
    };
    const newMutator = {
      ...mutatorMock,
      transactionRecords: {
        GET: jest.fn(() => Promise.resolve(transactionsMock2)),
        reset: jest.fn(),
      },
    };

    beforeEach(async () => {
      await act(async () => {
        renderTransactionListRoute({
          mutator: newMutator,
          stripes,
        });
      });
    });

    describe('generate report for "owning site overdue"', () => {
      const record = { minDaysOverdue: 2 };

      beforeEach(async () => {
        await act(async () => { TransactionList.mock.calls[3][0].onGenerateReport('overdue', record); });
      });

      executeCommonTests();

      it('should call getParamsForOverdueReport function', () => {
        expect(getParamsForOverdueReport).toHaveBeenCalledWith(record);
      });
    });

    describe('generate report for "requested too long"', () => {
      const record = { minDaysRequested: 2 };

      beforeEach(async () => {
        await act(async () => { TransactionList.mock.calls[3][0].onGenerateReport('requestedTooLong', record); });
      });

      executeCommonTests();

      it('should call getParamsForRequestedTooLongReport function', () => {
        expect(getParamsForRequestedTooLongReport).toHaveBeenCalledWith(record);
      });
    });

    describe('generate report for "returned too long"', () => {
      const record = { minDaysReturned: 2 };

      beforeEach(async () => {
        await act(async () => { TransactionList.mock.calls[3][0].onGenerateReport('returnedTooLong', record); });
      });

      executeCommonTests();

      it('should call getParamsForReturnedTooLongReport function', () => {
        expect(getParamsForReturnedTooLongReport).toHaveBeenCalledWith(record);
      });
    });

    describe('generate report for "In-transit too long"', () => {
      const record = { minDaysReturned: 2 };

      beforeEach(async () => {
        await act(async () => { TransactionList.mock.calls[3][0].onGenerateReport('inTransitTooLong', record); });
      });

      executeCommonTests();

      it('should call getParamsForInTransitTooLongReport function', () => {
        expect(getParamsForInTransitTooLongReport).toHaveBeenCalledWith(record);
      });
    });

    describe('generate report for "owning site paged too long"', () => {
      const record = { minDaysPaged: 2 };

      beforeEach(async () => {
        await act(async () => { TransactionList.mock.calls[3][0].onGenerateReport('pagedTooLong', record); });
      });

      executeCommonTests();

      it('should call getParamsForOwningSitePagedTooLongReport function', () => {
        expect(getParamsForOwningSitePagedTooLongReport).toHaveBeenCalledWith(record);
      });
    });
  });

  describe('toggling states of modal reports', () => {
    beforeEach(async () => {
      await act(async () => { renderTransactionListRoute({ stripes }); });
    });

    it('should display "Owning site overdue report" modal', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onToggleStatesOfModalReports('showOverdueReportModal'); });
      expect(TransactionList.mock.calls[5][0].statesOfModalReports).toEqual({
        showOverdueReportModal: true,
        showRequestedTooLongReportModal: false,
        showReturnedTooLongReportModal: false,
        showPagedTooLongReportModal: false,
        showInTransitTooLongReportModal: false,
      });
    });

    it('should display "Requested too long report" modal', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onToggleStatesOfModalReports('showRequestedTooLongReportModal'); });
      expect(TransactionList.mock.calls[5][0].statesOfModalReports).toEqual({
        showOverdueReportModal: false,
        showRequestedTooLongReportModal: true,
        showReturnedTooLongReportModal: false,
        showPagedTooLongReportModal: false,
        showInTransitTooLongReportModal: false,
      });
    });

    it('should display "Returned too long report" modal', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onToggleStatesOfModalReports('showReturnedTooLongReportModal'); });
      expect(TransactionList.mock.calls[5][0].statesOfModalReports).toEqual({
        showOverdueReportModal: false,
        showRequestedTooLongReportModal: false,
        showReturnedTooLongReportModal: true,
        showPagedTooLongReportModal: false,
        showInTransitTooLongReportModal: false,
      });
    });

    it('should display "Owning site paged too long" modal', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onToggleStatesOfModalReports('showPagedTooLongReportModal'); });
      expect(TransactionList.mock.calls[5][0].statesOfModalReports).toEqual({
        showOverdueReportModal: false,
        showRequestedTooLongReportModal: false,
        showReturnedTooLongReportModal: false,
        showPagedTooLongReportModal: true,
        showInTransitTooLongReportModal: false,
      });
    });

    it('should display "In-transit too long" modal', async () => {
      await act(async () => { TransactionList.mock.calls[4][0].onToggleStatesOfModalReports('showInTransitTooLongReportModal'); });
      expect(TransactionList.mock.calls[5][0].statesOfModalReports).toEqual({
        showOverdueReportModal: false,
        showRequestedTooLongReportModal: false,
        showReturnedTooLongReportModal: false,
        showPagedTooLongReportModal: false,
        showInTransitTooLongReportModal: true,
      });
    });
  });
});
