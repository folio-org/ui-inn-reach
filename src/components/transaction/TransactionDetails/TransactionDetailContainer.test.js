import React from 'react';
import { createMemoryHistory } from 'history';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { cloneDeep } from 'lodash';
import { useStripes } from '@folio/stripes/core';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetailContainer from './TransactionDetailContainer';
import TransactionDetail from './TransactionDetail';

jest.mock('./TransactionDetail', () => {
  return jest.fn(() => <div>TransactionDetail</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

const transactionMock = {
  id: 'b6f66467-b9b0-4165-8cde-ec6fe4cfb79c',
  centralServerCode: 'd2ir',
  hold: {
    centralItemType: 200,
    centralPatronType: 200,
    id: '0abd066f-51a3-40d0-ba49-4ad3508b47b5',
    itemAgencyCode: 'ydg01',
    itemId: 'it00000000002',
    author: 'Herbert, Frank J',
    metadata: {
      createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
      createdByUsername: 'diku_admin',
      createdDate: '2021-10-19T07:12:51.162+00:00',
    },
    needBefore: 1745467531,
    patronAgencyCode: 'jcg01',
    patronId: 'patron1',
    patronName: 'Brown, Adam',
    pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
    transactionTime: 1544466568,
    title: 'Children of Dune',
    folioRequestId: '78ad79d9-afbb-462a-afb7-a31eb331a371',
    folioLoanId: '829f0791-9c2a-42d5-a2eb-6c3b4a38c1d8',
    folioPatronId: 'b4cee18d-f862-4ef1-95a5-879fdd619603',
    folioItemId: '34bd066f-51a3-40d0-ba49-4ad3508b4778',
    folioInstanceId: 'j7f5ebb7-9285-58f8-bc1e-608ac2080894',
    folioHoldingId: 'w5f5ebb7-9285-58f8-bc1e-608ac2080832',
  },
  metadata: {
    createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
    createdByUsername: 'diku_admin',
    createdDate: '2021-10-19T07:12:50.858+00:00',
  },
  state: 'ITEM_HOLD',
  trackingId: '12348',
  type: 'ITEM',
};

const receiveUnshippedItemMock = { foo: '123' };

const resourcesMock = {
  transactionView: {
    records: [transactionMock],
    isPending: false,
  },
};

const mutatorMock = {
  servicePointId: {
    replace: jest.fn(),
  },
  transactionId: {
    replace: jest.fn(),
  },
  itemBarcode: {
    replace: jest.fn(),
  },
  receiveUnshippedItem: {
    POST: jest.fn(() => Promise.resolve(receiveUnshippedItemMock)),
  },
  receiveItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  checkoutBorroingSiteItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
};

const historyMock = createMemoryHistory();
const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';
const itemBarcode = '12345';

const renderTransactionDetailContainer = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history = historyMock,
  stripes,
  onUpdateTransactionList,
} = {}) => {
  return renderWithIntl(
    <TransactionDetailContainer
      resources={resources}
      mutator={mutator}
      history={history}
      location={{ pathname: '/' }}
      stripes={stripes}
      onUpdateTransactionList={onUpdateTransactionList}
    />,
    translationsProperties,
  );
};

describe('TransactionDetailContainer', () => {
  const onUpdateTransactionList = jest.fn();
  let stripes;

  const commonProps = {
    stripes,
    onUpdateTransactionList,
  };

  beforeEach(() => {
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };
    TransactionDetail.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderTransactionDetailContainer(commonProps);

    expect(container).toBeVisible();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.transactionView.isPending = true;
    renderTransactionDetailContainer({
      ...commonProps,
      resources: newResources,
    });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  it('should write transaction id to the redux', () => {
    renderTransactionDetailContainer(commonProps);
    expect(mutatorMock.transactionId.replace).toHaveBeenLastCalledWith(transactionMock.id);
  });

  it('should write service point id to the redux', () => {
    renderTransactionDetailContainer({ ...commonProps, stripes });
    expect(mutatorMock.servicePointId.replace).toHaveBeenCalledWith(servicePointId);
  });

  describe('reset', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
    });

    it('should close the unshippedItem modal', async () => {
      await act(async () => { TransactionDetail.mock.calls[0][0].onTriggerUnshippedItemModal(); });
      await act(async () => { TransactionDetail.mock.calls[1][0].onReset(); });
      expect(TransactionDetail.mock.calls[2][0].isOpenUnshippedItemModal).toBeFalsy();
    });

    it('should dump the unshippedItem state', async () => {
      await act(async () => { TransactionDetail.mock.calls[0][0].onFetchReceiveUnshippedItem({ itemBarcode }); });
      await act(async () => { TransactionDetail.mock.calls[1][0].onReset(); });
      expect(TransactionDetail.mock.calls[2][0].unshippedItem).toBeNull();
    });
  });

  describe('closing the current page', () => {
    it('should navigate to the page with a list of transactions', () => {
      const history = createMemoryHistory();

      renderTransactionDetailContainer({
        ...commonProps,
        history,
      });
      TransactionDetail.mock.calls[0][0].onClose();
      expect(history.location.pathname).toBe('/innreach/transactions');
    });
  });

  it('should open "unshipped item" modal', () => {
    renderTransactionDetailContainer(commonProps);
    act(() => { TransactionDetail.mock.calls[0][0].onTriggerUnshippedItemModal(); });
    expect(TransactionDetail.mock.calls[1][0].isOpenUnshippedItemModal).toBeTruthy();
  });

  describe('receive unshipped item', () => {
    beforeEach(async () => {
      renderTransactionDetailContainer(commonProps);
      await act(async () => { TransactionDetail.mock.calls[0][0].onFetchReceiveUnshippedItem({ itemBarcode }); });
    });

    it('should write item barcode to the redux', () => {
      expect(mutatorMock.itemBarcode.replace).toHaveBeenCalledWith(itemBarcode);
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.receiveUnshippedItem.POST).toHaveBeenCalled();
    });

    it('should close the "unshipped item" modal', () => {
      expect(TransactionDetail.mock.calls[1][0].isOpenUnshippedItemModal).toBeFalsy();
    });

    it('should pass the unshipped item data', () => {
      expect(TransactionDetail.mock.calls[1][0].unshippedItem).toEqual(receiveUnshippedItemMock);
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('receive item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onFetchReceiveItem();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.receiveItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('checkout to borrowing site item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCheckoutBorrowingSite();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.checkoutBorroingSiteItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });
});
