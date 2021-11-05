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
  ITEM_INFORMATION,
  TRANSACTION_DETAIL_FIELDS,
} from '../../../../../constants';

const {
  ITEM_ID,
  FOLIO_ITEM_ID,
  TITLE,
  CENTRAL_ITEM_TYPE,
  CALL_NUMBER,
  ITEM_AGENCY_CODE,
  HOLD,
  CENTRAL_SERVER_CODE,
  METADATA,
  CREATED_BY_USER_NAME,
  INSTANCE_ID,
  HOLDINGS_ID,
} = TRANSACTION_DETAIL_FIELDS;

const ItemInformation = ({
  transaction,
}) => {
  return (
    <Accordion
      id={ITEM_INFORMATION}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.item" />}
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemId" />}
            value={
              transaction[HOLD]?.[ITEM_ID] &&
              transaction[HOLD]?.[FOLIO_ITEM_ID] &&
              transaction[HOLD]?.[INSTANCE_ID] &&
              transaction[HOLD]?.[HOLDINGS_ID] &&
              <Link to={`/inventory/view/${transaction[HOLD][INSTANCE_ID]}/${transaction[HOLD][HOLDINGS_ID]}/${transaction[HOLD][FOLIO_ITEM_ID]}`}>
                {transaction[HOLD][ITEM_ID]}
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemTitle" />}
            value={transaction[HOLD]?.[TITLE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.centralItemType" />}
            value={transaction[HOLD]?.[CENTRAL_ITEM_TYPE] &&
              `${transaction[CENTRAL_SERVER_CODE]}: ${transaction[HOLD][CENTRAL_ITEM_TYPE]}`
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.author" />}
            value={transaction[HOLD]?.[METADATA]?.[CREATED_BY_USER_NAME]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.callNo" />}
            value={transaction[HOLD]?.[CALL_NUMBER]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemAgency" />}
            value={transaction[HOLD]?.[ITEM_AGENCY_CODE]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemInformation.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default ItemInformation;
