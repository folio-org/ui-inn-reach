import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';

import MaterialTypeForm from './MaterialTypeForm';
import { CENTRAL_SERVER_ID } from '../../../../constants';

const centralItemTypes = [
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 202,
    label: 'test1'
  },
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 211,
    label: 'test2'
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

const renderMappingTypeForm = ({
  selectedServer = selectedServerMock,
  isMaterialTypeMappingsPending = false,
  isPristine = true,
  isPending = false,
  isServersPending = false,
  initialValues = {},
  invalid = false,
  isResetForm = false,
  innReachItemTypesFailed = false,
  onChangeFormResetState,
  onChangePristineState,
  history = createMemoryHistory(),
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <MaterialTypeForm
        selectedServer={selectedServer}
        isMaterialTypeMappingsPending={isMaterialTypeMappingsPending}
        isPending={isPending}
        isPristine={isPristine}
        isServersPending={isServersPending}
        invalid={invalid}
        serverOptions={serverOptions}
        innReachItemTypeOptions={centralItemTypes}
        initialValues={initialValues}
        isResetForm={isResetForm}
        innReachItemTypesFailed={innReachItemTypesFailed}
        onChangeFormResetState={onChangeFormResetState}
        onChangePristineState={onChangePristineState}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('MaterialTypeForm', () => {
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
    const { container } = renderMappingTypeForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Selection', () => {
    it('should call onChangeServer', async () => {
      renderMappingTypeForm(commonProps);

      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(document.querySelector('[id="selected-centralServerId-item"]')).toBeDefined());
      screen.getAllByRole('option')[0].click();
      await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
    });
  });

  it('should call onChangeFormResetState when isReset prop is true', () => {
    renderMappingTypeForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });

  describe('banner', () => {
    it('should be visible', () => {
      renderMappingTypeForm({
        ...commonProps,
        innReachItemTypesFailed: true,
      });
      const banner = document.querySelector('[data-test-message-banner]');

      expect(banner).toBeVisible();
    });

    it('should be invisible', () => {
      renderMappingTypeForm({
        ...commonProps,
        innReachItemTypesFailed: false,
      });
      const banner = document.querySelector('[data-test-message-banner]');

      expect(banner).toBeFalsy();
    });
  });
});
