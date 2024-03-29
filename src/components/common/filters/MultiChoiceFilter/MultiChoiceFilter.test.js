import React from 'react';
import { screen } from '@testing-library/react';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import MultiChoiceFilter from './MultiChoiceFilter';
import { translationsProperties, renderWithIntl } from '../../../../../test/jest/helpers';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  MultiSelectionFilter: jest.fn(() => <div>MultiSelectionFilter</div>),
}));

const dataOptionsMock = [
  { label: 'central server1', value: 'central server1' },
  { label: 'central server2', value: 'central server2' },
];

const renderMultiChoiceFilter = ({
  name = 'state',
  labelId = 'ui-inn-reach.transaction.status',
  activeFilters = [],
  dataOptions = dataOptionsMock,
  closedByDefault,
  disabled,
  onChange = jest.fn(),
} = {}) => (renderWithIntl(
  <MultiChoiceFilter
    name={name}
    labelId={labelId}
    activeFilters={activeFilters}
    dataOptions={dataOptions}
    closedByDefault={closedByDefault}
    disabled={disabled}
    onChange={onChange}
  />,
  translationsProperties,
));

describe('MultiChoiceFilter', () => {
  beforeEach(() => {
    MultiSelectionFilter.mockClear();
  });

  it('should display the correct filter name', () => {
    renderMultiChoiceFilter();
    expect(screen.getByText('Transaction status')).toBeVisible();
  });

  it('should call onChange', () => {
    const onChange = jest.fn();

    renderMultiChoiceFilter({ onChange });
    MultiSelectionFilter.mock.calls[0][0].onChange();
    expect(onChange).toHaveBeenCalled();
  });
});
