import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  HOLD_FIELDS,
  ICONS,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
} from '../../../../../../../constants';

const {
  STATUS,
  HOLD,
} = TRANSACTION_FIELDS;

const {
  ITEM_HOLD,
  TRANSFER,
  ITEM_SHIPPED,
  ITEM_RECEIVED,
  RECEIVE_UNANNOUNCED,
} = TRANSACTION_STATUSES;

const {
  FOLIO_ITEM_ID,
  FOLIO_REQUEST_ID,
} = HOLD_FIELDS;

const ItemActions = ({
  transaction,
  onToggle,
  onCheckoutBorrowingSite,
  onTransferHold,
  onRecallItem,
  onCancelItemHold,
  onFinalCheckIn,
}) => {
  return (
    <>
      <ActionItem
        disabled={![ITEM_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckoutBorrowingSite}
      />
      <ActionItem
        disabled={!(
          [ITEM_HOLD, TRANSFER].includes(transaction[STATUS]) &&
          transaction?.[HOLD]?.[FOLIO_ITEM_ID] &&
          transaction?.[HOLD]?.[FOLIO_REQUEST_ID]
        )}
        icon={ICONS.TRANSFER}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.transfer-hold"
        onToggle={onToggle}
        onClickHandler={onTransferHold}
      />
      <ActionItem
        disabled={
          ![ITEM_SHIPPED, ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(
            transaction[STATUS]
          )
        }
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.recall-item"
        onToggle={onToggle}
        onClickHandler={onRecallItem}
      />
      <ActionItem
        disabled={![ITEM_HOLD].includes(transaction[STATUS])}
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelItemHold}
      />
      <ActionItem
        disabled
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.final-check-in"
        onToggle={onToggle}
        onClickHandler={onFinalCheckIn}
      />
    </>
  );
};

ItemActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelItemHold: PropTypes.func.isRequired,
  onCheckoutBorrowingSite: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onFinalCheckIn: PropTypes.func,
  onRecallItem: PropTypes.func,
  onTransferHold: PropTypes.func,
};

export default ItemActions;
