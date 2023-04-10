import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Settings from './Settings';
import { translationsProperties, renderWithIntl } from '../../../../test/jest/helpers';

jest.mock('@folio/stripes/core', () => ({
  IfInterface: jest.fn(() => <div>IfInterface</div>),
}));

const renderSettings = ({ sections, path }) => {
  const history = createMemoryHistory();

  return renderWithIntl(
    <Router history={history}>
      <Settings
        sections={sections}
        path={path}
        location={{ pathname: '/' }}
      />
    </Router>,
    translationsProperties,
  );
};

const pages = [
  {
    route: 'a',
    label: 'testLabel1',
    component: <div />,
    perm: '',
  },
  {
    route: 'b',
    label: 'testLabel2',
    component: <div />,
    perm: '',
  },
];

const label = 'ui-inn-reach.settings.general';

describe('Settings', () => {
  let settings;

  describe('vanilla', () => {
    beforeEach(() => {
      settings = renderSettings({
        sections: [{ label, pages }],
        path: 'funky',
      });
    });

    it('should be rendered', () => {
      const { container, getByTestId } = settings;

      expect(container).toBeVisible();
      expect(getByTestId('settings')).toBeVisible();
    });
  });

  describe('with interface present', () => {
    beforeEach(() => {
      settings = renderSettings({
        sections: [{ label, pages, interface: 'interface' }],
        path: 'funky',
      });
    });

    it('should be rendered', () => {
      const { container, getByText } = settings;

      expect(container).toBeVisible();
      expect(getByText('IfInterface')).toBeDefined();
    });
  });

  describe('with interface absent', () => {
    beforeEach(() => {
      settings = renderSettings({
        sections: [{ label, pages, interface: 'asdf' }],
        path: 'funky',
      });
    });

    it('should not be rendered', () => {
      const { container, queryByTestId } = settings;

      expect(container).toBeVisible();
      expect(queryByTestId('settings')).toBeNull();
    });
  });
});
