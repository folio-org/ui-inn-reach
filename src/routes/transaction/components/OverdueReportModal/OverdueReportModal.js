import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Field,
} from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Row,
  Col,
  Button,
  Modal,
  TextField,
  ModalFooter,
} from '@folio/stripes-components';

import {
  required,
} from '../../../../utils';
import {
  OWNING_SITE_OVERDUE_FIELDS,
} from '../../../../constants';

const {
  MINIMUM_DAYS_OVERDUE,
} = OWNING_SITE_OVERDUE_FIELDS;

const OverdueReportModal = ({
  invalid,
  handleSubmit,
  form,
  onTriggerModal,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        marginBottom0
        disabled={invalid}
        buttonStyle="primary"
        onClick={form.submit}
      >
        <FormattedMessage id="ui-inn-reach.reports.modal.button.save-and-close" />
      </Button>
      <Button
        marginBottom0
        buttonStyle="default"
        onClick={onTriggerModal}
      >
        <FormattedMessage id="ui-inn-reach.reports.modal.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open
      dismissible
      size="small"
      label={<FormattedMessage id="ui-inn-reach.reports.modal.title.maximum-days-overdue" />}
      footer={footer}
      onClose={onTriggerModal}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
            <Field
              required
              autoFocus
              type="number"
              label={<FormattedMessage id="ui-inn-reach.reports.modal.field.maximum-days-overdue" />}
              name={MINIMUM_DAYS_OVERDUE}
              validate={required}
              component={TextField}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

OverdueReportModal.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  onTriggerModal: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: {
    invalid: true,
  },
})(OverdueReportModal);
