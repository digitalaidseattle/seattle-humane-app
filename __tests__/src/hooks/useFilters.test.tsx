import { filterByCreatedAt, passThroughFilter } from '@hooks/useFilters';

describe('useFilter hook', () => {
  const dates = ['1/1/2000', '1/2/2000', '3/1/2000', '1/1/2020', '12/12/2010'];

  it('passthrough filter always return true', () => {
    expect(passThroughFilter()).toBe(true);
  });

  it('exact date filter', () => {
    const date = '1/1/1999';
    const filter = { sign: '=', filterDate: date };
    expect(filterByCreatedAt(date, filter)).toBe(true);
    expect(filterByCreatedAt('1/1/2020', filter)).toBe(false);
  });

  it('dates after filter', () => {
    const expected = ['3/1/2000', '1/1/2020', '12/12/2010'];
    const filter = { sign: '>', filterDate: '2/20/2000' };
    const actual = dates.filter(d => filterByCreatedAt(d, filter));
    expect(actual.length).toBe(3);
    expect(actual).toEqual(expected);
  });

  it('dates before filter', () => {
    const expected = ['1/1/2000', '1/2/2000', '3/1/2000'];
    const filter = { sign: '<', filterDate: '1/1/2005' };
    const actual = dates.filter(d => filterByCreatedAt(d, filter));
    expect(actual.length).toBe(3);
    expect(actual).toEqual(expected);
  });

  it('return empty array when no dates match filter', () => {
    const beforeFilter = { sign: '<', filterDate: '1/1/1000' };
    const afterFilter = { sign: '>', filterDate: '1/1/3000' };
    const exactFilter  = { sign: '=', filterDate: '1/1/1000' };
    const actualBefore = dates.filter(d => filterByCreatedAt(d, beforeFilter));
    const actualExact = dates.filter(d => filterByCreatedAt(d, exactFilter));
    const actualAfter = dates.filter(d => filterByCreatedAt(d, afterFilter));
    const expected = [];
    expect(actualBefore).toEqual(expected);
    expect(actualExact).toEqual(expected);
    expect(actualAfter).toEqual(expected);
  });
});
