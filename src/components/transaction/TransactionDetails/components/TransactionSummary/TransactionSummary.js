import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ViewMetaData,
} from '@folio/stripes-smart-components';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
  FormattedDate,
  FormattedTime,
} from '@folio/stripes-components';
import {
  Link,
} from 'react-router-dom';
import {
  TRANSACTION_DETAIL_FIELDS,
  TRANSACTION_SUMMARY,
} from '../../../../../constants';

const {
  METADATA,
  TRANSACTION_TIME,
  TRACKING_ID,
  TYPE,
  STATE,
  PATRON_NAME,
  PICKUP_LOCATION,
  FOLIO_REQUEST_ID,
  FOLIO_LOAN_ID,
  FOLIO_PATRON_ID,
  HOLD,
} = TRANSACTION_DETAIL_FIELDS;

const TransactionSummary = ({
  transaction,
}) => {
  return (
    <Accordion
      id={TRANSACTION_SUMMARY}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.transaction" />}
    >
      <ViewMetaData metadata={transaction[METADATA]} />
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.time" />}
            value={transaction[HOLD]?.[TRANSACTION_TIME] &&
              <FormattedMessage
                id="ui-inn-reach.transaction-detail.field.label.time"
                values={{
                  date: <FormattedDate value={transaction[HOLD][TRANSACTION_TIME]} />,
                  time: <FormattedTime value={transaction[HOLD][TRANSACTION_TIME]} />,
                }}
              />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.trackingId" />}
            value={transaction[TRACKING_ID]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.type" />}
            value={transaction[TYPE] &&
              <FormattedMessage id={`ui-inn-reach.transaction.transactionType.${transaction[TYPE]}`} />
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.status" />}
            value={transaction[STATE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronName" />}
            value={transaction[HOLD]?.[PATRON_NAME]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.pickupLocation" />}
            value={transaction[HOLD]?.[PICKUP_LOCATION]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.request" />}
            value={transaction[HOLD]?.[FOLIO_REQUEST_ID] &&
              <Link to={`/requests/view/${transaction[HOLD][FOLIO_REQUEST_ID]}`}>
                <FormattedMessage id="ui-inn-reach.transaction-detail.field.label.request" />
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.loan" />}
            value={
              transaction[HOLD]?.[FOLIO_LOAN_ID] &&
              transaction[HOLD]?.[FOLIO_PATRON_ID] &&
              <Link to={`/users/${transaction[HOLD][FOLIO_PATRON_ID]}/loans/view/${transaction[HOLD][FOLIO_LOAN_ID]}`}>
                <FormattedMessage id="ui-inn-reach.transaction-detail.field.label.loan" />
              </Link>
            }
          />
        </Col>
      </Row>
    </Accordion>
  );
};

TransactionSummary.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default TransactionSummary;
