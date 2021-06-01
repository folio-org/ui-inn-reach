import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import GeneralInformation from './GeneralInformation';

import { translationsProperties } from '../../../../../../../test/jest/helpers';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';

import CentralServersConfigurationContext from '../../../../../../contexts/CentralServersConfigurationContext';

jest.mock('@folio/stripes-smart-components', () => ({ ViewMetaData: jest.fn(() => <div>ViewMetaData</div>) }));

const folioLibraries = [
  {
    name: 'Online',
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
  },
  {
    name: 'Welcome',
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fpgfkj',
  },
];

const loanTypes = [
  {
    name: 'Reading room',
    id: 'ac19815e-1d8e-473f-bd5a-3193cb301b8b',
  },
  {
    name: 'mics',
    id: 'e17acc08-b8ca-469a-a984-d9249faad178',
  },
];

const centralServer = {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
};

const RenderGeneralInformation = () => (
  <CentralServersConfigurationContext.Provider
    value={{
      loanTypes,
      folioLibraries,
    }}
  >
    <GeneralInformation
      centralServer={centralServer}
    />
  </CentralServersConfigurationContext.Provider>
);

describe('GeneralInformation component', () => {
  let renderedGeneralInformation;

  beforeEach(() => {
    renderedGeneralInformation = renderWithIntl(
      RenderGeneralInformation(),
      translationsProperties,
    );

    return renderedGeneralInformation;
  });

  it('should be rendered', () => {
    expect(renderedGeneralInformation).toBeDefined();
  });

  it('should display `General information` section title', () => {
    expect(screen.getByText('General information')).toBeInTheDocument();
  });

  describe('main accordion', () => {
    it('should be collapsed after click', () => {
      const generalInformationBtn = document.querySelector('#accordion-toggle-button-centralServerGeneralAccordion');

      userEvent.click(generalInformationBtn);
      expect(generalInformationBtn.getAttribute('aria-expanded')).toBe('false');
      userEvent.click(generalInformationBtn);
      expect(generalInformationBtn.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('should contain `Name` sub title', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should contain `Description` sub title', () => {
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should contain `Local server code` sub title', () => {
    expect(screen.getByText('Local server code')).toBeInTheDocument();
  });

  it('should contain `Local agency` sub title', () => {
    expect(screen.getByText('Local agency')).toBeInTheDocument();
  });

  it('should contain `FOLIO libraries` sub title', () => {
    expect(screen.getByText('FOLIO libraries')).toBeInTheDocument();
  });

  it('should contain `Borrowed item loan type` sub title', () => {
    expect(screen.getByText('Borrowed item loan type')).toBeInTheDocument();
  });
});