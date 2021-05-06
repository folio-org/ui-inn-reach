import React from 'react';
import { Form } from 'react-final-form';

export const renderWithFinalForm = component => {
  const onSubmit = jest.fn();

  return (
    <Form
      render={component}
      onSubmit={onSubmit}
    />
  );
};
