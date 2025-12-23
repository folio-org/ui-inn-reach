import React from 'react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';
import AddAndDeleteButtons from './AddAndDeleteButtons';

const fields = {
  push: jest.fn(),
  remove: jest.fn(),
};

const srsRef = {
  current: {
    sendMessage: jest.fn(),
  },
};

const newRowTemplate = {
  customFieldValue: '',
  agencyCode: undefined,
};

const renderAddAndDeleteButtons = ({
  index = 1,
  addRowAfterCurrent,
} = {}) => {
  return renderWithIntl(
    <AddAndDeleteButtons
      fields={fields}
      index={index}
      srsRef={srsRef}
      newRowTemplate={newRowTemplate}
      addRowAfterCurrent={addRowAfterCurrent}
    />,
    translationsProperties,
  );
};

describe('AddAndDeleteButtons', () => {
  it('should be rendered', () => {
    const { container } = renderAddAndDeleteButtons();

    expect(container).toBeVisible();
  });

  describe('clicking on add', () => {
    it('should add a new row at the end of the table', async () => {
      const { getAllByTestId } = renderAddAndDeleteButtons();

      await userEvent.click(getAllByTestId('addButton')[0]);
      expect(fields.push).toHaveBeenCalled();
    });

    it('should add a new row after current', async () => {
      const addRowAfterCurrent = jest.fn();
      const index = 1;
      const { getAllByTestId } = renderAddAndDeleteButtons({ index, addRowAfterCurrent });

      await userEvent.click(getAllByTestId('addButton')[0]);
      expect(addRowAfterCurrent).toHaveBeenCalledWith(index, newRowTemplate);
    });

    it('should ship a message about the adding to a screen reader', async () => {
      const { getAllByTestId } = renderAddAndDeleteButtons();

      await userEvent.click(getAllByTestId('addButton')[0]);
      expect(srsRef.current.sendMessage).toHaveBeenCalled();
    });
  });

  describe('clicking on delete', () => {
    it('should delete a row', async () => {
      const { getAllByTestId } = renderAddAndDeleteButtons();

      await userEvent.click(getAllByTestId('deleteButton')[0]);
      expect(fields.remove).toHaveBeenCalled();
    });

    it('should ship a message about the deletion to a screen reader', async () => {
      const { getAllByTestId } = renderAddAndDeleteButtons();

      await userEvent.click(getAllByTestId('deleteButton')[0]);
      expect(srsRef.current.sendMessage).toHaveBeenCalled();
    });
  });
});
