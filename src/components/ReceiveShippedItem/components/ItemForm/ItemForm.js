import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'react-final-form';
import {
  FormattedMessage,
} from 'react-intl';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  TextField,
  Row,
  Col,
} from '@folio/stripes-components';
import ItemFormModal from './components';

const ItemForm = ({
  isOpenModal,
  isLoading,
  pristine,
  intl,
  form,
  formRef,
  handleSubmit,
}) => {
  const [open, setOpen] = useState(isOpenModal);

  const handleCloseModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isOpenModal) {
      setOpen(true);
    }
  }, [isOpenModal]);

  useEffect(() => {
    formRef.current = form;
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={3}>
            <Field
              autoFocus
              name="itemBarcode"
              placeholder={intl.formatMessage({ id: 'ui-inn-reach.shipped-items.placeholder.scan-or-enter-item-barcode' })}
              component={TextField}
            />
          </Col>
          <Button
            type="submit"
            disabled={pristine || isLoading}
          >
            <FormattedMessage id="ui-inn-reach.shipped-items.button.enter" />
          </Button>
        </Row>
      </form>
      <ItemFormModal
        open={open}
        onClose={handleCloseModal}
      />
    </>
  );
};

ItemForm.propTypes = {
  form: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpenModal: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(ItemForm);
