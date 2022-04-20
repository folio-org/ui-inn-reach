import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  ICONS,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
} from '../../../../../../../constants';

const {
  STATUS,
} = TRANSACTION_FIELDS;

const {
  ITEM_HOLD,
  TRANSFER,
  ITEM_IN_TRANSIT,
} = TRANSACTION_STATUSES;

const ItemActions = ({
  transaction,
  onToggle,
  onCheckoutBorrowingSite,
  onTransferHold,
  onRecallItem,
  onCancelItemHold,
  onFinalCheckInItem,
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
        disabled
        icon={ICONS.TRANSFER}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.transfer-hold"
        onToggle={onToggle}
        onClickHandler={onTransferHold}
      />
      <ActionItem
        disabled
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
        disabled={![ITEM_IN_TRANSIT].includes(transaction[STATUS])}
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
  onCancelItemHold: PropTypes.object.isRequired,
  onCheckoutBorrowingSite: PropTypes.func.isRequired,
  onFinalCheckInItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRecallItem: PropTypes.func,
  onTransferHold: PropTypes.func,
};

export default ItemActions;
