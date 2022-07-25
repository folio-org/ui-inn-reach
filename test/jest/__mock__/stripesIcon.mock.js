import React from 'react';

jest.mock('@folio/stripes/components/Icon', () => {
  return ({ children }) => (
    <span>
      Icon
      <span>
        {children}
      </span>
    </span>
  );
});
