import React from 'react';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import InnReachRecallForm from './InnReachRecallForm';
import { CENTRAL_SERVER_ID } from '../../../../constants';

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'centralServer1',
    value: 'f8723a94-25d5-4f19-9043-cc3c306d54a1'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'centralServer2',
    value: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const parentMutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  innReachRecallUser: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
  users: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const renderInnReachRecallForm = ({
  selectedServer = selectedServerMock,
  initialValues = {},
  innReachRecallUser = {},
  isInnReachRecallUserPending = false,
  parentMutator = parentMutatorMock,
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <InnReachRecallForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        initialValues={initialValues}
        innReachRecallUser={innReachRecallUser}
        isInnReachRecallUserPending={isInnReachRecallUserPending}
        parentMutator={parentMutator}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('InnReachRecallForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderInnReachRecallForm(commonProps);

    expect(container).toBeVisible();
  });

  it('should cause onChangeServer callback', async () => {
    renderInnReachRecallForm(commonProps);
    document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
    await waitFor(() => expect(screen.getByText('centralServer1')).toBeDefined());
    screen.getAllByRole('option')[0].click();

    await waitFor(() => expect(onChangeServer).toHaveBeenCalled());
  });

  it('should retrieve a user data', async () => {
    renderInnReachRecallForm(commonProps);
    document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
    await waitFor(() => expect(screen.getByText('centralServer1')).toBeDefined());
    screen.getAllByRole('option')[0].click();
    const field = screen.getByRole('textbox', { name: 'Recall INN-Reach items as user' });

    await userEvent.type(field, 'e2f5ebb7-9285-58f8-bc1e-608ac2080861');
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  describe('button conditions', () => {
    it('should be enabled', async () => {
      renderInnReachRecallForm(commonProps);

      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(screen.getByText('centralServer1')).toBeDefined());
      screen.getAllByRole('option')[0].click();
      const field = screen.getByRole('textbox', { name: 'Recall INN-Reach items as user' });

      await userEvent.type(field, 'e2f5ebb7-9285-58f8-bc1e-608ac2080861');

      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be disabled', async () => {
      renderInnReachRecallForm({
        ...commonProps,
        initialValues: {
          userId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
        },
      });

      document.querySelector(`[id=${CENTRAL_SERVER_ID}]`).click();
      await waitFor(() => expect(screen.getByText('centralServer1')).toBeDefined());
      screen.getAllByRole('option')[0].click();

      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
