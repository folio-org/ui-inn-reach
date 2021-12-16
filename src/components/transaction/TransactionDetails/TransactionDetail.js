import React, {
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
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
} from './components';
import {
  TRANSACTION_DETAIL_ACCORDION_STATE,
  FILL_PANE_WIDTH,
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
  CALLOUT_ERROR_TYPE,
} from '../../../constants';
import ReceiveUnshippedItemModal from './components/ReceiveUnshippedItemModal';
import {
  useCallout,
} from '../../../hooks';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  TITLE,
} = HOLD_FIELDS;

const TransactionDetail = ({
  mutator,
  transaction,
  stripes,
  onClose,
}) => {
  const intl = useIntl();
  const showCallout = useCallout();
  const [openUnshippedItemModal, setOpenUnshippedItemModal] = useState(false);

  const triggerUnshippedItemModal = () => {
    setOpenUnshippedItemModal(prevModalState => !prevModalState);
  };

  const fetchReceiveUnshippedItem = (itemBarcode) => {
    mutator.receiveUnshippedItem.POST({
      itemBarcode,
    })
      .then(() => {
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.success.post.receive-unshipped-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.connection-problem.post.receive-unshipped-item" />,
        });
      });
  };

  const handleSubmit = ({ itemBarcode }) => {
    const servicePointId = stripes?.user?.user?.curServicePoint?.id;

    mutator.servicePointId.replace(servicePointId);
    fetchReceiveUnshippedItem(itemBarcode);
  };

  const renderActionMenu = useCallback(({ onToggle }) => (
    <ActionMenu
      transaction={transaction}
      onToggle={onToggle}
      onReceiveUnshippedItem={triggerUnshippedItemModal}
    />
  ), [transaction]);

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
      {openUnshippedItemModal &&
        <ReceiveUnshippedItemModal
          intl={intl}
          onSubmit={handleSubmit}
          onTriggerModal={triggerUnshippedItemModal}
        />
      }
    </Pane>
  );
};

TransactionDetail.manifest = Object.freeze({
  servicePointId: { initialValue: '' },
  receiveUnshippedItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/!{transaction.id}/receive-unshipped/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

TransactionDetail.propTypes = {
  stripes: stripesShape.isRequired,
  transaction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  mutator: PropTypes.shape({
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    receiveUnshippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(TransactionDetail);
