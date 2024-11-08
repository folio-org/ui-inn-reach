import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import PatronAgencyForm from './PatronAgencyForm';

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'CSC',
    value: 'f8723a94-25d5-4f19-9043-cc3c306d54a1'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'testName2',
    value: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const customFieldOptions = [
  {
    value: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
    label: 'Home Library',
  },
  {
    value: 'ce1f650d-cf0a-44c0-b87e-0473eaf825fa',
    label: 'City Library',
  },
];

const agencyCodeOptions = [
  {
    label: '1qwer',
    value: '1qwer',
  },
];

const defaultInitialValues = {
  customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
  configuredOptions: [
    {
      customFieldValue: 'qwerty1',
    },
    {
      customFieldValue: 'qwerty2',
    },
  ],
};

const renderCentralPatronTypeForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = defaultInitialValues,
  userCustomFieldMappings = defaultInitialValues,
  isUserCustomFieldMappingsPending = false,
  onChangeServer,
  onChangeCustomField,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <PatronAgencyForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        customFieldOptions={customFieldOptions}
        agencyCodeOptions={agencyCodeOptions}
        userCustomFieldMappings={userCustomFieldMappings}
        isUserCustomFieldMappingsPending={isUserCustomFieldMappingsPending}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
        onChangeCustomField={onChangeCustomField}
      />
    </Router>,
    translationsProperties,
  );
};

describe('PatronAgencyForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeCustomField = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
    onChangeCustomField,
  };

  it('should be rendered', () => {
    const { container } = renderCentralPatronTypeForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', async () => {
      renderCentralPatronTypeForm(commonProps);
      document.querySelector('[id="centralServerId"]').click();
      await waitFor(() => expect(document.querySelector('[id="selected-centralServerId-item"]')).toBeDefined());
      screen.getAllByRole('option')[0].click();
      await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
    });
  });

  describe.skip('save button condition', () => {
    it('should be active', () => {
      const { getByRole } = renderCentralPatronTypeForm(commonProps);

      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      document.getElementById('option-configuredOptions[0].agencyCode-0-0-1qwer').click();
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should not be active', () => {
      const { getByRole } = renderCentralPatronTypeForm(commonProps);

      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      document.getElementById('option-customFieldId-0-f72a0b4b-21df-4985-8c9f-0d5c910296c3').click();
      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
