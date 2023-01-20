import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import CentralServersConfigurationForm from './CentralServersConfigurationForm';

import { translationsProperties } from '../../../../../test/jest/helpers';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../constants';
import { CentralServersConfigurationContext } from '../../../../contexts';

jest.mock('./components/TabularList', () => jest.fn(() => <div>TabularList</div>));

const data = {
  folioLibraries: [
    {
      name: 'Online',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    },
    {
      name: 'Welcome',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fpgfkj',
    },
  ],
  loanTypes: [
    {
      name: 'Reading room',
      id: 'ac19815e-1d8e-473f-bd5a-3193cb301b8b',
    },
    {
      name: 'mics',
      id: 'e17acc08-b8ca-469a-a984-d9249faad178',
    },
  ],
};

const initValues = {
  localAgencies: [
    {
      localAgency: '',
      FOLIOLibraries: '',
    },
  ],
};

const renderForm = ({
  onCancel,
  initialValues,
  isEditMode = false,
  onSubmit,
  showPrevLocalServerValue,
  onShowPreviousLocalServerValue,
  onChangePristineState,
}) => {
  return renderWithIntl(
    <MemoryRouter>
      <CentralServersConfigurationContext.Provider value={data}>
        <CentralServersConfigurationForm
          initialValues={initialValues}
          isEditMode={isEditMode}
          showPrevLocalServerValue={showPrevLocalServerValue}
          onSaveLocalServerKeypair={jest.fn()}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onShowPreviousLocalServerValue={onShowPreviousLocalServerValue}
          onChangePristineState={onChangePristineState}
        />
      </CentralServersConfigurationContext.Provider>
    </MemoryRouter>,
    translationsProperties,
  );
};

describe('CentralServerConfigurationForm component', () => {
  const handleCancel = jest.fn();
  const handleSubmit = jest.fn();
  const onShowPreviousLocalServerValue = jest.fn();
  const onChangePristineState = jest.fn();
  const commonProps = {
    initialValues: initValues,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onChangePristineState,
  };

  it('should display "edit" title', () => {
    renderForm({
      ...commonProps,
      initialValues: { ...initValues, id: '777' },
    });
    expect(screen.getByText('Edit')).toBeDefined();
  });

  it('should display title', () => {
    renderForm(commonProps);
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });

  it('should display "Collapse all" button', () => {
    renderForm(commonProps);
    expect(screen.getByText('Collapse all')).toBeDefined();
  });

  describe('the state of sections after clicking the "Collapse all" button', () => {
    let section1;
    let section2;
    let toggleButton;

    beforeEach(() => {
      renderForm(commonProps);
      section1 = document.querySelector('#accordion-toggle-button-section1');
      section2 = document.querySelector('#accordion-toggle-button-section2');
      toggleButton = document.querySelector('[data-test-expand-button]');
      userEvent.click(toggleButton);
    });

    it('should be opened', () => {
      expect(section1.getAttribute('aria-expanded')).toBe('false');
      expect(section2.getAttribute('aria-expanded')).toBe('false');
    });

    it('should be closed', () => {
      userEvent.click(toggleButton);
      expect(section1.getAttribute('aria-expanded')).toBe('true');
      expect(section2.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('should display form', () => {
    renderForm(commonProps);
    expect(screen.getByTestId('central-server-configuration-form')).toBeInTheDocument();
  });

  it('should invoke onCancel callback', () => {
    renderForm(commonProps);
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleCancel).toBeCalled();
  });

  it('should show the original data of the local server', () => {
    const originalValues = {
      ...initValues,
      localServerKey: 'testKey',
      localServerSecret: 'testSecret',
    };

    renderForm({
      ...commonProps,
      initialValues: originalValues,
      showPrevLocalServerValue: true,
      onShowPreviousLocalServerValue,
    });

    expect(onShowPreviousLocalServerValue).toHaveBeenCalledWith(false);
  });

  it('should render disabled save button', () => {
    const { getByTestId } = renderForm({
      ...commonProps,
      isCentralServerDataInvalid: true,
    });

    expect(getByTestId('save-button')).toBeDisabled();
  });

  describe('local server code field', () => {
    it('should be empty', () => {
      renderForm(commonProps);
      expect(screen.getByRole('textbox', { name: 'Local server code' })).not.toHaveValue();
    });

    it('should show "Required" error message', () => {
      renderForm(commonProps);
      const field = screen.getByRole('textbox', { name: 'Local server code' });

      field.focus();
      expect(field).toHaveFocus();
      field.blur();
      expect(screen.getByText('Required')).toBeDefined();
    });

    it('should show "Please enter a 5 character string in lower case"', () => {
      renderForm(commonProps);
      const field = screen.getByRole('textbox', { name: 'Local server code' });

      act(() => { userEvent.type(field, 'abc'); });
      field.blur();
      expect(screen.getByText('Please enter a 5 character string in lower case')).toBeDefined();
    });
  });

  describe('local server fields', () => {
    describe('common behavior', () => {
      let localServerKey;
      let localServerSecret;

      beforeEach(() => {
        renderForm(commonProps);
        localServerKey = screen.getByTestId(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY);
        localServerSecret = screen.getByTestId(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET);
      });

      it('should be empty', () => {
        expect(localServerKey).toHaveValue('');
        expect(localServerSecret).toHaveValue('');
      });

      it('should be disabled', () => {
        expect(localServerKey).toBeDisabled();
        expect(localServerSecret).toBeDisabled();
      });

      it('should have an uuid after clicking on the "Generate keypair" button', () => {
        act(() => { userEvent.click(screen.getByTestId('generate-keypair')); });
        expect(localServerKey.value.length).toBe(36);
        expect(localServerSecret.value.length).toBe(36);
      });
    });

    describe('edit mode', () => {
      let localServerSecret;

      beforeEach(() => {
        renderForm({
          ...commonProps,
          isEditMode: true,
        });
        localServerSecret = screen.getByTestId(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET);
      });

      it('should have "password" type', () => {
        expect(localServerSecret.type).toBe('password');
      });

      it('should have "text" type', () => {
        const showSecretButton = screen.getByTestId('toggle-secret-mask');

        act(() => { userEvent.click(showSecretButton); });
        expect(localServerSecret.type).toBe('text');
      });
    });
  });

  describe('"Show secrets" button', () => {
    it('should be visible', () => {
      const { getByTestId } = renderForm({
        ...commonProps,
        isEditMode: true,
      });
      const showSecretButton = getByTestId('toggle-secret-mask');

      expect(showSecretButton).toBeVisible();
    });

    it('should be hidden', () => {
      const { queryByTestId } = renderForm(commonProps);
      const showSecretButton = queryByTestId('toggle-secret-mask');

      expect(showSecretButton).toBeNull();
    });

    it('should have a "Show secrets" name', () => {
      const { getByText } = renderForm({
        ...commonProps,
        isEditMode: true,
      });

      expect(getByText('Show secrets')).toBeDefined();
    });

    it('should have a "Hide secrets" name', () => {
      const { getByText, getByTestId } = renderForm({
        ...commonProps,
        isEditMode: true,
      });
      const showSecretButton = getByTestId('toggle-secret-mask');

      act(() => { userEvent.click(showSecretButton); });
      expect(getByText('Hide secrets')).toBeDefined();
    });
  });

  describe('footer pane', () => {
    it('should display "save" and "cancel" buttons', () => {
      renderForm(commonProps);
      expect(screen.getByText('Save & close')).toBeDefined();
      expect(screen.getByText('Cancel')).toBeDefined();
    });

    it('should have disabled "Save & close" button by default', () => {
      renderForm(commonProps);
      expect(screen.getByTestId('save-button')).toBeDisabled();
    });
  });
});
