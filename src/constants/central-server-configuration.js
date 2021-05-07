import {
  SETTINGS_PATH,
} from './base';

export const CENTRAL_SERVER_CONFIGURATIONS_ROUTE = 'central-server-configurations';

export const CENTRAL_SERVER_CONFIGURATIONS_PATH = `/${SETTINGS_PATH}/${CENTRAL_SERVER_CONFIGURATIONS_ROUTE}`;

export const LOCAL_AGENCIES_FIELDS = {
  ID: 'id',
  CODE: 'code',
  FOLIO_LIBRARY_ID: 'folioLibraryId',
};

export const CENTRAL_SERVER_CONFIGURATION_FIELDS = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  LOCAL_SERVER_CODE: 'localServerCode',
  CENTRAL_SERVER_ADDRESS: 'centralServerAddress',
  LOAN_TYPE_ID: 'loanTypeId',
  LOCAL_AGENCIES: 'localAgencies',
  CENTRAL_SERVER_KEY: 'centralServerKey',
  CENTRAL_SERVER_SECRET: 'centralServerSecret',
  LOCAL_SERVER_KEY: 'localServerKey',
  LOCAL_SERVER_SECRET: 'localServerSecret',
};