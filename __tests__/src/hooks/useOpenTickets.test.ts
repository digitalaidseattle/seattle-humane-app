import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import useOpenTickets from '@hooks/useOpenTickets';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';
import { TicketStatus } from 'src/constants';

jest.mock('@services/DataService');

const openTicketId = MockAppConstants.status
  .find((({ value }) => value === TicketStatus.Open)).id;

it('returns the open tickets from the db', async () => {
  //* Arrange
  const mockOpenTickets = mockServiceRequestSummaries
    .filter((t) => t.status === openTicketId);
  //* Act
  const { result } = renderHook(useOpenTickets);
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  //* Assert
  /** Ensure there is actually enough mock test data to filter closed tickets from the rest */
  expect(mockServiceRequestSummaries.length).toBeGreaterThan(0);
  expect(mockOpenTickets.length).toBeGreaterThan(0);
  expect(mockOpenTickets.length).toBeLessThan(mockServiceRequestSummaries.length);
  mockOpenTickets.forEach((ticket) => { expect(result.current.data).toContainEqual(ticket); });
  /** Sanity check for sort */
  const firstTicket = result.current.data[0];
  const firstTicketTimestamp = new Date(firstTicket.created_at).valueOf();
  const lastTicket = result.current.data[result.current.data.length - 1];
  const lastTicketTimestamp = new Date(lastTicket.created_at).valueOf();
  expect(firstTicketTimestamp).toBeGreaterThan(lastTicketTimestamp);
});
