import { renderHook, act } from '@testing-library/react-hooks';
import { useLocation } from 'react-router-dom';
import useList from './useList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ search: '?type=PATRON' }),
}));

const recordsMock = {
  transactions: [{ id: '1' }],
  totalRecords: 200,
};

const loadRecordsCB = jest.fn((setTransactions, transactionsResponse) => {
  setTransactions((prev) => [...prev, ...transactionsResponse.transactions]);
});

const resultCountIncrement = 100;

describe('useList hook', () => {
  let result;
  const queryLoadRecords = jest.fn(() => Promise.resolve(recordsMock));

  beforeEach(async () => {
    loadRecordsCB.mockClear();
    useLocation.mockClear();

    await act(async () => {
      result = await renderHook(() => useList(false, queryLoadRecords, loadRecordsCB, resultCountIncrement)).result;
    });
  });

  it('should return records', () => {
    const { records } = result.current;

    expect(records).toEqual(recordsMock.transactions);
  });

  it('should call queryLoadRecords callback', () => {
    expect(queryLoadRecords).toHaveBeenCalled();
  });

  it('should return records count', () => {
    const { recordsCount } = result.current;

    expect(recordsCount).toEqual(recordsMock.totalRecords);
  });

  describe('onUpdateList callback', () => {
    beforeEach(async () => {
      const { onUpdateList } = result.current;

      loadRecordsCB.mockClear();
      await act(async () => { onUpdateList(); });
    });

    it('should fetch records with an offset equal to 0', () => {
      const offset = 0;

      expect(queryLoadRecords).toHaveBeenCalledWith(offset, true);
    });

    it('should not call loadRecordsCB callback', () => {
      expect(loadRecordsCB).not.toHaveBeenCalled();
    });
  });

  describe('onNeedMoreData callback', () => {
    beforeEach(async () => {
      const { onNeedMoreData } = result.current;

      await act(async () => { onNeedMoreData(); });
    });

    it('should fetch records ', () => {
      expect(queryLoadRecords).toHaveBeenCalled();
    });

    it('should call loadRecordsCB callback', () => {
      expect(loadRecordsCB).toHaveBeenCalled();
    });

    it('should increment the offset by 100', async () => {
      const { onNeedMoreData } = result.current;

      expect(queryLoadRecords).toHaveBeenCalledWith(100, true);
      await act(async () => { onNeedMoreData(); });
      expect(queryLoadRecords).toHaveBeenCalledWith(200, true);
    });

    it('should not load the records when the recordsOffsetRef.current > recordsCount', async () => {
      const { onNeedMoreData } = result.current;

      await act(async () => { onNeedMoreData(); });
      await act(async () => { onNeedMoreData(); });
      expect(queryLoadRecords).not.toHaveBeenCalledWith(300, true);
    });
  });
});
