import { appService } from '../../../src/services/AppService';
import supabaseClient from '../../../utils/supabaseClient';

describe('appService tests', () => {

  const mockQueryBuilder = {
    select: jest.fn(() => Promise.resolve({})),
  };

  it('lookup', async () => {
    const constants = [{ type: 'TYPE', value: 'val', label: 'label' }]
    const response = { data: constants }

    const fromSpy = jest.spyOn(supabaseClient, "from")
      .mockReturnValue(mockQueryBuilder as any)
    const selectSpy = jest.spyOn(mockQueryBuilder, "select")
      .mockResolvedValue(response)

    const actual = await appService.lookup()
    expect(fromSpy).toHaveBeenCalledWith('app_constants')
    expect(selectSpy).toHaveBeenCalled()
    expect(actual.get('TYPE')).toEqual(constants)
  });

  it('getAppConstants - with map', async () => {
    const map = new Map();
    map.set('TYPE', [{ type: 'TYPE', value: 'vOut', label: 'lOut' }]);

    const oldCache = appService.cache;
    appService.cache = map

    const actual = await appService.getAppConstants('TYPE')
    expect(actual[0].value).toEqual('vOut');

    // cleanup
    appService.cache = oldCache;
  });

  it('getAppConstants - without map', async () => {
    const map = new Map();
    map.set('TYPE', [{ type: 'TYPE', value: 'vOut', label: 'lOut' }]);

    const oldCache = appService.cache;
    appService.cache = null;

    const lookupSpy = jest.spyOn(appService, "lookup")
      .mockResolvedValue(map)

    const actual = await appService.getAppConstants('TYPE')
    expect(lookupSpy).toHaveBeenCalled();
    expect(actual[0].value).toEqual('vOut');

    // cleanup
    appService.cache = oldCache;
  });



  afterEach(() => {
    jest.clearAllMocks();
  });

})
