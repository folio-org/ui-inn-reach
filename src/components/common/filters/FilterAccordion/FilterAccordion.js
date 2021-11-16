import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

const FilterAccordion = ({
  activeFilters,
  children,
  closedByDefault,
  disabled,
  id,
  label,
  labelId,
  name,
  onChange,
}) => {
  const onClearFilter = useCallback(() => {
    onChange({ name, values: [] });
  }, [name, onChange]);

  return (
    <Accordion
      closedByDefault={closedByDefault}
      displayClearButton={!disabled && activeFilters?.length > 0}
      header={FilterAccordionHeader}
      id={id || name}
      label={labelId ? <FormattedMessage id={labelId} /> : label}
      onClearFilter={onClearFilter}
    >
      {children}
    </Accordion>
  );
};

FilterAccordion.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  labelId: PropTypes.string,
};

FilterAccordion.defaultProps = {
  closedByDefault: false,
  disabled: false,
};

export default FilterAccordion;
