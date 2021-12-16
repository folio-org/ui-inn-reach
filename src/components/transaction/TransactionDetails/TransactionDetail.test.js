import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { cloneDeep } from 'lodash';
import { useStripes } from '@folio/stripes/core';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetail from './TransactionDetail';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  TransactionSummary: jest.fn(() => <div>TransactionSummary</div>),
  PatronInformation: jest.fn(() => <div>PatronInformation</div>),
  ItemInformation: jest.fn(() => <div>ItemInformation</div>),
}));

const transactionMock = {
  type: 'ITEM',
  hold: {
    title: 'test title',
  },
};

const receiveUnshippedItemMock = {

};

const mutatorMock = {
  servicePointId: {
    replace: jest.fn(),
  },
  receiveUnshippedItem: {
    POST: jest.fn(() => Promise.resolve(receiveUnshippedItemMock)),
  },
};

const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';

const renderTransactionDetail = ({
  mutator = mutatorMock,
  transaction = transactionMock,
  stripes,
  onClose,
} = {}) => {
  return renderWithIntl(
    <TransactionDetail
      mutator={mutator}
      transaction={transaction}
      stripes={stripes}
      onClose={onClose}
    />,
    translationsProperties,
  );
};

describe('TransactionDetail', () => {
  const onClose = jest.fn();
  let stripes;

  const commonProps = {
    stripes,
    onClose,
  };

  beforeEach(() => {
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };
  });

  it('should be rendered', () => {
    const { container } = renderTransactionDetail(commonProps);

    expect(container).toBeVisible();
  });

  it('should display a title', () => {
    renderTransactionDetail(commonProps);
    expect(screen.getByText('test title')).toBeVisible();
  });

  describe('accordion set', () => {
    beforeEach(() => {
      renderTransactionDetail(commonProps);
    });

    it('should have TransactionSummary', () => {
      expect(screen.getByText('TransactionSummary')).toBeVisible();
    });

    it('should have PatronInformation', () => {
      expect(screen.getByText('PatronInformation')).toBeVisible();
    });

    it('should have ItemInformation', () => {
      expect(screen.getByText('ItemInformation')).toBeVisible();
    });
  });
});
