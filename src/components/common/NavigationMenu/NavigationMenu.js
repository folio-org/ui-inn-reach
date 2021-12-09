import PropTypes from 'prop-types';
import {
  Select,
} from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import {
  getReceiveShippedItemUrl,
  getTransactionListUrl,
} from '../../../constants';

const NavigationMenu = ({
  history,
  location,
  value,
  dataOptions,
}) => {
  const intl = useIntl();

  const defaultOptions = [
    {
      label: intl.formatMessage({ id: 'ui-inn-reach.title.list.transactions' }),
      value: getTransactionListUrl(),
    },
    {
      label: intl.formatMessage({ id: 'ui-inn-reach.shipped-items.title.receive-shipped-items' }),
      value: getReceiveShippedItemUrl(),
    },
  ];

  const handleChangeMenu = (event) => {
    const pathname = event.target.value;
    const destination = {
      pathname,
      state: location.state,
    };

    if (pathname === getTransactionListUrl()) {
      destination.search = location.state;
    } else {
      destination.state = location.search;
    }

    history.push(destination);
  };

  return (
    <Select
      value={value}
      dataOptions={dataOptions || defaultOptions}
      onChange={handleChangeMenu}
    />
  );
};

NavigationMenu.defaultProps = {
  value: getTransactionListUrl(),
};

NavigationMenu.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.object.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  value: PropTypes.string,
};

export default NavigationMenu;
