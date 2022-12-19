import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  AGENCY_TO_FOLIO_LOCATIONS_FIELDS,
  NO_VALUE_OPTION_VALUE,
} from '../../../constants';

const {
  ID,
  AGENCY,
  AGENCY_CODE_MAPPINGS,
  LIBRARY_ID,
  LOCATION_ID,
  LOCAL_CODE,
  LOCAL_SERVER_LIBRARY_ID,
  LOCAL_SERVER_LOCATION_ID,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const getCampusMap = (campuses) => {
  const campusMap = new Map();

  campuses.forEach(({ id, code, institutionId }) => {
    campusMap.set(id, {
      code,
      institutionId,
    });
  });

  return campusMap;
};

const getInstitutionMap = (institutions) => {
  const institutionMap = new Map();

  institutions.forEach(({ id, code }) => {
    institutionMap.set(id, code);
  });

  return institutionMap;
};

export const getFolioLibraryOptions = (libraries, campuses, institutions) => {
  const libOptions = [];
  const campusMap = getCampusMap(campuses);
  const institutionMap = getInstitutionMap(institutions);
  const noValueOption = {
    label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library" />,
    value: NO_VALUE_OPTION_VALUE,
  };

  libraries.forEach(({ id, code, campusId }) => {
    const option = {
      id,
      label: `${institutionMap.get(campusMap.get(campusId).institutionId)} > ${campusMap.get(campusId).code} > ${code}`,
      value: id,
    };

    if (!libOptions.length) {
      libOptions.push(noValueOption);
    }

    libOptions.push(option);
  });

  return libOptions;
};

export const getFolioLocationsMap = (folioLocations) => {
  return folioLocations.reduce((accum, { id, name, code, libraryId }) => {
    const locData = { id, name, code };

    if (accum.has(libraryId)) {
      accum.get(libraryId).push(locData);
    } else {
      accum.set(libraryId, [locData]);
    }

    return accum;
  }, new Map());
};

const getAgencyCodeMappingsMap = (agencyCodeMappings) => {
  const agencyCodeMappingsMap = new Map();

  agencyCodeMappings.forEach(({ id, agencyCode, libraryId, locationId }) => {
    const fieldset = {};

    if (id) fieldset[ID] = id;
    if (libraryId) fieldset[LIBRARY_ID] = libraryId;
    if (locationId) fieldset[LOCATION_ID] = locationId;

    agencyCodeMappingsMap.set(agencyCode, fieldset);
  });

  return agencyCodeMappingsMap;
};

export const getAgencyCodeMappings = (agencyCodeMappings, localServerList, localServerCode) => {
  const { agencyList } = localServerList.find(({ localCode }) => localCode === localServerCode);
  const agencyCodeMappingsMap = getAgencyCodeMappingsMap(agencyCodeMappings);

  return agencyList.map(({ agencyCode, description }) => {
    let option = {
      [AGENCY]: `${agencyCode} (${description})`,
    };

    if (agencyCodeMappingsMap.has(agencyCode)) {
      option = {
        ...option,
        ...agencyCodeMappingsMap.get(agencyCode),
      };
    }

    return option;
  });
};

export const getLeftColumn = (localServerList, selectedLocalCode) => {
  const { agencyList } = localServerList.find(localServer => localServer.localCode === selectedLocalCode);

  return agencyList.map(({ agencyCode, description }) => ({
    [AGENCY]: `${agencyCode} (${description})`,
  }));
};

export const getLocalInitialValues = (localServerList, agencyMappings, locServerData) => {
  const {
    localCode,
    libraryId,
    locationId,
    agencyCodeMappings,
  } = locServerData;

  const formattedAgencyCodeMappings = agencyCodeMappings
    ? getAgencyCodeMappings(agencyCodeMappings, localServerList, localCode)
    : getLeftColumn(localServerList, localCode);

  const localInitialValues = {
    localCode,
    [AGENCY_CODE_MAPPINGS]: formattedAgencyCodeMappings,
  };

  if (libraryId) {
    localInitialValues[LOCAL_SERVER_LIBRARY_ID] = libraryId;
  }
  if (locationId) {
    localInitialValues[LOCAL_SERVER_LOCATION_ID] = locationId;
  }

  return localInitialValues;
};

export const getLocalServerData = (agencyMappings, selectedLocalCode) => {
  return agencyMappings?.localServers?.find(({ localCode }) => localCode === selectedLocalCode);
};

const getFormattedAgencyCodeMappings = (agencyCodeMappings) => {
  return agencyCodeMappings.map(({ id, agency, libraryId, locationId }) => {
    const rowData = {
      agencyCode: agency.slice(0, 5),
    };

    if (id) rowData.id = id;
    if (libraryId) rowData[LIBRARY_ID] = libraryId;
    if (locationId) rowData[LOCATION_ID] = locationId;

    return rowData;
  });
};

const getFormattedLocalServerData = (record) => {
  const {
    localCode,
    localServerLibraryId,
    localServerLocationId,
    agencyCodeMappings,
  } = record;
  const formattedLocalServerData = { localCode };

  if (localServerLibraryId) {
    formattedLocalServerData[LIBRARY_ID] = localServerLibraryId;
  }
  if (localServerLocationId) {
    formattedLocalServerData[LOCATION_ID] = localServerLocationId;
  }

  formattedLocalServerData[AGENCY_CODE_MAPPINGS] = getFormattedAgencyCodeMappings(agencyCodeMappings);

  return formattedLocalServerData;
};

export const getLocalServers = (record, agencyMappings) => {
  const dataOfLocalServers = [];
  let isNewLocalServerDataCreated = true;

  if (agencyMappings.localServers) {
    agencyMappings.localServers.forEach(localServerData => {
      if (localServerData.localCode === record[LOCAL_CODE]) {
        dataOfLocalServers.push(getFormattedLocalServerData(record));
        isNewLocalServerDataCreated = false;
      } else {
        dataOfLocalServers.push(localServerData);
      }
    });
  }

  if (isNewLocalServerDataCreated) {
    dataOfLocalServers.push(getFormattedLocalServerData(record));
  }

  return dataOfLocalServers;
};
