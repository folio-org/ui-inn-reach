import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
} from '@folio/stripes/components';

import PrintSlips from '../PrintSlips';

import css from './ActionItemPrint.css';

const ActionItemPrint = ({
  id,
  buttonStyle = 'dropdownItem',
  icon,
  size = 'medium',
  buttonLabel,
  disabled,
  templates = {},
  templatesContext = [],
  onToggle,
}) => (
  <PrintSlips
    id={id}
    buttonStyle={buttonStyle}
    disabled={disabled}
    templates={templates}
    templatesContext={templatesContext}
    buttonClass={disabled ? css.button : null}
    onClick={onToggle}
  >
    <Icon
      icon={icon}
      size={size}
      iconClassName={css.actionIcon}
    />
    {buttonLabel}
  </PrintSlips>
);

ActionItemPrint.propTypes = {
  buttonLabel: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.string,
  templates: PropTypes.object,
  templatesContext: PropTypes.array,
};

export default ActionItemPrint;
