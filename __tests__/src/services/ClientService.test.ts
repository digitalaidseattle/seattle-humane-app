/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */


describe('ClientService', () => {
  it('should get service categories', async () => {
    const response = { data: [new ServiceCategory({})], error: null };
    const mockQueryBuilder = {
      select: jest.fn(() => Promise.resolve(response)),
    };
    const fromSpy = jest.spyOn(supabaseClient, 'from')
      .mockReturnValue(mockQueryBuilder as any);
    const selectSpy = jest.spyOn(mockQueryBuilder, 'select')
      .mockReturnValue(response as any);

    const cats = await clientService.getServiceCategories();
    expect(fromSpy).toHaveBeenCalledWith('service_category');
    expect(selectSpy).toHaveBeenCalledWith('*');
    expect(cats.length).toEqual(1);
  });

  it('should get service statuses', async () => {
    const stats = await clientService.getServiceStatuses();
    expect(stats.length).toBeGreaterThan(1);
  });
});
