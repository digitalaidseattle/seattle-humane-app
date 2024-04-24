import React from 'react';
import { useAppConstants } from '../../../src/services/useAppConstants';
import { appService } from '../../../src/services/AppService';

describe('useAppConstants tests', () => {
  it('use', async () => {
    const appConstants = [{ type: 'TYPE', value: 'val', label: 'label' }];
    const expected = [{ type: 'TYPE', value: 'vOut', label: 'lOut' }];

    const useStateDataMock: any = () => [expected, jest.fn((data: any) => expect(data).toEqual(appConstants))];
    const useStateSpy = jest.spyOn(React, 'useState')
      .mockImplementationOnce(useStateDataMock);
    const useEffectSpy = jest.spyOn(React, 'useEffect')
      .mockImplementation((f) => f());

    const getAppConstantsSpy = jest.spyOn(appService, 'getAppConstants')
      .mockResolvedValue(appConstants);

    const { data: actual } = useAppConstants('TYPE');
    expect(useEffectSpy).toHaveBeenCalled();
    expect(useStateSpy).toHaveBeenCalled();
    expect(getAppConstantsSpy).toHaveBeenCalledWith('TYPE');
    expect(actual).toEqual(expected);
  });
  it('returns empty array if no response received', async () => {
    const expected = [];

    const useStateDataMock: any = () => [
      expected, jest.fn(),
    ];
    const useStateSpy = jest.spyOn(React, 'useState')
      .mockImplementationOnce(useStateDataMock);
    const useEffectSpy = jest.spyOn(React, 'useEffect')
      .mockImplementation((f) => f());

    const getAppConstantsSpy = jest.spyOn(appService, 'getAppConstants')
      .mockResolvedValue(undefined);

    const { data: actual } = useAppConstants('TYPE');
    expect(useEffectSpy).toHaveBeenCalled();
    expect(useStateSpy).toHaveBeenCalled();
    expect(getAppConstantsSpy).toHaveBeenCalledWith('TYPE');
    expect(actual).toEqual(expected);
  });
});
