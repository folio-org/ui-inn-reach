import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  MultiColumnList,
  FormattedDate,
  FormattedTime,
} from '@folio/stripes/components';

import {
  CHECK_OUT_ITEM_FIELDS,
  FOLIO_CHECK_OUT_FIELDS,
  ITEM_LOCATION_FIELDS,
  LOAN_POLICY_FIELDS,
} from '../../../../constants';
import {
  ItemActions,
} from './components';

const {
  NO,
  BARCODE,
  TITLE,
  LOCATION,
  ACTIONS,
} = CHECK_OUT_ITEM_FIELDS;

const {
  LOAN_POLICY_NAME,
} = LOAN_POLICY_FIELDS;

const {
  LOCATION_NAME,
} = ITEM_LOCATION_FIELDS;

const {
  ITEM,
  TIME,
  DUE_DATE,
  LOAN_POLICY,
} = FOLIO_CHECK_OUT_FIELDS;

const visibleColumns = [
  NO,
  BARCODE,
  TITLE,
  LOAN_POLICY,
  DUE_DATE,
  TIME,
  LOCATION,
  ACTIONS,
];

const columnMapping = {
  [NO]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.no" />,
  [BARCODE]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.barcode" />,
  [TITLE]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.title" />,
  [LOAN_POLICY]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.loan-policy" />,
  [DUE_DATE]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.due-date" />,
  [TIME]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.time" />,
  [LOCATION]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.destination" />,
  [ACTIONS]: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.column.actions" />,
};

const ListCheckOutItems = ({
  scannedItems,
  intl,
  setShowChangeDueDateDialog,
  setLoanToChangeDueDate,
}) => {
  const items = scannedItems.map((item, index) => ({
    ...item,
    [NO]: index + 1,
  }));

  const renderActions = (loan) => {
    return (
      <ItemActions
        loan={loan}
        intl={intl}
        setShowChangeDueDateDialog={setShowChangeDueDateDialog}
        setLoanToChangeDueDate={setLoanToChangeDueDate}
      />
    );
  };

  const getItemFormatter = () => ({
    [NO]: loan => intl.formatNumber(loan[NO]),
    [BARCODE]: loan => loan[ITEM]?.[BARCODE],
    [TITLE]: loan => loan[ITEM]?.[TITLE],
    [LOAN_POLICY]: loan => loan[LOAN_POLICY]?.[LOAN_POLICY_NAME],
    [DUE_DATE]: loan => <FormattedDate value={loan[DUE_DATE]} />,
    [TIME]: loan => <FormattedTime value={loan[TIME]} />,
    [LOCATION]: loan => loan[ITEM]?.[LOCATION]?.[LOCATION_NAME],
    [ACTIONS]: loan => renderActions(loan),
  });

  return (
    <MultiColumnList
      contentData={items}
      formatter={getItemFormatter()}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      isEmptyMessage={<FormattedMessage id="ui-inn-reach.no-items-entered" />}
    />
  );
};

ListCheckOutItems.propTypes = {
  intl: PropTypes.object.isRequired,
  scannedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  setLoanToChangeDueDate: PropTypes.func.isRequired,
  setShowChangeDueDateDialog: PropTypes.func.isRequired,
};

export default ListCheckOutItems;
