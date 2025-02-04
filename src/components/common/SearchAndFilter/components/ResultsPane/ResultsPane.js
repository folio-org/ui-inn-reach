import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import {
  APP_NAME,
  FILL_PANE_WIDTH,
  ICON_KEYS,
} from '../../../../../constants';
import { getFiltersCount } from '../../../../../utils';

const ResultsPane = ({
  children,
  width = FILL_PANE_WIDTH,
  title,
  subTitle = '',
  count = 0,
  renderLastMenu,
  renderActionMenu,
  toggleFiltersPane,
  isFiltersOpened = true,
  filters,
}) => {
  const paneSub = (
    <FormattedMessage
      id="stripes-smart-components.searchResultsCountHeader"
      values={{ count }}
    />
  );

  const renderResultsFirstMenu = () => {
    if (isFiltersOpened) {
      return null;
    }

    const filterCount = getFiltersCount(filters);

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFiltersPane}
        />
      </PaneMenu>
    );
  };

  const getAppIcon = useCallback(() => (
    <AppIcon
      app={APP_NAME}
      iconKey={ICON_KEYS.APP}
    />
  ), []);

  return (
    <Pane
      data-test-results-pane
      noOverflow
      appIcon={getAppIcon()}
      defaultWidth={width}
      firstMenu={renderResultsFirstMenu()}
      lastMenu={renderLastMenu && renderLastMenu()}
      padContent={false}
      paneSub={subTitle || paneSub}
      paneTitle={title}
      actionMenu={renderActionMenu}
    >
      {children}
    </Pane>
  );
};

ResultsPane.propTypes = {
  children: PropTypes.node.isRequired,
  filters: PropTypes.object.isRequired,
  renderActionMenu: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  count: PropTypes.number,
  isFiltersOpened: PropTypes.bool,
  renderLastMenu: PropTypes.func,
  subTitle: PropTypes.node,
  toggleFiltersPane: PropTypes.func,
  width: PropTypes.string,
};

export default ResultsPane;
