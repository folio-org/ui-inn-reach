import React, {
  useEffect,
  useMemo,
} from 'react';
import stripesFinalForm from '@folio/stripes/final-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Loading,
  Pane,
  PaneFooter,
  Select,
  Selection,
} from '@folio/stripes/components';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
  CENTRAL_SERVER_ID,
  DEFAULT_PANE_WIDTH,
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  LOCAL_AGENCIES_FIELDS,
} from '../../../../constants';
import {
  getInnReachLocationOptions,
  getUniqueLocations,
} from './utils';
import {
  TableStyleList,
} from '../../common';
import LibraryTabularLists from './components/LibraryTabularLists';

const {
  MAPPING_TYPE,
  LIBRARY,
  INN_REACH_LOCATIONS,
  FOLIO_LOCATION,
  LOCATIONS_TABULAR_LIST,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

const {
  CODE,
} = LOCAL_AGENCIES_FIELDS;

const {
  LOCAL_AGENCIES,
} = CENTRAL_SERVER_CONFIGURATION_FIELDS;

const FolioToInnReachLocationsForm = ({
  selectedServer,
  selectedLibraryId,
  mappingType,
  innReachLocations,
  serverOptions,
  pickedLocationsByAgencyCode,
  serverLibraryOptions,
  mappingTypesOptions,
  formatMessage,
  librariesMappingType,
  locationsMappingType,
  isMappingsPending,
  isShowTabularList,
  isResetForm,
  handleSubmit,
  pristine,
  invalid,
  form,
  onChangeFormResetState,
  onChangeServer,
  onChangeMappingType,
  onChangeLibrary,
  onSetPickedLocations,
}) => {
  const innReachLocationOptions = useMemo(() => getInnReachLocationOptions(innReachLocations), [innReachLocations]);

  const handleMappingTypeChange = (event) => {
    onChangeMappingType(event.target.value);
  };

  useEffect(() => {
    if (isResetForm) {
      form.reset();
      onChangeFormResetState(false);
    }
  }, [isResetForm]);

  const getFooter = () => {
    const saveButton = (
      <Button
        marginBottom0
        data-testid="save-button"
        id="clickable-save-instance"
        buttonStyle="primary mega"
        type="submit"
        disabled={pristine || invalid}
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inn-reach.settings.contribution-criteria.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={saveButton} />;
  };

  const getLibraryTabularLists = () => {
    return (
      <LibraryTabularLists
        localAgencies={selectedServer[LOCAL_AGENCIES]}
        pickedLocationsByAgencyCode={pickedLocationsByAgencyCode}
        innReachLocationOptions={innReachLocationOptions}
        formatMessage={formatMessage}
        onSetPickedLocations={onSetPickedLocations}
      />
    );
  };

  const getLocationTabularList = () => {
    const localAgency = selectedServer[LOCAL_AGENCIES].find(({ folioLibraryIds }) => {
      return folioLibraryIds.includes(selectedLibraryId);
    });
    const filteredInnReachLocationOptions = getUniqueLocations({
      innReachLocationOptions,
      pickedLocationsByAgencyCode,
      curLocalAgencyCode: localAgency[CODE],
    });

    return (
      <TableStyleList
        fieldArrayName={LOCATIONS_TABULAR_LIST}
        leftTitle={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.locations" />}
        rightTitle={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations" />}
        leftFieldName={FOLIO_LOCATION}
        rightFieldName={INN_REACH_LOCATIONS}
        dataOptions={filteredInnReachLocationOptions}
        ariaLabel={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.inn-reach-locations" />}
      />
    );
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.folio-to-inn-reach-locations.title' />}
    >
      <form>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        {selectedServer.id &&
          <Select
            id={MAPPING_TYPE}
            label={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.mapping-type" />}
            dataOptions={mappingTypesOptions}
            value={mappingType}
            onChange={handleMappingTypeChange}
          />
        }
        {mappingType === locationsMappingType &&
          <Selection
            id={LIBRARY}
            label={<FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.field.library" />}
            placeholder={formatMessage({ id: 'ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-library' })}
            dataOptions={serverLibraryOptions}
            onChange={onChangeLibrary}
          />
        }
        {isMappingsPending && <Loading />}
        {isShowTabularList && (
          mappingType === librariesMappingType
            ? getLibraryTabularLists()
            : getLocationTabularList()
        )}
      </form>
    </Pane>
  );
};

FolioToInnReachLocationsForm.propTypes = {
  form: PropTypes.object.isRequired,
  formatMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  innReachLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  invalid: PropTypes.bool.isRequired,
  isMappingsPending: PropTypes.bool.isRequired,
  isResetForm: PropTypes.bool.isRequired,
  isShowTabularList: PropTypes.bool.isRequired,
  librariesMappingType: PropTypes.string.isRequired,
  locationsMappingType: PropTypes.string.isRequired,
  mappingType: PropTypes.string.isRequired,
  mappingTypesOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pristine: PropTypes.bool.isRequired,
  selectedLibraryId: PropTypes.string.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverLibraryOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeFormResetState: PropTypes.func.isRequired,
  onChangeLibrary: PropTypes.func.isRequired,
  onChangeMappingType: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onSetPickedLocations: PropTypes.func.isRequired,
  pickedLocationsByAgencyCode: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    pristine: true,
    invalid: true,
  },
})(FolioToInnReachLocationsForm);
