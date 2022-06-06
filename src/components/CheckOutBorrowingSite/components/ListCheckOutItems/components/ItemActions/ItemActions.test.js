import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ItemActions from './ItemActions';
import { translationsProperties } from '../../../../../../../test/jest/helpers';

const loanMock = {
  barcodeAugmented: false,
  isTransitItem: false,
  folioCheckIn: {
    staffSlipContext: {
      item: {},
      request: {},
      requester: {},
    },
  },
  transaction: {
    id: 'testId',
  },
  rowIndex: 0,
};

const history = createMemoryHistory();

const renderItemActions = ({
  loan = loanMock,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ItemActions
        loan={loan}
        intl={{ formatMessage: jest.fn() }}
        setShowChangeDueDateDialog={jest.fn()}
        setLoanToChangeDueDate={jest.fn()}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ItemActions', () => {
  it('should be rendered', () => {
    const component = renderItemActions();

    expect(component).toBeDefined();
  });
});
