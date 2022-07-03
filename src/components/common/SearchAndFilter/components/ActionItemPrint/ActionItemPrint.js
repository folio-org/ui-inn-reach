import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
} from '@folio/stripes-components';

import PrintSlips from '../PrintSlips';

import css from './ActionItemPrint.css';

const ActionItemPrint = ({
  id,
  buttonStyle,
  icon,
  size,
  buttonLabel,
  disabled,
  templates,
  templatesContext,
  onClickHandler,
  onToggle,
}) => (
  <PrintSlips
    id={id}
    buttonStyle={buttonStyle}
    disabled={disabled}
    templates={templates}
    templatesContext={templatesContext}
    buttonClass={disabled ? css.button : null}
    onClick={() => {
      onToggle();
      onClickHandler();
    }}
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
  buttonLabel: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.string,
  onClickHandler: PropTypes.func,
};

ActionItemPrint.defaultProps = {
  size: 'medium',
  buttonStyle: 'dropdownItem',
};

export default ActionItemPrint;
