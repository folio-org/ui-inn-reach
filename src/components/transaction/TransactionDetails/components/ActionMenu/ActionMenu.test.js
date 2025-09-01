import React from 'react';
import { translationsProperties, renderWithIntl } from '../../../../../../test/jest/helpers';
import ActionMenu from './ActionMenu';
import { PatronActions } from './components';

jest.mock('./components', () => ({
  PatronActions: jest.fn(() => <div>PatronActions</div>),
  ItemActions: jest.fn(() => <div>ItemActions</div>),
  LocalActions: jest.fn(() => <div>LocalActions</div>),
}));

const mockOnRemoveHold = jest.fn();

const renderActionMenu = ({
  transaction,
} = {}) => {
  return renderWithIntl(
    <ActionMenu
      transaction={transaction}
      onToggle={jest.fn()}
      onRecallItem={jest.fn()}
      onReceiveUnshippedItem={jest.fn()}
      onReceiveItem={jest.fn()}
      onReturnItem={jest.fn()}
      onCheckOutBorrowingSite={jest.fn()}
      onCheckOutToPatron={jest.fn()}
      onFinalCheckInItem={jest.fn()}
      onCancelHold={jest.fn()}
      onTransferHold={jest.fn()}
      onCheckOutToLocalPatron={jest.fn()}
      onRemoveHold={mockOnRemoveHold}
    />,
    translationsProperties,
  );
};

describe('ActionMenu', () => {
  it('should render the patron actions', () => {
    const { getByText } = renderActionMenu({ transaction: { type: 'PATRON' } });

    expect(getByText('PatronActions')).toBeInTheDocument();
  });

  it('should render the item actions', () => {
    const { getByText } = renderActionMenu({ transaction: { type: 'ITEM' } });

    expect(getByText('ItemActions')).toBeInTheDocument();
  });

  it('should render the local actions', () => {
    const { getByText } = renderActionMenu({ transaction: { type: 'LOCAL' } });

    expect(getByText('LocalActions')).toBeInTheDocument();
  });

  it('should pass onRemoveHold prop to PatronActions', () => {
    renderActionMenu({
      transaction: { type: 'PATRON' },
    });

    expect(PatronActions).toHaveBeenCalledWith(
      expect.objectContaining({
        onRemoveHold: expect.any(Function)
      }),
      expect.anything()
    );
  });
});
