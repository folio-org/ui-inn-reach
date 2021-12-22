import {
  useState,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  isEmpty,
  keyBy,
  upperFirst,
} from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CHECK_IN_STATUSES,
  DESC_ORDER,
  METADATA_FIELDS,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  AUGMENTED_BARCODE_TEMPLATE,
} from '../../constants';
import {
  CheckIn,
  ConfirmStatusModal,
} from './components';
import {
  useCallout,
} from '../../hooks';
import {
  convertToSlipData,
} from './utils';

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  PATRON,
} = TRANSACTION_TYPES;

const {
  TYPE,
  STATUS,
  ITEM_BARCODE,
} = TRANSACTION_FIELDS;

const {
  ITEM_SHIPPED,
} = TRANSACTION_STATUSES;

const {
  AWAITING_PICKUP,
  IN_TRANSIT,
} = CHECK_IN_STATUSES;

const ReceiveShippedItems = ({
  history,
  location,
  resources: {
    transactionRecords: {
      isPending: isTransactionsPending,
    },
    receiveShippedItem: {
      isPending: isReceiveShippedItemPending,
    },
    staffSlips: {
      records: staffSlipsData,
    },
    servicePoints: {
      records: servicePointsData,
    },
  },
  mutator,
  stripes,
}) => {
  const [scannedItems, setScannedItems] = useState([]);
  const [noTransaction, setNoTransaction] = useState(false);
  const [barcodeSupplemented, setBarcodeSupplemented] = useState(false);
  const [isHoldItem, setIsHoldItem] = useState(false);
  const [isTransitItem, setIsTransitItem] = useState(false);
  const [hasNextRequest, setHasNextRequest] = useState(false);
  const [checkinData, setCheckinData] = useState(null);

  const showCallout = useCallout();
  const intl = useIntl();
  const itemFormRef = useRef({});
  const barcodeRef = useRef();
  const isLoading = isTransactionsPending || isReceiveShippedItemPending;

  const resetData = () => {
    if (itemFormRef.current.reset) {
      itemFormRef.current.reset();
    }
    setScannedItems([]);
  };

  const handleCloseModal = () => {
    setNoTransaction(false);
    setBarcodeSupplemented(false);
    setIsHoldItem(false);
    setIsTransitItem(false);
    setHasNextRequest(false);
    setCheckinData(null);
  };

  const fetchRequests = (checkinResp) => {
    const {
      item,
    } = checkinResp.folioCheckIn;
    const query = `(itemId==${item.id} and (status=="Open - Awaiting pickup" or status=="Open - Awaiting delivery"))`;

    mutator.requests.reset();

    return mutator.requests.GET({
      params: {
        query,
      },
    })
      .then(requests => {
        if (!isEmpty(requests)) {
          checkinResp.nextRequest = requests[0];
          setHasNextRequest(true);
        }

        return checkinResp;
      });
  };

  const processResponse = (checkinResp) => {
    const {
      folioCheckIn: {
        item,
      },
      barcodeAugmented,
    } = checkinResp;

    switch (item?.status?.name) {
      case AWAITING_PICKUP:
        checkinResp.isHoldItem = true;
        setIsHoldItem(true);
        break;
      case IN_TRANSIT:
        checkinResp.transinItem = true;
        setIsTransitItem(true);
        break;
      default:
    }

    if (barcodeAugmented) setBarcodeSupplemented(true);
    setCheckinData(checkinResp);

    return checkinResp;
  };

  const addScannedItem = (checkinResp) => {
    setScannedItems(prev => [checkinResp, ...prev]);

    return checkinResp;
  };

  const fetchReceiveShippedItem = () => {
    mutator.receiveShippedItem.POST({})
      .then(processResponse)
      .then(fetchRequests)
      .then(addScannedItem)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.put.receive-shipped-item" />,
        });
      });
  };

  const fetchTransactions = ({ itemBarcode }) => {
    mutator.transactionRecords.reset();
    mutator.transactionRecords.GET({
      params: {
        [ITEM_BARCODE]: itemBarcode.trim(),
        [TYPE]: PATRON,
        [STATUS]: ITEM_SHIPPED,
        [SORT_PARAMETER]: UPDATED_DATE,
        [SORT_ORDER_PARAMETER]: DESC_ORDER,
      },
    })
      .then(({ transactions: [transaction] }) => {
        const servicePointId = stripes?.user?.user?.curServicePoint?.id;

        mutator.transactionId.replace(transaction?.id || '');
        mutator.servicePointId.replace(servicePointId || '');

        if (transaction) {
          fetchReceiveShippedItem();
        } else {
          setNoTransaction(true);
        }
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.get.transactions" />,
        });
      });
  };

  const focusBarcodeField = () => {
    barcodeRef.current.focus();
  };

  const getSlipTmpl = (type) => {
    const staffSlip = staffSlipsData?.find(slip => slip.name.toLowerCase() === type);

    return staffSlip?.template || '';
  };

  const isPrintable = (type) => {
    const staffSlips = staffSlipsData || [];
    const servicePoints = servicePointsData || [];
    const servicePointId = stripes?.user?.user?.curServicePoint?.id || '';
    const spMap = keyBy(servicePoints, 'id');
    const slipMap = keyBy(staffSlips, slip => slip.name.toLowerCase());
    const servicePoint = spMap[servicePointId];
    const staffSlip = slipMap[type];

    if (!servicePoint || !staffSlip) return false;
    const spSlip = servicePoint.staffSlips.find(slip => slip.id === staffSlip.id);

    return (!spSlip || spSlip.printByDefault);
  };

  const renderAugmentedBarcodeModal = () => {
    const {
      folioCheckIn: {
        staffSlipContext,
      },
      transaction,
    } = checkinData;
    const slipData = convertToSlipData({ staffSlipContext, transaction });
    const messages = [
      <FormattedMessage id="ui-inn-reach.shipped-items.modal.message.barcode-augmented" />,
    ];

    return (
      <ConfirmStatusModal
        label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.barcode-augmented.heading" />}
        slipTemplate={AUGMENTED_BARCODE_TEMPLATE}
        slipData={slipData}
        message={messages}
        onClose={handleCloseModal}
        onAfterPrint={focusBarcodeField}
      />
    );
  };

  const renderHoldModal = () => {
    const {
      timezone,
      locale,
    } = stripes;
    const {
      folioCheckIn: {
        item,
        staffSlipContext,
      },
      nextRequest,
    } = checkinData;
    const {
      patronComments,
      pickupServicePoint,
    } = nextRequest;
    const slipData = convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Hold' });
    const messages = [
      <FormattedMessage
        id="ui-inn-reach.shipped-items.modal.hold.message"
        values={{
          title: item.title,
          barcode: item.barcode,
          materialType: upperFirst(item?.materialType?.name || ''),
          pickupServicePoint: pickupServicePoint?.name || '',
        }}
      />,
    ];

    if (patronComments) {
      messages.push(
        <FormattedMessage
          id="ui-inn-reach.shipped-items.modal.hold.comment"
          values={{
            comment: patronComments,
            strong: (chunks) => (
              <strong>
                {chunks}
              </strong>
            ),
          }}
        />
      );
    }

    return (
      <ConfirmStatusModal
        label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.hold.heading" />}
        isPrintable={isPrintable('hold')}
        slipTemplate={getSlipTmpl('hold')}
        slipData={slipData}
        message={messages}
        onAfterPrint={focusBarcodeField}
        onClose={handleCloseModal}
      />
    );
  };

  const renderTransitionModal = () => {
    const {
      timezone,
      locale,
    } = stripes;
    const {
      folioCheckIn: {
        item,
        staffSlipContext,
      },
    } = checkinData;
    const slipData = convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Transit' });
    const destinationServicePoint = item?.inTransitDestinationServicePoint?.name || '';
    const messages = [
      <FormattedMessage
        id="ui-inn-reach.shipped-items.modal.transit.message"
        values={{
          title: item.title,
          barcode: item.barcode,
          materialType: upperFirst(item?.materialType?.name || ''),
          servicePoint: destinationServicePoint,
        }}
      />,
    ];

    return (
      <ConfirmStatusModal
        label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.transit.heading" />}
        slipTemplate={getSlipTmpl('transit')}
        slipData={slipData}
        isPrintable={isPrintable('transit')}
        message={messages}
        onClose={handleCloseModal}
        onAfterPrint={focusBarcodeField}
      />
    );
  };

  return (
    <>
      <CheckIn
        history={history}
        location={location}
        stripes={stripes}
        isLoading={isLoading}
        intl={intl}
        itemFormRef={itemFormRef}
        barcodeRef={barcodeRef}
        scannedItems={scannedItems}
        onGetSlipTemplate={getSlipTmpl}
        onSessionEnd={resetData}
        onSubmit={fetchTransactions}
      />
      {noTransaction &&
        <ConfirmStatusModal
          showPrintButton={false}
          label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.no-transaction.heading" />}
          message={[<FormattedMessage id="ui-inn-reach.shipped-items.modal.message.barcode-augmented" />]}
          onClose={handleCloseModal}
          onAfterPrint={focusBarcodeField}
        />
      }
      {barcodeSupplemented && renderAugmentedBarcodeModal()}
      {isHoldItem && hasNextRequest && checkinData && renderHoldModal()}
      {isTransitItem && checkinData && renderTransitionModal()}
    </>
  );
};

ReceiveShippedItems.manifest = Object.freeze({
  transactionId: { initialValue: '' },
  servicePointId: { initialValue: '' },
  transactionRecords: {
    type: 'okapi',
    path: 'inn-reach/transactions',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  receiveShippedItem: {
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
  servicePoints: {
    type: 'okapi',
    records: 'servicepoints',
    path: 'service-points?limit=1000',
  },
  requests: {
    type: 'okapi',
    records: 'requests',
    accumulate: true,
    path: 'circulation/requests',
    fetch: false,
  },
});

ReceiveShippedItems.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.shape({
    transactionId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    transactionRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    requests: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    receiveShippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
  resources: PropTypes.shape({
    transactionRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    receiveShippedItem: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    servicePoints: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    staffSlips: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }),
};

export default stripesConnect(ReceiveShippedItems);
