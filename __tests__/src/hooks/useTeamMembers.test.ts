import * as DataService from '@services/DataService';
import { renderHook, waitFor } from '@testing-library/react';
import { mockTeamMember2 } from '@utils/TestData';
import useTeamMembers from '@hooks/useTeamMembers';

jest.mock('src/services/DataService', () => ({
  getTeamMembers: jest.fn(),
}));
const mockDataService = jest.mocked(DataService);

describe('getTeamMembers tests', () => {
  it('returns team members as an options array with labels and values', async () => {
    const expected = [{ value: mockTeamMember2.id, label: mockTeamMember2.email }];
    mockDataService.getTeamMembers.mockResolvedValue(expected as any);

    const { result } = renderHook(useTeamMembers);
    await waitFor(() => {
      expect(mockDataService.getTeamMembers).toHaveBeenCalled();
      expect(result.current.data).toEqual(expect
        .arrayContaining([{ value: mockTeamMember2.id, label: mockTeamMember2.email }]));
    });
  });
});
