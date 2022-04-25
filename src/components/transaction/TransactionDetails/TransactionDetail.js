import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Pane,
  Row,
  Col,
  AccordionSet,
  Headline,
} from '@folio/stripes-components';

import {
  PatronInformation,
  TransactionSummary,
  ItemInformation,
  ActionMenu,
  ReceiveUnshippedItemModal,
} from './components';
import {
  TRANSACTION_DETAIL_ACCORDION_STATE,
  FILL_PANE_WIDTH,
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
} from '../../../constants';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  TITLE,
} = HOLD_FIELDS;

const TransactionDetail = ({
  transaction,
  isOpenItemHoldModal,
  isOpenInTransitModal,
  isOpenAugmentedBarcodeModal,
  intl,
  isOpenUnshippedItemModal,
  onClose,
  onCheckoutBorrowingSite,
  onCheckOutToPatron,
  onReturnItem,
  onCancelPatronHold,
  onCancelItemHold,
  onFinalCheckInItem,
  onTriggerUnshippedItemModal,
  onFetchReceiveUnshippedItem,
  onFetchReceiveItem,
  onRenderAugmentedBarcodeModal,
  onRenderHoldModal,
  onRenderTransitModal,
}) => {
  const renderActionMenu = useCallback(({ onToggle }) => (
    <ActionMenu
      transaction={transaction}
      onToggle={onToggle}
      onReceiveUnshippedItem={onTriggerUnshippedItemModal}
      onReceiveItem={onFetchReceiveItem}
      onCheckoutBorrowingSite={onCheckoutBorrowingSite}
      onCheckOutToPatron={onCheckOutToPatron}
      onFinalCheckInItem={onFinalCheckInItem}
      onReturnItem={onReturnItem}
      onCancelPatronHold={onCancelPatronHold}
      onCancelItemHold={onCancelItemHold}
    />
  ), [transaction]);

  const renderReceiveUnshippedItemModal = () => (
    <ReceiveUnshippedItemModal
      intl={intl}
      onSubmit={onFetchReceiveUnshippedItem}
      onTriggerModal={onTriggerUnshippedItemModal}
    />
  );

  return (
    <Pane
      dismissible
      defaultWidth={FILL_PANE_WIDTH}
      actionMenu={renderActionMenu}
      paneTitle={<FormattedMessage id="ui-inn-reach.transaction-detail.title" />}
      onClose={onClose}
    >
      <Row>
        <Col xs={12}>
          <Headline
            size="large"
            tag="h2"
            margin="small"
          >
            {transaction[HOLD]?.[TITLE]}
          </Headline>
        </Col>
      </Row>
      <AccordionSet initialStatus={TRANSACTION_DETAIL_ACCORDION_STATE}>
        <TransactionSummary transaction={transaction} />
        <PatronInformation transaction={transaction} />
        <ItemInformation transaction={transaction} />
      </AccordionSet>
      {isOpenUnshippedItemModal && renderReceiveUnshippedItemModal()}
      {isOpenAugmentedBarcodeModal && onRenderAugmentedBarcodeModal()}
      {isOpenItemHoldModal && onRenderHoldModal()}
      {isOpenInTransitModal && onRenderTransitModal()}
    </Pane>
  );
};

TransactionDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isOpenAugmentedBarcodeModal: PropTypes.bool.isRequired,
  isOpenInTransitModal: PropTypes.bool.isRequired,
  isOpenItemHoldModal: PropTypes.bool.isRequired,
  isOpenUnshippedItemModal: PropTypes.bool.isRequired,
  transaction: PropTypes.object.isRequired,
  onCancelItemHold: PropTypes.func.isRequired,
  onCancelPatronHold: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onCheckoutBorrowingSite: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFetchReceiveItem: PropTypes.func.isRequired,
  onFetchReceiveUnshippedItem: PropTypes.func.isRequired,
  onFinalCheckInItem: PropTypes.func.isRequired,
  onRenderAugmentedBarcodeModal: PropTypes.func.isRequired,
  onRenderHoldModal: PropTypes.func.isRequired,
  onRenderTransitModal: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onTriggerUnshippedItemModal: PropTypes.func.isRequired,
};

export default TransactionDetail;
