import { createMemoryHistory } from 'history';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../../../test/jest/helpers';
import ItemForm from './ItemForm';

const history = createMemoryHistory();

const renderItemForm = ({
  isLoading = false,
  pristine,
  intl = { formatMessage: jest.fn() },
  formRef = {},
  handleSubmit = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ItemForm
        isLoading={isLoading}
        pristine={pristine}
        intl={intl}
        formRef={formRef}
        barcodeRef={{ current: null }}
        onSubmit={handleSubmit}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ItemForm', () => {
  const handleSubmit = jest.fn();

  it('should be rendered', () => {
    const { container } = renderItemForm();

    expect(container).toBeVisible();
  });

  describe('"Enter" button', () => {
    it('should submit request', async () => {
      renderItemForm({ handleSubmit });
      await userEvent.type(screen.getByRole('textbox'), '123');
      await userEvent.click(screen.getByRole('button', { name: 'Enter' }));
      expect(handleSubmit).toBeCalled();
    });

    it('should be enabled', async () => {
      renderItemForm();
      await userEvent.type(screen.getByRole('textbox'), '123123');
      expect(screen.getByRole('button', { name: 'Enter' })).toBeEnabled();
    });

    it('should be disabled', () => {
      renderItemForm();
      expect(screen.getByRole('button', { name: 'Enter' })).toBeDisabled();
    });
  });
});
