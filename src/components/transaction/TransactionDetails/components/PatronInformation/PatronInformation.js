import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes-components';
import {
  Link,
} from 'react-router-dom';
import {
  PATRON_INFORMATION,
  TRANSACTION_DETAIL_FIELDS,
  TRANSACTION_STATUSES,
} from '../../../../../constants';

const {
  PATRON_ID,
  FOLIO_PATRON_ID,
  PATRON_NAME,
  CENTRAL_PATRON_TYPE,
  PATRON_AGENCY,
  HOLD,
  STATE,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_DETAIL_FIELDS;

const {
  PATRON_HOLD,
} = TRANSACTION_STATUSES;

const PatronInformation = ({
  transaction,
}) => {
  return (
    <Accordion
      id={PATRON_INFORMATION}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.patron" />}
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronId" />}
            value={
              transaction[HOLD]?.[PATRON_ID] &&
              transaction[HOLD]?.[FOLIO_PATRON_ID] &&
              transaction[HOLD]?.[STATE] === PATRON_HOLD
                ? (
                  <Link to={`/users/preview/${transaction[HOLD][FOLIO_PATRON_ID]}`}>
                    {transaction[HOLD][FOLIO_PATRON_ID]}
                  </Link>
                )
                : transaction[HOLD]?.[PATRON_ID]
            }
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
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronType" />}
            value={
              transaction[CENTRAL_SERVER_CODE] &&
              transaction[HOLD]?.[CENTRAL_PATRON_TYPE] &&
              `${transaction[CENTRAL_SERVER_CODE]}: ${transaction[HOLD][CENTRAL_PATRON_TYPE]}`
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronAgency" />}
            value={transaction[HOLD]?.[PATRON_AGENCY]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

PatronInformation.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default PatronInformation;
