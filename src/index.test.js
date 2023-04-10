import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen, act } from '@testing-library/react';

import { useStripes } from '@folio/stripes/core';

import InnReach from './index';
import { translationsProperties, renderWithIntl } from '../test/jest/helpers';
import { TransactionListRoute } from './routes';

jest.mock('./settings', () => () => 'InnReachSettings');
jest.mock('@folio/stripes-smart-components/lib/SearchAndSort/components/MultiSelectionFilter', () => {
  return jest.fn(() => <div>MultiSelectionFilter</div>);
});
jest.mock('./routes/transaction/TransactionListRoute', () => jest.fn(() => <div>TransactionListRoute</div>));

const DEFAULT_MUTATOR = {
  servicePointId: {
    replace: jest.fn(),
  },
};

const renderRoutes = (props) => {
  return renderWithIntl(
    <Router history={props.history || createMemoryHistory()}>
      <InnReach
        match={{
          path: '/',
          params: {},
          url: '',
        }}
        mutator={props.mutator}
        {...props}
      />
    </Router>,
    translationsProperties,
  );
};

describe('InnReach', () => {
  let stripes;

  beforeEach(() => {
    TransactionListRoute.mockClear();
    stripes = useStripes();
  });

  describe('setting routes', () => {
    it('should be rendered', () => {
      const { container, getByText } = renderRoutes({ stripes, showSettings: true });

      expect(container).toBeVisible();
      expect(getByText('InnReachSettings')).toBeDefined();
    });
  });

  describe('application routes', () => {
    describe('TransactionDetailContainer route', () => {
      beforeEach(async () => {
        const history = createMemoryHistory();

        history.push('/innreach/transactions/388cd313-cc79-4b48-ba26-8ed84b306a7c/view');

        await act(async () => {
          renderRoutes({
            stripes,
            match: {
              path: '/innreach',
              params: {},
              url: '/innreach',
            },
            history,
            mutator: DEFAULT_MUTATOR
          });
        });
      });

      it('should be rendered', () => {
        expect(screen.getByText('TransactionListRoute')).toBeVisible();
      });
    });
  });
});
