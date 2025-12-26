import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import BibTransformationOptionsForm from './BibTransformationOptionsForm';
import { DEFAULT_INITIAL_VALUES, CENTRAL_SERVER_ID } from '../../../../constants';

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

const identifierTypes = [
  {
    id: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
    name: 'ASIN',
    source: 'local',
  },
  {
    id: 'e7bb3f98-5229-44dc-9da2-08bcfc67020a',
    name: 'LCCN',
    source: 'local',
  },
];

const renderBibTransformationOptionsForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = DEFAULT_INITIAL_VALUES,
  isMarcTransformationOptionsPending = false,
  isConfigActive = false,
  onChangeServer,
  onChangeConfigState,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <BibTransformationOptionsForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        identifierTypes={identifierTypes}
        formatMessage={({ id }) => id}
        initialValues={initialValues}
        isMarcTransformationOptionsPending={isMarcTransformationOptionsPending}
        isConfigActive={isConfigActive}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
        onChangeConfigState={onChangeConfigState}
      />
    </Router>,
    translationsProperties,
  );
};

describe('BibTransformationOptionsForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeConfigState = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
    onChangeConfigState,
  };

  it('should be rendered', () => {
    const { container } = renderBibTransformationOptionsForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', async () => {
      renderBibTransformationOptionsForm(commonProps);
      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(screen.getByText(selectedServerMock.name)).toBeDefined());
      screen.getAllByRole('option')[0].click();
      await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
    });
  });

  describe('save button condition', () => {
    describe('when the "Modify MARC..." checkbox has checked/unchecked', () => {
      it('should be enabled', () => {
        const { getByRole } = renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: false,
          initialValues: {
            modifiedFieldsForContributedRecords: [
              {
                resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
              },
            ],
          },
        });

        expect(getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled', async () => {
        const { getByRole } = renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: true,
          initialValues: {
            configIsActive: true,
            modifiedFieldsForContributedRecords: [
              {
                resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
              },
            ],
          },
        });

        await userEvent.click(getByRole('checkbox', { name: 'Modify MARC 001 field for contributed records' }));
        await userEvent.click(getByRole('checkbox', { name: 'Modify MARC 001 field for contributed records' }));
        expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });

    describe('when the "Identifier type" field has changes', () => {
      it('should be enabled when at least one "Identifier type" is selected', async () => {
        const { getByRole } = renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: true,
        });

        expect(getByRole('button', { name: 'Save' })).toBeDisabled();
        await userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'd09901a7-1407-42d5-a680-e4d83fe93c5d');
        expect(getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled', async () => {
        const { getByRole } = renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: true,
          initialValues: {
            configIsActive: true,
            modifiedFieldsForContributedRecords: [
              {
                resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
              },
            ],
          },
        });

        await userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'e7bb3f98-5229-44dc-9da2-08bcfc67020a');
        expect(getByRole('button', { name: 'Save' })).toBeEnabled();
        await userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'd09901a7-1407-42d5-a680-e4d83fe93c5d');
        expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });

    describe('when the "Strip prefix" checkbox has checked/unchecked', () => {
      let checkbox;

      beforeEach(async () => {
        renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: true,
          initialValues: {
            modifiedFieldsForContributedRecords: [
              {
                resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
              },
            ],
          },
        });

        checkbox = screen.getByRole('checkbox', { name: 'Strip prefix' });
        await userEvent.click(checkbox);
      });

      it('should be enabled', () => {
        expect(checkbox.checked).toBeTruthy();
      });

      it('should be disabled', async () => {
        await userEvent.click(checkbox);
        expect(checkbox.checked).toBeFalsy();
      });
    });

    describe('when the "Ignore prefixes field" field has changes', () => {
      beforeEach(async () => {
        renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: true,
          initialValues: {
            modifiedFieldsForContributedRecords: [
              {
                resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
                stripPrefix: false,
                ignorePrefixes: '',
              },
            ],
          },
        });

        await userEvent.type(screen.getByRole('textbox', { name: 'Ignore prefixes' }), '1');
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled when adding a value to the "Ignore prefixes field" and then remove it', async () => {
        await userEvent.type(screen.getByRole('textbox', { name: 'Ignore prefixes' }), '{backspace}');
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });

    describe('when the "Strip fields and subfields" field has changes', () => {
      beforeEach(async () => {
        renderBibTransformationOptionsForm({
          ...commonProps,
          isConfigActive: false,
        });

        await userEvent.type(screen.getByRole('textbox', { name: 'Strip fields and subfields' }), '1');
      });

      it('should be enabled', () => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });

      it('should be disabled', async () => {
        await userEvent.type(screen.getByRole('textbox', { name: 'Strip fields and subfields' }), '{backspace}');
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      });
    });
  });
});
