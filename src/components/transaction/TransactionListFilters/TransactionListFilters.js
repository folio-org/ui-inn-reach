import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  CheckboxFilter,
  MultiChoiceFilter,
} from '../../common';

import {
  CENTRAL_SERVERS_LIMITING,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  TYPE_PARAMETER,
  STATE_PARAMETER,
  CENTRAL_SERVER_CODE_PARAMETER,
  PATRON_AGENCY_CODE_PARAMETER,
  ITEM_AGENCY_CODE_PARAMETER,
  PATRON_TYPE_PARAMETER,
  ITEM_TYPE_PARAMETER,
} from '../../../constants';
import {
  applyFiltersAdapter,
  getCentralServerOptions,
  getCheckboxFilterOptions,
} from '../../../utils';
import {
  getTransactionStatusOptions,
  getCentralServerAgencyOptions,
  getCentralServerPatronTypeOptions,
  getCentralServerItemTypeOptions,
} from './utils';

const TransactionListFilters = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
    },
    centralServerAgencies: {
      records: agencies,
    },
    centralServerPatronTypes: {
      records: patronTypes,
    },
    centralServerItemTypes: {
      records: itemTypes,
    },
  },
  activeFilters,
  applyFilters,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const centralServerAgencies = agencies[0]?.centralServerAgencies || [];
  const centralServerPatronTypes = patronTypes[0]?.centralServerPatronTypes || [];
  const centralServerItemTypes = itemTypes[0]?.centralServerItemTypes || [];

  const getTransactionTypeDataOptions = useMemo(() => getCheckboxFilterOptions(TYPE_PARAMETER, Object.values(TRANSACTION_TYPES)), []);
  const transactionStatusOptions = useMemo(() => getTransactionStatusOptions(Object.values(TRANSACTION_STATUSES)), []);
  const centralServerOptions = useMemo(() => getCentralServerOptions(servers), [servers]);
  const centralServerAgencyOptions = useMemo(() => getCentralServerAgencyOptions(centralServerAgencies), [centralServerAgencies]);
  const centralServerPatronTypeOptions = useMemo(() => getCentralServerPatronTypeOptions(centralServerPatronTypes), [centralServerPatronTypes]);
  const centralServerItemTypeOptions = useMemo(() => getCentralServerItemTypeOptions(centralServerItemTypes), [centralServerItemTypes]);

  const adaptedApplyFilters = useCallback(applyFiltersAdapter(applyFilters), [applyFilters]);

  return (
    <AccordionSet>
      <CheckboxFilter
        activeFilters={activeFilters[TYPE_PARAMETER]}
        id={TYPE_PARAMETER}
        labelId="ui-inn-reach.transaction.type"
        name={TYPE_PARAMETER}
        options={getTransactionTypeDataOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={STATE_PARAMETER}
        labelId="ui-inn-reach.transaction.status"
        activeFilters={activeFilters[STATE_PARAMETER]}
        dataOptions={transactionStatusOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={CENTRAL_SERVER_CODE_PARAMETER}
        labelId="ui-inn-reach.transaction.centralServer"
        activeFilters={activeFilters[CENTRAL_SERVER_CODE_PARAMETER]}
        dataOptions={centralServerOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={PATRON_AGENCY_CODE_PARAMETER}
        labelId="ui-inn-reach.transaction.patronAgency"
        activeFilters={activeFilters[PATRON_AGENCY_CODE_PARAMETER]}
        dataOptions={centralServerAgencyOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={ITEM_AGENCY_CODE_PARAMETER}
        labelId="ui-inn-reach.transaction.itemAgency"
        activeFilters={activeFilters[ITEM_AGENCY_CODE_PARAMETER]}
        dataOptions={centralServerAgencyOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={PATRON_TYPE_PARAMETER}
        labelId="ui-inn-reach.transaction.patronType"
        activeFilters={activeFilters[PATRON_TYPE_PARAMETER]}
        dataOptions={centralServerPatronTypeOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={ITEM_TYPE_PARAMETER}
        labelId="ui-inn-reach.transaction.itemType"
        activeFilters={activeFilters[ITEM_TYPE_PARAMETER]}
        dataOptions={centralServerItemTypeOptions}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

TransactionListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    centralServerAgencies: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    centralServerPatronTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    centralServerItemTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }),
};

TransactionListFilters.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  centralServerAgencies: {
    type: 'okapi',
    path: 'inn-reach/central-servers/agencies',
    throwErrors: false,
  },
  centralServerPatronTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/patron-types',
    throwErrors: false,
  },
  centralServerItemTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/item-types',
    throwErrors: false,
  },
});

export default stripesConnect(TransactionListFilters);
