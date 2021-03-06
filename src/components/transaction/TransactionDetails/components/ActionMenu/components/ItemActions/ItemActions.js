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
  ITEM_IN_TRANSIT,
} = TRANSACTION_STATUSES;

const {
  FOLIO_ITEM_ID,
  FOLIO_REQUEST_ID,
} = HOLD_FIELDS;

const ItemActions = ({
  transaction,
  onToggle,
  onCheckOutBorrowingSite,
  onTransferHold,
  onRecallItem,
  onFinalCheckInItem,
  onCancelHold,
}) => {
  return (
    <>
      <ActionItem
        disabled={![ITEM_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOutBorrowingSite}
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
        disabled={![ITEM_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
      <ActionItem
        disabled={![ITEM_RECEIVED, RECEIVE_UNANNOUNCED, ITEM_IN_TRANSIT].includes(transaction[STATUS])}
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.final-check-in"
        onToggle={onToggle}
        onClickHandler={onFinalCheckInItem}
      />
    </>
  );
};

ItemActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelHold: PropTypes.func.isRequired,
  onCheckOutBorrowingSite: PropTypes.func.isRequired,
  onFinalCheckInItem: PropTypes.func.isRequired,
  onRecallItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTransferHold: PropTypes.func.isRequired,
};

export default ItemActions;
