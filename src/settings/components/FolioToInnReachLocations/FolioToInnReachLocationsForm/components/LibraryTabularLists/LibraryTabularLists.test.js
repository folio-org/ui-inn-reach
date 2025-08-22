import { useState } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';

import {
  translationsProperties,
  renderWithIntl,
} from '../../../../../../../test/jest/helpers';
import LibraryTabularLists from './LibraryTabularLists';

const localAgencies = [
  {
    'id': '6238fdcc-702f-4554-a438-001f9fbdf78c',
    'code': 'fl1g1',
    'folioLibraryIds': [
      '5d78803e-ca04-4b4a-aeae-2c63b924518b',
    ]
  },
  {
    'id': '83152a39-08f8-4d75-9c3a-ab4c789520df',
    'code': 'fl1g2',
    'folioLibraryIds': [
      'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    ]
  }
];

const innReachLocationOptions = [
  {
    id: '',
    label: 'Select location',
    value: '',
  },
  {
    label: 'INN-Reach location 1',
    value: 'location-id-1',
  },
  {
    label: 'INN-Reach location 2',
    value: 'location-id-2',
  },
  {
    label: 'INN-Reach location 3',
    value: 'location-id-3',
  },
];

const renderLibraryTabularLists = ({
  initialValues,
  pickedLocationsByAgencyCode: initialPickedLocationsByAgencyCode,
  ...props
} = {}) => {
  const Component = () => {
    const [pickedLocationsByAgencyCode, setPickedLocationsByAgencyCode] = useState(initialPickedLocationsByAgencyCode || {});

    return (
      <LibraryTabularLists
        localAgencies={localAgencies}
        pickedLocationsByAgencyCode={pickedLocationsByAgencyCode}
        innReachLocationOptions={innReachLocationOptions}
        formatMessage={({ id }) => id}
        onSetPickedLocations={setPickedLocationsByAgencyCode}
        {...props}
      />
    );
  };

  return renderWithIntl(
    <Form
      mutators={arrayMutators}
      initialValues={{
        librariesTabularList0: [
          {
            folioLibrary: 'FOLIO Library 1',
            innReachLocations: '',
          },
        ],
        librariesTabularList1: [
          {
            folioLibrary: 'FOLIO Library 2',
            innReachLocations: '',
          },
        ],
        ...initialValues,
      }}
      render={Component}
      onSubmit={() => {}}
    />,
    translationsProperties,
  );
};

describe('LibraryTabularLists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when locations was not mapped to any agency', () => {
    describe('and user selects an INN-Reach location', () => {
      it('should not crash the page', () => {
        const { container, getByTestId } = renderLibraryTabularLists({
          pickedLocationsByAgencyCode: {},
        });

        const agency1Section = within(getByTestId('section-fl1g1'));

        userEvent.click(agency1Section.getByRole('button', { name: 'Select location' }));
        userEvent.click(agency1Section.getByRole('option', { name: 'INN-Reach location 2' }));

        expect(container).toBeDefined();
      });
    });

    describe('and a location is selected in one agency', () => {
      it('should not be present in the options for other agencies', () => {
        const { getByTestId } = renderLibraryTabularLists({
          pickedLocationsByAgencyCode: {},
        });

        const agency1Section = within(getByTestId('section-fl1g1'));
        const agency2Section = within(getByTestId('section-fl1g2'));

        userEvent.click(agency1Section.getByRole('button', { name: 'Select location' }));
        expect(agency1Section.getByRole('option', { name: 'INN-Reach location 1' })).toBeVisible();
        expect(agency1Section.getByRole('option', { name: 'INN-Reach location 2' })).toBeVisible();
        expect(agency1Section.getByRole('option', { name: 'INN-Reach location 3' })).toBeVisible();

        userEvent.click(agency2Section.getByRole('button', { name: 'Select location' }));
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 1' })).toBeVisible();
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 2' })).toBeVisible();
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 3' })).toBeVisible();

        userEvent.click(agency1Section.getByRole('button', { name: 'Select location' }));
        userEvent.click(agency1Section.getByRole('option', { name: 'INN-Reach location 2' }));

        userEvent.click(agency2Section.getByRole('button', { name: 'Select location' }));

        expect(agency2Section.queryByRole('option', { name: 'INN-Reach location 2' })).not.toBeInTheDocument();
      });
    });
  });

  describe('when a location has been mapped to one agency', () => {
    it('should not be present in the options for other agencies', () => {
      const pickedLocationsByAgencyCode = {
        fl1g2: [
          'location-id-1',
        ],
        fl1g1: [
          'location-id-3',
          'location-id-2',
        ],
      };

      const initialValues = {
        librariesTabularList0: [
          {
            folioLibrary: 'FOLIO Library 1',
            innReachLocations: 'location-id-3',
          }
        ],
        librariesTabularList1: [
          {
            folioLibrary: 'FOLIO Library 2',
            innReachLocations: 'location-id-1',
          }
        ],
      };

      const { getByTestId } = renderLibraryTabularLists({
        pickedLocationsByAgencyCode,
        initialValues,
      });

      const agency1Section = within(getByTestId('section-fl1g1'));
      const agency2Section = within(getByTestId('section-fl1g2'));

      userEvent.click(agency1Section.getByRole('button', { name: 'INN-Reach location 3' }));
      expect(agency1Section.queryByRole('option', { name: 'INN-Reach location 1' })).not.toBeInTheDocument();
      expect(agency1Section.getByRole('option', { name: 'INN-Reach location 2' })).toBeVisible();
      expect(agency1Section.getByRole('option', { name: 'INN-Reach location 3' })).toBeVisible();

      userEvent.click(agency2Section.getByRole('button', { name: 'INN-Reach location 1' }));
      expect(agency2Section.getByRole('option', { name: 'INN-Reach location 1' })).toBeVisible();
      expect(agency2Section.queryByRole('option', { name: 'INN-Reach location 2' })).not.toBeInTheDocument();
      expect(agency2Section.queryByRole('option', { name: 'INN-Reach location 3' })).not.toBeInTheDocument();
    });

    describe('and a location is selected in one agency', () => {
      it('should not be present in the options for other agencies', () => {
        const pickedLocationsByAgencyCode = {
          fl1g2: [
            'location-id-1',
          ],
          fl1g1: [
            'location-id-3',
          ],
        };

        const initialValues = {
          librariesTabularList0: [
            {
              folioLibrary: 'FOLIO Library 1',
              innReachLocations: 'location-id-3',
            }
          ],
          librariesTabularList1: [
            {
              folioLibrary: 'FOLIO Library 2',
              innReachLocations: 'location-id-1',
            }
          ],
        };

        const { getByTestId } = renderLibraryTabularLists({
          pickedLocationsByAgencyCode,
          initialValues,
        });

        const agency1Section = within(getByTestId('section-fl1g1'));
        const agency2Section = within(getByTestId('section-fl1g2'));

        userEvent.click(agency1Section.getByRole('button', { name: 'INN-Reach location 3' }));
        expect(agency1Section.queryByRole('option', { name: 'INN-Reach location 1' })).not.toBeInTheDocument();
        expect(agency1Section.getByRole('option', { name: 'INN-Reach location 2' })).toBeVisible();
        expect(agency1Section.getByRole('option', { name: 'INN-Reach location 3' })).toBeVisible();

        userEvent.click(agency2Section.getByRole('button', { name: 'INN-Reach location 1' }));
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 1' })).toBeVisible();
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 2' })).toBeVisible();
        expect(agency2Section.queryByRole('option', { name: 'INN-Reach location 3' })).not.toBeInTheDocument();

        userEvent.click(agency1Section.getByRole('button', { name: 'INN-Reach location 3' }));
        userEvent.click(agency1Section.getByRole('option', { name: 'INN-Reach location 2' }));

        userEvent.click(agency2Section.getByRole('button', { name: 'INN-Reach location 1' }));

        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 1' })).toBeVisible();
        expect(agency2Section.queryByRole('option', { name: 'INN-Reach location 2' })).not.toBeInTheDocument();
        expect(agency2Section.getByRole('option', { name: 'INN-Reach location 3' })).toBeVisible();
      });
    });
  });
});
