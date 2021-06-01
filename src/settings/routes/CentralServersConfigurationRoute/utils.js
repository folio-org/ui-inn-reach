import {
  isEmpty,
} from 'lodash';
import {
  LOCAL_AGENCIES_FIELDS,
} from '../../../constants';

export const getConvertedLocalAgenciesToCreateEdit = (localAgencies = []) => {
  return localAgencies.reduce((accum, { localAgency, FOLIOLibraries }) => {
    if (localAgency && !isEmpty(FOLIOLibraries)) {
      accum.push({
        [LOCAL_AGENCIES_FIELDS.CODE]: localAgency,
        [LOCAL_AGENCIES_FIELDS.FOLIO_LIBRARY_IDs]: FOLIOLibraries.map(library => library.value),
      });
    }

    return accum;
  }, []);
};

export const getConvertedLocalAgencies = (localAgencies, folioLibraries) => {
  const folioLibrariesMap = new Map();

  folioLibraries.forEach(library => {
    folioLibrariesMap.set(library.id, library);
  });

  return localAgencies.map(({ id, code, folioLibraryIds }) => {
    const FOLIOLibraries = folioLibraryIds.map(libraryId => ({
      id: libraryId,
      label: folioLibrariesMap.get(libraryId)?.name,
      value: libraryId,
    }));

    return {
      id,
      localAgency: code,
      FOLIOLibraries,
    };
  });
};