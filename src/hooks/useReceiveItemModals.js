import {
  lazy,
  useState,
} from 'react';
import {
  CHECK_IN_STATUSES,
} from '../constants';

const AugmentedBarcodeModal = lazy(() => import('../components/common/AugmentedBarcodeModal'));
const HoldModal = lazy(() => import('../components/common/HoldModal'));
const InTransitModal = lazy(() => import('../components/common/InTransitModal'));

const {
  AWAITING_PICKUP,
  IN_TRANSIT,
} = CHECK_IN_STATUSES;

const useReceiveItemModals = (staffSlips, stripes, intl, focusBarcodeField) => {
  const [isOpenAugmentedBarcodeModal, setIsOpenAugmentedBarcodeModal] = useState(false);
  const [isHoldItem, setIsHoldItem] = useState(false);
  const [isTransitItem, setIsTransitItem] = useState(false);
  const [isAugmentedBarcodeModalAfterClose, setIsAugmentedBarcodeModalAfterClose] = useState(false);
  const [checkinData, setCheckinData] = useState(null);

  const showHoldOrTransitModal = !isOpenAugmentedBarcodeModal || isAugmentedBarcodeModalAfterClose;
  const isOpenItemHoldModal = isHoldItem && showHoldOrTransitModal;
  const isOpenInTransitModal = isTransitItem && showHoldOrTransitModal;

  const handleCloseModal = () => {
    setIsOpenAugmentedBarcodeModal(false);
    setIsHoldItem(false);
    setIsTransitItem(false);
    setIsAugmentedBarcodeModalAfterClose(false);
    setCheckinData(null);
  };

  const setAugmentedBarcodeModalAfterClose = () => {
    setIsAugmentedBarcodeModalAfterClose(true);
  };

  const onSetCheckinData = (value) => {
    setCheckinData(value);
  };

  const onGetSlipTmpl = (type) => {
    const staffSlip = staffSlips?.find(slip => slip.name.toLowerCase() === type);

    return staffSlip?.template || '';
  };

  const onProcessModals = (checkinResp) => {
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
        checkinResp.isTransitItem = true;
        setIsTransitItem(true);
        break;
      default:
    }

    if (barcodeAugmented) setIsOpenAugmentedBarcodeModal(true);

    return checkinResp;
  };

  const onRenderAugmentedBarcodeModal = () => (
    <AugmentedBarcodeModal
      {...checkinData}
      intl={intl}
      onClose={handleCloseModal}
      onClickClose={setAugmentedBarcodeModalAfterClose}
      onBeforePrint={setAugmentedBarcodeModalAfterClose}
    />
  );

  const onRenderHoldModal = () => (
    <HoldModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onFocusBarcodeField={focusBarcodeField}
      onClose={handleCloseModal}
    />
  );

  const onRenderTransitModal = () => (
    <InTransitModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onClose={handleCloseModal}
      onFocusBarcodeField={focusBarcodeField}
    />
  );

  return {
    isOpenAugmentedBarcodeModal,
    isOpenItemHoldModal,
    isOpenInTransitModal,
    onRenderAugmentedBarcodeModal,
    onRenderHoldModal,
    onRenderTransitModal,
    onSetCheckinData,
    onGetSlipTmpl,
    onProcessModals,
  };
};

export default useReceiveItemModals;
