import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import ActionItemPrint from './ActionItemPrint';

import { translationsProperties } from '../../../../../../test/jest/helpers';

const templatesContextMock = [
  {
    test: 'test',
  },
];

const RenderActionItemPrint = ({
  templates = {},
  templatesContext = [],
  onClickHandler,
  onToggle,
}) => {
  return (
    <ActionItemPrint
      icon='test icon'
      buttonLabel='test'
      templates={templates}
      templatesContext={templatesContext}
      onClickHandler={onClickHandler}
      onToggle={onToggle}
    />
  );
};

describe('ActionItemPrint component', () => {
  const handleToggle = jest.fn();
  const handleClickPrint = jest.fn();

  const renderedActionItemPrint = (
    onClick = handleClickPrint,
    onToggle = handleToggle,
  ) => renderWithIntl(
    <RenderActionItemPrint
      onClickHandler={onClick}
      onToggle={onToggle}
    />,
    translationsProperties,
  );

  it('should be rendered', () => {
    const component = renderedActionItemPrint();

    expect(component).toBeDefined();
  });

  it('should display button', () => {
    renderedActionItemPrint();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
