import { clientService } from 'src/services/ClientService';
import { renderHook, waitFor } from '@testing-library/react';
import useAppConstants from '@hooks/useAppConstants';

jest.mock('src/services/ClientService');
const mockClientService = jest.mocked(clientService);

describe('useAppConstants tests', () => {
  it('use', async () => {
    const expected = [{ type: 'TYPE', value: 'vOut', label: 'lOut' }];
    mockClientService.getAppConstants.mockResolvedValue(expected as any);

    const { result } = renderHook(useAppConstants, { initialProps: 'TYPE' as any });
    await waitFor(() => {
      expect(mockClientService.getAppConstants).toHaveBeenCalledWith('TYPE');
      expect(result.current).toEqual(expected);
    });
  });
});
