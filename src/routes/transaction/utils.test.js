import { effectiveCallNumber } from './effectiveCallNumber';

import { convertToSlipData } from './utils';

jest.mock('./effectiveCallNumber', () => ({
  ...jest.requireActual('./effectiveCallNumber'),
  effectiveCallNumber: jest.fn(),
}));

const mockItem = {
  effectiveLocationFolioName: 'Main Library',
  title: 'Test Book Title',
  barcode: '1234567890',
  author: 'Test Author',
  shelvingOrder: 'A123',
  hrid: 'HRID123',
};

const mockInnReachTransaction = {
  patronName: 'John Doe',
  patronAgencyCode: 'PAT001',
  patronAgencyDescription: 'Patron Agency Description',
  patronTypeCode: 'STUDENT',
  patronTypeDescription: 'Student Type',
  centralServerId: 'central-123',
  centralServerCode: 'CS001',
  localServerCode: 'LS001',
  itemAgencyCode: 'ITEM001',
  itemAgencyDescription: 'Item Agency Description',
  pickupLocationCode: 'PICKUP001',
  pickupLocationDisplayName: 'Main Pickup Location',
  pickupLocationPrintName: 'Main Pickup',
  pickupLocationDeliveryStop: 'Stop A',
};

const mockSlip = {
  name: 'Test Slip Name',
};

describe('convertToSlipData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert all data correctly when all parameters are provided', () => {
    const mockEffectiveCallNumber = 'QA76.73.J38';

    effectiveCallNumber.mockReturnValue(mockEffectiveCallNumber);

    const result = convertToSlipData({
      innReachTransaction: mockInnReachTransaction,
      item: mockItem,
      slip: mockSlip,
    });

    expect(result).toEqual({
      'innReachTransaction.patronName': 'John Doe',
      'innReachTransaction.patronAgencyCode': 'PAT001',
      'innReachTransaction.patronAgencyDescription': 'Patron Agency Description',
      'innReachTransaction.patronTypeCode': 'STUDENT',
      'innReachTransaction.patronTypeDescription': 'Student Type',
      'innReachTransaction.centralServerId': 'central-123',
      'innReachTransaction.centralServerCode': 'CS001',
      'innReachTransaction.localServerCode': 'LS001',
      'innReachTransaction.itemAgencyCode': 'ITEM001',
      'innReachTransaction.itemAgencyDescription': 'Item Agency Description',
      'innReachTransaction.pickupLocationCode': 'PICKUP001',
      'innReachTransaction.pickupLocationDisplayName': 'Main Pickup Location',
      'innReachTransaction.pickupLocationPrintName': 'Main Pickup',
      'innReachTransaction.pickupLocationDeliveryStop': 'Stop A',
      'item.title': 'Test Book Title',
      'item.barcode': '1234567890',
      'item.author': 'Test Author',
      'item.effectiveCallNumber': mockEffectiveCallNumber,
      'item.shelvingOrder': 'A123',
      'item.hrid': 'HRID123',
      'item.effectiveLocationFolioName': 'Main Library',
      'staffSlip.Name': 'Test Slip Name',
    });

    expect(effectiveCallNumber).toHaveBeenCalledWith(mockItem);
  });
});
