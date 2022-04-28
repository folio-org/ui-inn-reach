import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import LocalActions from './LocalActions';

const transactionMock = {
  state: 'LOCAL_HOLD',
};

const renderLocalActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
  onCancelLocalHold = jest.fn(),
  onCheckoutToLocalPatron = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <LocalActions
      transaction={transaction}
      onToggle={onToggle}
      onCancelLocalHold={onCancelLocalHold}
      onCheckoutToLocalPatron={onCheckoutToLocalPatron}
    />,
    translationsProperties,
  );
};

describe('LocalActions component', () => {
  it('should render "check out" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Check out to local patron')).toBeVisible();
  });

  it('should render "Transfer hold to another item" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Transfer hold to another item')).toBeVisible();
  });

  it('should render "Cancel hold" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Cancel hold')).toBeVisible();
  });

  describe('check out to local patron action', () => {
    it('should rbe enabled with LOCAL_HOLD', () => {
      renderLocalActions({
        transaction: {
          ...transactionMock,
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to local patron' })).toBeEnabled();
    });
    it('should rbe enabled with LOCAL_HOLD', () => {
      renderLocalActions({
        transaction: {
          ...transactionMock,
          state: 'TRANSFER',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to local patron' })).toBeEnabled();
    });
  });
});
