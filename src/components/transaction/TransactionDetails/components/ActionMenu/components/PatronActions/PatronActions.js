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
  PATRON_HOLD,
  TRANSFER,
  ITEM_SHIPPED,
  ITEM_RECEIVED,
  RECEIVE_UNANNOUNCED,
} = TRANSACTION_STATUSES;

const {
  FOLIO_LOAN_ID,
  FOLIO_REQUEST_ID,
  FOLIO_ITEM_ID,
} = HOLD_FIELDS;

const PatronActions = ({
  transaction,
  onToggle,
  onCheckOutToPatron,
  onReceiveItem,
  onReceiveUnshippedItem,
  onReturnItem,
  onCancelHold,
  onRemoveHold,
}) => {
  return (
    <>
      <ActionItem
        disabled={!(
          !transaction[HOLD][FOLIO_LOAN_ID] &&
          [ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS])
        )}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOutToPatron}
      />
      <ActionItem
        disabled={transaction[STATUS] !== ITEM_SHIPPED}
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-item"
        onToggle={onToggle}
        onClickHandler={onReceiveItem}
      />
      <ActionItem
        disabled={![PATRON_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-unshipped-item"
        onToggle={onToggle}
        onClickHandler={onReceiveUnshippedItem}
      />
      <ActionItem
        disabled={![ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS])}
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.return-item"
        onToggle={onToggle}
        onClickHandler={onReturnItem}
      />
      <ActionItem
        disabled={!(
          [PATRON_HOLD, ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS]) &&
          transaction?.[HOLD]?.[FOLIO_REQUEST_ID]
        )}
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
      <ActionItem
        disabled={!(
          transaction[STATUS] === PATRON_HOLD &&
          !transaction?.[HOLD]?.[FOLIO_ITEM_ID] &&
          !transaction?.[HOLD]?.[FOLIO_REQUEST_ID] &&
          !transaction?.[HOLD]?.[FOLIO_LOAN_ID]
        )}
        icon={ICONS.DELETE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.remove-hold"
        onToggle={onToggle}
        onClickHandler={onRemoveHold}
      />
    </>
  );
};

PatronActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelHold: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onRemoveHold: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default PatronActions;
