import {
  some,
} from 'lodash';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  NO_VALUE_LOCATION_OPTION,
} from '../../../../constants';
import {
  required,
} from '../../../../utils';

const {
  INN_REACH_LOCATIONS,
  LIBRARIES_TABULAR_LIST,
  LOCATIONS_TABULAR_LIST,
  FOLIO_LIBRARY,
  FOLIO_LOCATION,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

export const getInnReachLocationOptions = (innReachLocations) => {
  return innReachLocations.reduce((accum, { id, code }) => {
    const option = {
      id,
      value: code,
      label: code,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCATION_OPTION]);
};

export const validate = (value, allValues, index) => {
  const tabularList = allValues[LOCATIONS_TABULAR_LIST] || allValues[`${LIBRARIES_TABULAR_LIST}${index}`];
  const leftColName = tabularList[0][FOLIO_LIBRARY]
    ? FOLIO_LIBRARY
    : FOLIO_LOCATION;

  if (leftColName === FOLIO_LIBRARY) {
    return required(value);
  } else {
    const isSomeFieldFilledIn = tabularList.some(row => row[INN_REACH_LOCATIONS]);

    return required(value || isSomeFieldFilledIn);
  }
};

export const getFilteredInnReachLocationOptions = (innReachLocationOptions, values, index) => {
  return innReachLocationOptions.filter(location => {
    return !some(values, (tabularList, key) => {
      return tabularList.some(listItem => {
        return listItem[INN_REACH_LOCATIONS] === location.value && key !== `${LIBRARIES_TABULAR_LIST}${index}`;
      });
    });
  });
};
