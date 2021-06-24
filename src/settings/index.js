import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes-core';
import {
  Callout,
  LoadingPane,
} from '@folio/stripes-components';

import {
  CalloutContext,
} from '../contexts';
import {
  CALLOUT_ERROR_TYPE,
  RECORD_CONTRIBUTION,
  SETTINGS_PANE_WIDTH,
} from '../constants';
import {
  sections,
} from './components/Settings/constants';
import {
  Settings,
} from './components';
import { useCallout } from '../hooks';

const InnReachSettings = ({
  children,
  match: {
    path,
  },
  mutator,
}) => {
  const showCallout = useCallout();
  const calloutRef = useRef(null);
  const [centralServers, setCentralServers] = useState([]);
  const [sectionsToShow, setSectionsToShow] = useState(sections);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEmpty(centralServers)) {
      const filteredSections = sections.filter(section => (
        ![RECORD_CONTRIBUTION].includes(section.id)
      ));

      setSectionsToShow(filteredSections);
    } else {
      setSectionsToShow(sections);
    }
  }, [centralServers]);

  useEffect(() => {
    setIsLoading(true);

    mutator.centralServerRecords.GET()
      .then(response => setCentralServers(response.centralServers))
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingPane defaultWidth={SETTINGS_PANE_WIDTH} />;
  }

  return (
    <>
      <CalloutContext.Provider value={calloutRef.current}>
        <Settings
          path={path}
          sections={sectionsToShow}
        />
        {children}
      </CalloutContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
};

InnReachSettings.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

InnReachSettings.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      GET: PropTypes.func,
    }),
  }).isRequired,
  children: PropTypes.node,
};

export default stripesConnect(InnReachSettings);
