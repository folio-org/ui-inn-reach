import React from 'react';
import TransactionListRoute from './TransactionListRoute';
import CsvReport from "./CsvReport";
import {
  exportToCsv,
} from "@folio/stripes-components";

const scvReport = new CsvReport({
  intl: {
    formatMessage: jest.fn(({ id }) => id),
    formatTime: jest.fn(({ id }) => id),
  },
});

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  exportToCsv: jest.fn(),
}))

const setUpSpy = jest.spyOn(scvReport, 'setUp');
const toCSVSpy = jest.spyOn(scvReport, 'toCSV');
const parseSpy = jest.spyOn(scvReport, 'parse');
const parseDatesSpy = jest.spyOn(scvReport, 'parseDates');


const transactionsMock = {
  transactions: [
    {
      id: "b42629b5-738b-4054-9764-3b4380c0b10f",
      centralServerCode: "d2ir",
      hold: {
        folioItemBarcode: "A14811392645",
        patronAgencyCode: "moag1",
        folioItemId: "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
      }
    }
  ]
};

const centralServersMock = {
  centralServers: [
    {
      id: "b19a50d5-6757-4ba9-91a5-0c00fbb67962",
      centralServerCode: 'd2ir',
    }
  ]
};

const localServersMock = {
  localServerList: [
    {
      agencyList: [
        {
          agencyCode: "moag1",
          description: "Mobi Mobius Agency 1",
        }
      ]
    }
  ]
};

const itemsMock = {
  items: [
    {
      id: "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
      barcode: "A14811392645",
      callNumber: "K1 .M44",
      effectiveLocation: {
        id: "fcd64ce1-6995-48f0-840e-89ffa2288371",
        name: "Main Library",
      }
    }
  ]
}

const mutatorMock = {
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
    reset: jest.fn(),
  },
  centralServerRecords: {
    GET: jest.fn(() => Promise.resolve(centralServersMock)),
  },
  localServers: {
    GET: jest.fn(() => Promise.resolve(localServersMock)),
  },
  items: {
    GET: jest.fn(() => Promise.resolve(itemsMock)),
    reset: jest.fn(),
  },
};

describe('TransactionListRoute', () => {
  beforeEach(() => {
    exportToCsv.mockClear();
  });

  describe('generate method', () => {
    const overdue = 'overdue';
    const record = { minDaysOverdue: 2 };

    beforeEach(async () => {
      await scvReport.generate(mutatorMock, overdue, record);
    })

    it('should call the setUp method', () => {
      expect(setUpSpy).toHaveBeenCalledWith(overdue, record);
    });

    it('should call the transactions', () => {
      expect(mutatorMock.transactionRecords.GET).toHaveBeenCalledWith({
        "params": {
          "createdDateOp": "less",
          "limit": 1000,
          "offset": 0,
          "sortBy": "transactionTime",
          "sortOrder": "asc",
          "state": [
            "ITEM_RECEIVED",
            "BORROWER_RENEW",
            "OWNER_RENEW",
            "ITEM_IN_TRANSIT",
            "ITEM_SHIPPED",
          ],
          "type": "ITEM",
          "updatedDate": "2022-03-09T10:00:00.000Z",
        },
      });
    });

    it('should call the central server records', () => {
      expect(mutatorMock.centralServerRecords.GET).toHaveBeenCalled();
    });

    it('should call the local servers', () => {
      expect(mutatorMock.localServers.GET).toHaveBeenCalledWith({
        path: "inn-reach/central-servers/b19a50d5-6757-4ba9-91a5-0c00fbb67962/d2r/contribution/localservers",
      });
    });

    it('should call the items', () => {
      expect(mutatorMock.items.GET).toHaveBeenCalledWith({
        params: {
          limit: 1000,
          query: 'barcode==A14811392645',
        },
      });
    });

    it('should call the toCSV method', () => {
      expect(toCSVSpy).toHaveBeenCalledWith([
        {
          "callNumber": "K1 .M44",
          "centralServerCode": "d2ir",
          "effectiveLocation": "Main Library",
          "hold": {
            "folioItemBarcode": "A14811392645",
            "folioItemId": "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
            "patronAgencyCode": "moag1"
          },
          "id": "b42629b5-738b-4054-9764-3b4380c0b10f",
          "patronAgencyCode": "Mobi Mobius Agency 1 (moag1)"
        },
      ]);
    });

    it('should call the parse method', () => {
      expect(parseSpy).toHaveBeenCalledWith([
        {
          "callNumber": "K1 .M44",
          "centralServerCode": "d2ir",
          "effectiveLocation": "Main Library",
          "hold": {
            "folioItemBarcode": "A14811392645",
            "folioItemId": "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
            "patronAgencyCode": "moag1"
          },
          "id": "b42629b5-738b-4054-9764-3b4380c0b10f",
          "patronAgencyCode": "Mobi Mobius Agency 1 (moag1)"
        }]);
    });

    it('should call the parseDates method', () => {
      expect(parseDatesSpy).toHaveBeenCalledWith({
        "callNumber": "K1 .M44",
        "centralServerCode": "d2ir",
        "effectiveLocation": "Main Library",
        "hold": {
          "folioItemBarcode": "A14811392645",
          "folioItemId": "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
          "patronAgencyCode": "moag1",
        },
        "id": "b42629b5-738b-4054-9764-3b4380c0b10f",
        "patronAgencyCode": "Mobi Mobius Agency 1 (moag1)",
      });
    });

    it('should call the exportToCsv function', () => {
      expect(exportToCsv).toHaveBeenCalledWith([
        {
          "callNumber": "K1 .M44",
          "centralServerCode": "d2ir",
          "effectiveLocation": "Main Library",
          "hold": {
              "folioItemBarcode": "A14811392645",
              "folioItemId": "f8b6d973-60d4-41ce-a57b-a3884471a6d6",
              "patronAgencyCode": "moag1"
            },
          "id": "b42629b5-738b-4054-9764-3b4380c0b10f",
          "patronAgencyCode": "Mobi Mobius Agency 1 (moag1)"
        }
        ],
        {
          "onlyFields": [{
              "label": "ui-inn-reach.reports.hold.patronId",
              "value": "hold.patronId",
            }, {
              "label": "ui-inn-reach.reports.effectiveLocation",
              "value": "effectiveLocation"
            }, {
              "label": "ui-inn-reach.reports.callNumber",
              "value": "callNumber"
            }, {
              "label": "ui-inn-reach.reports.hold.folioItemBarcode",
              "value": "hold.folioItemBarcode"
            }, {
              "label": "ui-inn-reach.reports.hold.title",
              "value": "hold.title"
            }, {
              "label": "ui-inn-reach.reports.patronAgencyCode",
              "value": "patronAgencyCode"
            }, {
              "label": "ui-inn-reach.reports.hold.dueDateTime",
              "value": "hold.dueDateTime"
            }
          ]
        });
    });
  })
});
