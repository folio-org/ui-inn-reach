import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ActionItem.css';

const ActionItem = ({
  id,
  buttonStyle = 'dropdownItem',
  icon,
  size = 'medium',
  buttonTextTranslationKey,
  disabled,
  onClickHandler,
  onToggle,
}) => (
  <Button
    id={id}
    buttonStyle={buttonStyle}
    disabled={disabled}
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
    <FormattedMessage id={buttonTextTranslationKey} />
  </Button>
);

ActionItem.propTypes = {
  buttonTextTranslationKey: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.string,
  onClickHandler: PropTypes.func,
};

export default ActionItem;
