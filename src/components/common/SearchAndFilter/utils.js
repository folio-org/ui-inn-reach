export const convertToSlipData = ({
  innReachTransaction = {},
  item = {},
  slip = {},
}) => {

  return {
    'innReachTransaction.patronName': innReachTransaction.patronName,
    'innReachTransaction.patronAgencyCode': innReachTransaction.patronAgencyCode,
    'innReachTransaction.patronAgencyDescription': innReachTransaction.patronAgencyDescription,
    'innReachTransaction.patronTypeCode': innReachTransaction.patronTypeCode,
    'innReachTransaction.patronTypeDescription': innReachTransaction.patronTypeDescription,
    'innReachTransaction.centralServerId': innReachTransaction.centralServerId,
    'innReachTransaction.centralServerCode': innReachTransaction.centralServerCode,
    'innReachTransaction.localServerCode': innReachTransaction.localServerCode,
    'innReachTransaction.itemAgencyCode': innReachTransaction.itemAgencyCode,
    'innReachTransaction.itemAgencyDescription': innReachTransaction.itemAgencyDescription,
    'innReachTransaction.pickupLocationCode': innReachTransaction.pickupLocationCode,
    'innReachTransaction.pickupLocationDisplayName': innReachTransaction.pickupLocationDisplayName,
    'innReachTransaction.pickupLocationPrintName': innReachTransaction.pickupLocationPrintName,
    'innReachTransaction.pickupLocationDeliveryStop': innReachTransaction.pickupLocationDeliveryStop,
    'item.title': item.title,
    'item.barcode': item.barcode,
    'item.author': item.author,
    'item.effectiveCallNumber': item.effectiveCallNumber,
    'item.shelvingOrder': item.shelvingOrder,
    'item.hrid': item.hrid,
    'item.effectiveLocationFolioName': item.effectiveLocationFolioName,
    'staffSlip.Name': slip.name,
  };
};
