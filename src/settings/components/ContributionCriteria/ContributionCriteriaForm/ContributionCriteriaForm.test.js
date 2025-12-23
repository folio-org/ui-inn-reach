import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { MultiSelection } from '@folio/stripes/components';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import { DEFAULT_VALUES } from '../../../routes/ContributionCriteriaRoute/utils';
import ContributionCriteriaForm from './ContributionCriteriaForm';
import { CENTRAL_SERVER_ID } from '../../../../constants';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  MultiSelection: jest.fn(() => <div>MultiSelection</div>),
}));

const folioLocations = [
  {
    id: 1,
    name: 'Annex',
    libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
  },
  {
    id: 2,
    name: 'Online',
    libraryId: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
  }
];

const statisticalCodes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    statisticalCodeTypeId: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
    code: 'testCode',
    name: 'testCodeName',
  }
];

const statisticalCodeTypes = [
  {
    name: 'typeName',
    id: '882a737a-27ce-4f0c-90fc-36b92c6046bf',
  }
];

const serverOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    localAgencies: [
      {
        folioLibraryIds: ['5d78803e-ca04-4b4a-aeae-2c63b924518b'],
      },
    ],
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    localAgencies: [
      {
        folioLibraryIds: ['c2549bb4-19c7-4fcc-8b52-39e612fb7dbe'],
      },
    ],
    label: 'testName2'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const renderContributionCriteriaForm = ({
  selectedServer = selectedServerMock,
  contributionCriteria = {},
  isContributionCriteriaPending = false,
  isPristine = true,
  initialValues = DEFAULT_VALUES,
  isResetForm = false,
  onChangeFormResetState,
  onChangePristineState,
  history = createMemoryHistory(),
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ContributionCriteriaForm
        selectedServer={selectedServer}
        contributionCriteria={contributionCriteria}
        isContributionCriteriaPending={isContributionCriteriaPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        folioLocations={folioLocations}
        statisticalCodes={statisticalCodes}
        statisticalCodeTypes={statisticalCodeTypes}
        initialValues={initialValues}
        isResetForm={isResetForm}
        onChangeFormResetState={onChangeFormResetState}
        onChangePristineState={onChangePristineState}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ContributionCriteriaForm', () => {
  const onChangeFormResetState = jest.fn();
  const onChangePristineState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    onChangePristineState,
    handleSubmit,
    onChangeServer,
  };

  beforeEach(() => {
    MultiSelection.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderContributionCriteriaForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Selection', () => {
    it('should call onChangeServer', async () => {
      renderContributionCriteriaForm(commonProps);

      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(document.querySelector('[id="selected-centralServerId-item"]')).toBeDefined());
      screen.getAllByRole('option')[0].click();
      await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
    });
  });

  it('should call onChangeFormResetState when isReset prop is true', () => {
    renderContributionCriteriaForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });

  it('should only have locations of the selected central server', () => {
    renderContributionCriteriaForm({
      ...commonProps,
      selectedServer: serverOptions[0],
    });
    expect(MultiSelection.mock.calls[0][0].dataOptions.length).toBe(1);
    expect(MultiSelection.mock.calls[0][0].dataOptions[0].label).toBe('Annex');
  });

  describe('`FOLIO statistical code to exclude from contribution` field', () => {
    describe('select', () => {
      beforeEach(() => {
        renderContributionCriteriaForm(commonProps);
      });

      it('should have disabled a selected option', async () => {
        const selectedOption = document.querySelector('option[value="7a82f404-07df-4e5e-8e8f-a15f3b6ddffa"]');

        expect(selectedOption).toBeEnabled();
        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'FOLIO statistical code to exclude from contribution' }), '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa');
        expect(selectedOption).toBeDisabled();
      });

      it('should change the value of isPristine when selected', async () => {
        expect(onChangePristineState).toHaveBeenCalledWith(true);
        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'FOLIO statistical code to exclude from contribution' }), '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa');
        expect(onChangePristineState).toHaveBeenCalledWith(false);
      });
    });
  });
});
