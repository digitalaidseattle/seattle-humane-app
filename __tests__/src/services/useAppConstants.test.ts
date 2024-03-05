import React from 'react';
import { useAppConstants } from '../../../src/services/useAppConstants';
import supabaseClient from '../../../utils/supabaseClient';

describe('useAppConstants tests', () => {

    const mockFilterBuilder = {
        eq: jest.fn(() => Promise.resolve({}))
    };

    const mockQueryBuilder = {
        select: jest.fn(() => Promise.resolve({})),
    };

    it('use', async () => {
        const constant1 = [{ type: 'TYPE', value: 'val', label: 'label' }]
        const response = { data: constant1 }
        const expected = [{ type: 'TYPE', value: 'vOut', label: 'lOut' }];

        const useStateStatusMock: any = () => ['STATUS', jest.fn()];
        const useStateDataMock: any = () => [expected, jest.fn((data: any) =>
            expect(data).toEqual(constant1)
        )];
        const useStateSpy = jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(useStateStatusMock)
            .mockImplementationOnce(useStateDataMock)

        jest.spyOn(React, 'useEffect').mockImplementation((f) => f());


        const fromSpy = jest.spyOn(supabaseClient, "from")
            .mockReturnValue(mockQueryBuilder as any)
        const selectSpy = jest.spyOn(mockQueryBuilder, "select")
            .mockReturnValue(Promise.resolve(response))


        const { data: actual, status } = useAppConstants('TYPE')
        expect(fromSpy).toHaveBeenCalledWith('app_constants')
        expect(selectSpy).toHaveBeenCalled()
        expect(actual).toEqual(expected)
        expect(status).toEqual('STATUS')
    });

})
