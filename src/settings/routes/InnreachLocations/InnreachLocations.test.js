import React from 'react';

import { useStripes } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import InnreachLocations from './InnreachLocations';
import { translationsProperties, renderWithIntl } from '../../../../test/jest/helpers';

const renderInnreachLocations = ({ stripes }) => renderWithIntl(
  <InnreachLocations
    stripes={stripes}
  />,
  translationsProperties,
);

describe('Given InnreachLocations', () => {
  let stripes;

  beforeEach(() => {
    ControlledVocab.mockClear();

    stripes = useStripes();
  });

  it('should render ConnectedControlledVocab component', () => {
    renderInnreachLocations({ stripes });

    expect(ControlledVocab).toHaveBeenCalled();
  });

  it('should render label', () => {
    const { getByText } = renderInnreachLocations({ stripes });

    expect(getByText('INN-Reach locations')).toBeDefined();
  });
});
