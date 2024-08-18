import * as DataService from '@services/DataService';
import { renderHook, waitFor } from '@testing-library/react';
import useAppConstants from '@hooks/useAppConstants';

jest.mock('src/services/DataService', () => ({
  getAppConstants: jest.fn(),
}));
const mockDataService = jest.mocked(DataService);

describe('useAppConstants tests', () => {
  it('use', async () => {
    const expected = [{ type: 'TYPE', value: 'vOut', label: 'lOut' }];
    mockDataService.getAppConstants.mockResolvedValue(expected as any);

    const { result } = renderHook(useAppConstants, { initialProps: 'TYPE' as any });
    await waitFor(() => {
      expect(mockDataService.getAppConstants).toHaveBeenCalledWith('TYPE');
      expect(result.current.data).toEqual(expected);
    });
  });
});
