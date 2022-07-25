import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: jest.fn(() => (
    ({ children }) => (
      <span>
        Icon
        <span>
          {children}
        </span>
      </span>
    )
  )),
}));
