import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import PatronInformation from './PatronInformation';

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   Link: jest.fn(() => <div>Users</div>)
// }));

const transactionMock = {
  centralServerCode: 'd2ir',
  hold: {
    centralPatronType: 200,
    patronId: 'patron1',
    patronAgencyCode: 'jcg01',
    patronName: 'Brown, Adam',
    folioPatronId: 'b4cee18d-f862-4ef1-95a5-879fdd619603',
  },
};

const history = createMemoryHistory();

const renderPatronInformation = (transaction) => {
  return renderWithIntl(
    <Router history={history}>
      <PatronInformation
        transaction={transaction}
      />
    </Router>,
    translationsProperties,
  );
};

describe('PatronInformation', () => {
  describe('should render Patron Information', () => {
    beforeEach(() => {
      renderPatronInformation(transactionMock);
    });

    it('should show the transaction patron id', () => {
      expect(screen.getByText('patron1')).toBeVisible();
    });

    it('should show the transaction patron name', () => {
      expect(screen.getByText('Brown, Adam')).toBeVisible();
    });

    it('should show the transaction patron type', () => {
      expect(screen.getByText('d2ir: 200')).toBeVisible();
    });

    it('should show the transaction patron agency', () => {
      expect(screen.getByText('jcg01')).toBeVisible();
    });
  });

  describe('render patron information with link in patron id', () => {
    beforeEach(() => {
      renderPatronInformation({ ...transactionMock, type: 'PATRON' });
    });

    it('should show the transaction patron id as a link', () => {
      expect(screen.getByRole('link')).toBeDefined();
    });
  });

  describe('render patron information with patron id as just a text', () => {
    beforeEach(() => {
      renderPatronInformation({ ...transactionMock, type: 'ITEM' });
    });

    it('should show the transaction patron id is not a link', () => {
      const links = screen.queryAllByRole('link');

      expect(links.length).toBe(0);
      expect(screen.getByText('patron1')).toBeVisible();
    });

    it('should show the transaction patron id is a text', () => {
      expect(screen.getByText('patron1')).toBeVisible();
    });
  });
});
