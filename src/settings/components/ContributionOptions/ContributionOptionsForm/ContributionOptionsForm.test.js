import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import { DEFAULT_VALUES } from '../../../routes/ContributionOptionsRoute/ContributionOptionsCreateEditRoute';
import ContributionOptionsForm from './ContributionOptionsForm';
import {
  CENTRAL_SERVER_ID,
  STATUSES_LIST_OPTIONS,
} from '../../../../constants';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  MultiSelection: jest.fn(() => <div>MultiSelection</div>),
}));

const folioLocations = [
  {
    id: 1,
    name: 'testLocation1',
  },
  {
    id: 2,
    name: 'testLocation2',
  }
];

const materialTypes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    name: 'testMaterialType1',
  },
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    name: 'testMaterialType2',
  }
];

const loanTypes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    name: 'testLoanType1',
  },
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    name: 'testLoanType2',
  }
];

const serverOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    label: 'testName2'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const renderContributionOptionsForm = ({
  selectedServer = selectedServerMock,
  isContributionOptionsPending = false,
  isPristine = true,
  isServersPending = false,
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
      <ContributionOptionsForm
        selectedServer={selectedServer}
        isContributionOptionsPending={isContributionOptionsPending}
        isPristine={isPristine}
        isServersPending={isServersPending}
        serverOptions={serverOptions}
        materialTypes={materialTypes}
        loanTypes={loanTypes}
        statusesOptions={STATUSES_LIST_OPTIONS}
        folioLocations={folioLocations}
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

describe('ContributionOptionsForm', () => {
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

  it('should be rendered', () => {
    const { container } = renderContributionOptionsForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Selection', () => {
    it('should call onChangeServer', async () => {
      renderContributionOptionsForm(commonProps);

      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(screen.getByText('testName')).toBeDefined());
      screen.getAllByRole('option')[0].click();
      await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
    });
  });

  it('should call onChangeFormResetState when isReset prop is true', () => {
    renderContributionOptionsForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });
});
