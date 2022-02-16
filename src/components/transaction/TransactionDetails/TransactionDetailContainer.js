import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-components';

import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import TransactionDetail from './TransactionDetail';
import {
  AugmentedBarcodeModal,
  HoldModal,
  InTransitModal,
} from '../../common';
import {
  CALLOUT_ERROR_TYPE,
  getTransactionListUrl,
} from '../../../constants';
import {
  useCallout,
  useReceiveItemModals,
} from '../../../hooks';

const TransactionDetailContainer = ({
  resources: {
    transactionView: {
      records: transactionData,
      isPending: isTransactionPending,
    },
    staffSlips: {
      records: staffSlips,
    },
  },
  mutator,
  stripes,
  history,
  location,
  onUpdateTransactionList,
}) => {
  const transaction = transactionData[0] || {};
  const servicePointId = stripes?.user?.user?.curServicePoint?.id;

  const showCallout = useCallout();
  const intl = useIntl();

  const [isOpenUnshippedItemModal, setIsOpenUnshippedItemModal] = useState(false);

  const {
    isOpenAugmentedBarcodeModal,
    isOpenItemHoldModal,
    isOpenInTransitModal,
    checkinData,
    onSetCheckinData,
    onGetSlipTmpl,
    onProcessModals,
    onSetAugmentedBarcodeModalAfterClose,
    onCloseModal,
  } = useReceiveItemModals(staffSlips);

  const triggerUnshippedItemModal = () => {
    setIsOpenUnshippedItemModal(prevModalState => !prevModalState);
  };

  const backToList = useCallback(() => {
    history.push({
      pathname: getTransactionListUrl(),
      search: location.search,
    });
  }, [history, location.search]);

  const fetchReceiveUnshippedItem = () => {
    mutator.receiveUnshippedItem.POST({})
      .then(response => {
        setIsOpenUnshippedItemModal(false);
        onSetCheckinData(response);
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.success.post.receive-unshipped-item" />,
        });

        return response;
      })
      .then(onProcessModals)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.connection-problem.post.receive-unshipped-item" />,
        });
      });
  };

  const fetchReceiveItem = () => {
    mutator.receiveItem.POST({})
      .then(response => {
        onSetCheckinData(response);
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.success.post.receive-item" />,
        });

        return response;
      })
      .then(onProcessModals)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.connection-problem.post.receive-item" />,
        });
      });
  };

  const handleFetchReceiveUnshippedItem = ({ itemBarcode }) => {
    mutator.itemBarcode.replace(itemBarcode || '');
    fetchReceiveUnshippedItem();
  };

  const renderAugmentedBarcodeModal = () => (
    <AugmentedBarcodeModal
      {...checkinData}
      intl={intl}
      onClose={onCloseModal}
      onClickClose={onSetAugmentedBarcodeModalAfterClose}
      onBeforePrint={onSetAugmentedBarcodeModalAfterClose}
    />
  );

  const renderHoldModal = () => (
    <HoldModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onClose={onCloseModal}
    />
  );

  const renderTransitModal = () => (
    <InTransitModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onClose={onCloseModal}
    />
  );

  useEffect(() => {
    mutator.servicePointId.replace(servicePointId || '');
    mutator.transactionId.replace(transaction.id || '');
  }, [servicePointId, transaction]);

  if (isTransactionPending) return <LoadingPane />;

  return (
    <TransactionDetail
      transaction={transaction}
      isOpenAugmentedBarcodeModal={isOpenAugmentedBarcodeModal}
      isOpenItemHoldModal={isOpenItemHoldModal}
      isOpenInTransitModal={isOpenInTransitModal}
      intl={intl}
      isOpenUnshippedItemModal={isOpenUnshippedItemModal}
      onClose={backToList}
      onTriggerUnshippedItemModal={triggerUnshippedItemModal}
      onFetchReceiveUnshippedItem={handleFetchReceiveUnshippedItem}
      onFetchReceiveItem={fetchReceiveItem}
      onRenderAugmentedBarcodeModal={renderAugmentedBarcodeModal}
      onRenderHoldModal={renderHoldModal}
      onRenderTransitModal={renderTransitModal}
    />
  );
};

TransactionDetailContainer.manifest = Object.freeze({
  servicePointId: { initialValue: '' },
  transactionId: { initialValue: '' },
  itemBarcode: { initialValue: '' },
  transactionView: {
    type: 'okapi',
    path: 'inn-reach/transactions/:{id}',
    throwErrors: false,
  },
  receiveUnshippedItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-unshipped-item/%{servicePointId}/%{itemBarcode}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  receiveItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  staffSlips: {
    type: 'okapi',
    records: 'staffSlips',
    path: 'staff-slips-storage/staff-slips?limit=1000',
    throwErrors: false,
  },
});

TransactionDetailContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    transactionView: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    staffSlips: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  stripes: stripesShape.isRequired,
  onUpdateTransactionList: PropTypes.func.isRequired,
  mutator: PropTypes.shape({
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    transactionId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    itemBarcode: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    receiveUnshippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    receiveItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(TransactionDetailContainer);
