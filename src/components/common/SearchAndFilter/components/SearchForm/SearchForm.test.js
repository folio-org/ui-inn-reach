import {
  SearchField,
} from '@folio/stripes/components';
import { translationsProperties, renderWithIntl } from '../../../../../../test/jest/helpers';
import SearchForm from './SearchForm';

jest.mock('@folio/stripes/components', () => {
  return {
    ...jest.requireActual('@folio/stripes/components'),
    SearchField: jest.fn(() => 'SearchField'),
  };
});

const renderSearchForm = ({
  applySearch = jest.fn(),
  changeSearch = jest.fn(),
} = {}) => (renderWithIntl(
  <SearchForm
    applySearch={applySearch}
    changeSearch={changeSearch}
  />,
  translationsProperties
));

describe('SearchForm', () => {
  it('should apply search when form is submitted', () => {
    const applySearch = jest.fn();
    const { getByTestId } = renderSearchForm({ applySearch });

    getByTestId('search-form').submit();

    expect(applySearch).toHaveBeenCalled();
  });

  describe('Search field', () => {
    beforeEach(() => {
      SearchField.mockClear();
    });

    it('should be displaed', () => {
      const { getByText } = renderSearchForm();

      expect(getByText('SearchField')).toBeDefined();
    });

    it('should change search to empty when field is cleared', () => {
      const changeSearch = jest.fn();

      renderSearchForm({ changeSearch });

      SearchField.mock.calls[0][0].onClear();

      expect(changeSearch.mock.calls[0][0].target.value).toBe('');
    });

    it('should change search to empty when field is changed', () => {
      const changeSearch = jest.fn();

      renderSearchForm({ changeSearch });

      SearchField.mock.calls[0][0].onChange();

      expect(changeSearch).toHaveBeenCalled();
    });
  });
});
