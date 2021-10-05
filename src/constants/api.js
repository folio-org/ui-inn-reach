import {
  MODULE_ROUTE,
} from './base';

const TRANSACTIONS = 'transactions';

const VIEW = 'view';

export const getTransactionListUrl = () => (`/${MODULE_ROUTE}/${TRANSACTIONS}`);
export const getTransactionViewUrl = (id) => (`/${MODULE_ROUTE}/${TRANSACTIONS}/${id}/${VIEW}`);