import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../../../../test/jest/helpers';
import PatronActions from './PatronActions';

const transactionMock = {
  state: 'PATRON_HOLD',
  hold: {
    folioLoanId: '',
  },
};

const renderPatronActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
  onReceiveUnshippedItem = jest.fn(),
  onReceiveItem = jest.fn(),
  onReturnItem = jest.fn(),
  onCheckOutToPatron = jest.fn(),
  onCancelHold = jest.fn(),
  onRemoveHold = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <PatronActions
      transaction={transaction}
      onToggle={onToggle}
      onReceiveUnshippedItem={onReceiveUnshippedItem}
      onReceiveItem={onReceiveItem}
      onReturnItem={onReturnItem}
      onCheckOutToPatron={onCheckOutToPatron}
      onCancelHold={onCancelHold}
      onRemoveHold={onRemoveHold}
    />,
    translationsProperties,
  );
};

describe('PatronActions component', () => {
  describe('check out to patron', () => {
    it('should be enabled with ITEM_RECEIVED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeEnabled();
    });

    it('should be enabled with RECEIVE_UNANNOUNCED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'RECEIVE_UNANNOUNCED',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeEnabled();
    });

    it('should be disabled with FOLIO loan', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
          hold: {
            folioLoanId: '184d6771-1d06-4af5-a854-9c2e26e38c15',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeDisabled();
    });
  });

  it('should render "Receive item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Receive item')).toBeVisible();
  });

  describe('Receive unshipped item', () => {
    it('should be visible', () => {
      const { getByText } = renderPatronActions();

      expect(getByText('Receive unshipped item')).toBeVisible();
    });

    it('should be enabled', () => {
      const { getByText } = renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
        },
      });

      expect(getByText('Receive unshipped item')).toBeEnabled();
    });

    it('should be enabled', () => {
      const { getByText } = renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'TRANSFER',
        },
      });

      expect(getByText('Receive unshipped item')).toBeEnabled();
    });
  });

  it('should render "Return item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Return item')).toBeVisible();
  });

  describe('Cancel patron hold', () => {
    it('should render "Cancel hold" action', () => {
      const { getByText } = renderPatronActions();

      expect(getByText('Cancel hold')).toBeVisible();
    });

    it('should be enabled with PATRON_HOLD state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be enabled with ITEM_RECEIVED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be enabled with RECEIVE_UNANNOUNCED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'RECEIVE_UNANNOUNCED',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be disabled with any other status', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'any other status',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeDisabled();
    });
  });

  describe('Remove patron hold', () => {
    it('should render "Remove hold" action', () => {
      const { getByText } = renderPatronActions();

      expect(getByText('Remove hold')).toBeVisible();
    });

    it('should be enabled when transaction is PATRON_HOLD with no FOLIO IDs', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioItemId: null,
            folioRequestId: null,
            folioLoanId: null,
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Remove hold' })).toBeEnabled();
    });

    it('should be disabled when transaction has folioItemId', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioItemId: '123',
            folioRequestId: null,
            folioLoanId: null,
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Remove hold' })).toBeDisabled();
    });

    it('should be disabled when transaction has folioRequestId', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioItemId: null,
            folioRequestId: '123',
            folioLoanId: null,
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Remove hold' })).toBeDisabled();
    });

    it('should be disabled when transaction has folioLoanId', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioItemId: null,
            folioRequestId: null,
            folioLoanId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Remove hold' })).toBeDisabled();
    });

    it('should be disabled when transaction state is not PATRON_HOLD', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
          hold: {
            folioItemId: null,
            folioRequestId: null,
            folioLoanId: null,
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Remove hold' })).toBeDisabled();
    });

    it('should call onRemoveHold when clicked', () => {
      const onRemoveHoldMock = jest.fn();

      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioItemId: null,
            folioRequestId: null,
            folioLoanId: null,
          },
        },
        onRemoveHold: onRemoveHoldMock,
      });

      const removeButton = screen.getByRole('button', { name: 'Icon Remove hold' });

      userEvent.click(removeButton);

      expect(onRemoveHoldMock).toHaveBeenCalledTimes(1);
    });
  });
});
