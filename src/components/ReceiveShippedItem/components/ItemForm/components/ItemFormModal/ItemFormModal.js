import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes-components';

const ItemFormModal = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      dismissible
      open={open}
      size="small"
      label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.title" />}
      footer={
        <ModalFooter>
          <Button
            marginBottom0
            buttonStyle="primary"
            onClick={onClose}
          >
            <FormattedMessage id="ui-inn-reach.shipped-items.modal.button" />
          </Button>
        </ModalFooter>
      }
      onClose={onClose}
    >
      <FormattedMessage id="ui-inn-reach.shipped-items.modal.message" />
    </Modal>
  );
};

ItemFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ItemFormModal;
