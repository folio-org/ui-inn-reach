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
  TRANSACTION_FIELDS,
  HOLD_FIELDS,
} from '../../../constants';
import {
  useCallout,
  useReceiveItemModals,
} from '../../../hooks';
import {
  TransferHoldModal,
} from './components';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  FOLIO_ITEM_BARCODE,
  TITLE,
  FOLIO_INSTANCE_ID,
  FOLIO_ITEM_ID,
} = HOLD_FIELDS;

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

  const folioItemBarcode = transaction?.[HOLD]?.[FOLIO_ITEM_BARCODE];

  const showCallout = useCallout();
  const intl = useIntl();

  const [isOpenUnshippedItemModal, setIsOpenUnshippedItemModal] = useState(false);
  const [isOpenTransferHoldModal, setIsOpenTransferHoldModal] = useState(false);

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

  const triggerTransferHoldModal = () => {
    setIsOpenTransferHoldModal(prev => !prev);
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
  const onCheckoutBorroingSite = () => {
    mutator.checkoutBorroingSiteItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.success.post.check-out-borrowing-site" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.connection-problem.post.check-out-borrowing-site" />,
        });
      });
  };

  const onReturnPatronHoldItem = () => {
    mutator.returnPatronHoldItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.return-patron-hold-item.callout.success.post.return-patron-hold-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.return-patron-hold-item.callout.connection-problem.post.return-patron-hold-item" />,
        });
      });
  };

  const fetchCheckOutToPatron = () => {
    mutator.checkOutToPatron.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.check-out-to-patron.callout.success.post.check-out-to-patron" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-to-patron.callout.connection-problem.post.check-out-to-patron" />,
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

  const fetchCancelPatronHold = (response) => {
    mutator.cancelPatronHold.POST({
      cancellationReasonId: response.id,
      cancellationAdditionalInformation: 'Cancelled by staff',
    })
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.cancel-patron-hold.callout.success.post.cancel-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-patron-hold.callout.connection-problem.post.cancel-hold" />,
        });
      });
  };

  const handleCancelPatronHold = () => {
    mutator.cancellationReasons.GET()
      .then(response => {
        if (response?.length === 1) {
          return response[0];
        }

        throw new Error();
      })
      .then(fetchCancelPatronHold)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-patron-hold.callout.connection-problem.get.cancellation-reasons" />,
        });
      });
  };

  const handleFetchReceiveUnshippedItem = ({ itemBarcode }) => {
    mutator.itemBarcode.replace(itemBarcode || '');
    fetchReceiveUnshippedItem();
  };

  const fetchTransferHold = () => {
    mutator.transferItem.POST({})
      .then(() => {
        triggerTransferHoldModal();
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.transfer-hold.callout.success.post.transfer-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.transfer-hold.callout.connection-problem.post.transfer-hold" />,
        });
      });
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

  const renderTransferHoldModal = () => (
    <TransferHoldModal
      title={transaction?.[HOLD]?.[TITLE]}
      instanceId={transaction?.[HOLD]?.[FOLIO_INSTANCE_ID]}
      skippedItemId={transaction?.[HOLD]?.[FOLIO_ITEM_ID]}
      onClose={triggerTransferHoldModal}
      onRowClick={fetchTransferHold}
    />
  );

  useEffect(() => {
    mutator.servicePointId.replace(servicePointId || '');
    mutator.transactionId.replace(transaction.id || '');
    mutator.itemBarcode.replace(folioItemBarcode || '');
    mutator.folioItemId.replace(transaction?.[HOLD]?.[FOLIO_ITEM_ID] || '');
  }, [servicePointId, transaction]);

  if (isTransactionPending) return <LoadingPane />;

  return (
    <TransactionDetail
      transaction={transaction}
      isOpenAugmentedBarcodeModal={isOpenAugmentedBarcodeModal}
      isOpenItemHoldModal={isOpenItemHoldModal}
      isOpenInTransitModal={isOpenInTransitModal}
      isOpenTransferHoldModal={isOpenTransferHoldModal}
      intl={intl}
      isOpenUnshippedItemModal={isOpenUnshippedItemModal}
      onClose={backToList}
      onCheckoutBorrowingSite={onCheckoutBorroingSite}
      onCheckOutToPatron={fetchCheckOutToPatron}
      onReturnItem={onReturnPatronHoldItem}
      onCancelPatronHold={handleCancelPatronHold}
      onTransferHold={triggerTransferHoldModal}
      onTriggerUnshippedItemModal={triggerUnshippedItemModal}
      onFetchReceiveUnshippedItem={handleFetchReceiveUnshippedItem}
      onFetchReceiveItem={fetchReceiveItem}
      onRenderAugmentedBarcodeModal={renderAugmentedBarcodeModal}
      onRenderHoldModal={renderHoldModal}
      onRenderTransitModal={renderTransitModal}
      onRenderTransferHoldModal={renderTransferHoldModal}
    />
  );
};

TransactionDetailContainer.manifest = Object.freeze({
  servicePointId: { initialValue: '' },
  transactionId: { initialValue: '' },
  itemBarcode: { initialValue: '' },
  folioItemId: { initialValue: '' },
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
  checkoutBorroingSiteItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{itemBarcode}/check-out-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  returnPatronHoldItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/return-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  checkOutToPatron: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/check-out-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  staffSlips: {
    type: 'okapi',
    records: 'staffSlips',
    path: 'staff-slips-storage/staff-slips?limit=1000',
    throwErrors: false,
  },
  cancellationReasons: {
    type: 'okapi',
    records: 'cancellationReasons',
    path: 'cancellation-reason-storage/cancellation-reasons?query=name=="Other"&limit=100',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  cancelPatronHold: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/cancel',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  transferItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/itemhold/transfer-item/%{folioItemId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
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
    folioItemId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    receiveUnshippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    receiveItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    returnPatronHoldItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    checkoutBorroingSiteItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    checkOutToPatron: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancelPatronHold: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancellationReasons: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    transferItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(TransactionDetailContainer);
