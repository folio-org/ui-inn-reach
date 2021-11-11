import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import InnReachRecallUserCreateEditRoute from './InnReachRecallUserRoute';

const InnReachRecallUserRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={InnReachRecallUserCreateEditRoute}
      />
    </Switch>
  );
};

InnReachRecallUserRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(InnReachRecallUserRoute);
