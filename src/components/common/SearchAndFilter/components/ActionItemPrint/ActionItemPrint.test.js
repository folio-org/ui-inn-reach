import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import {
  FormattedMessage,
} from 'react-intl';

import ActionItemPrint from './ActionItemPrint';

import { translationsProperties, renderWithIntl } from '../../../../../../test/jest/helpers';

const RenderActionItemPrint = ({
  templates = {},
  templatesContext = [],
  onToggle,
}) => {
  return (
    <ActionItemPrint
      icon='test icon'
      buttonLabel={
        <FormattedMessage
          id="ui-inn-reach.printSlips.label"
          values={{ servicePoint: 'test' }}
        />
      }
      templates={templates}
      templatesContext={templatesContext}
      onToggle={onToggle}
    />
  );
};

describe('ActionItemPrint component', () => {
  const handleToggle = jest.fn();

  const renderedActionItemPrint = (
    onToggle = handleToggle,
  ) => renderWithIntl(
    <RenderActionItemPrint
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

  it('should invoke onToggle callback', () => {
    renderedActionItemPrint();
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleToggle).toBeCalled();
  });
});
