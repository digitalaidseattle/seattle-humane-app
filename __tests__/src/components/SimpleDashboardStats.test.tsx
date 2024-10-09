import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SampleDashboardStats from '@components/SampleDashbordStats';
import useMyTickets from '@hooks/useMyTickets';
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';

jest.mock('@hooks/useMyTickets');
jest.mock('@hooks/useTicketsThisWeek');

describe('SampleDashboardStats Component', () => {
  it('test_render_my_newly_assigned_cases', () => {
    (useMyTickets as jest.Mock).mockReturnValue({ data: [{}, {}, {}] });
    (useTicketsThisWeek as jest.Mock).mockReturnValue([]);

    const { getByText } = render(<SampleDashboardStats />);
    expect(getByText('3')).toBeInTheDocument();
  });

  it('test_render_new_cases_this_week', () => {
    (useMyTickets as jest.Mock).mockReturnValue({ data: [] });
    (useTicketsThisWeek as jest.Mock).mockReturnValue([{}, {}, {}, {}]);

    const { getByText } = render(<SampleDashboardStats />);
    expect(getByText('4')).toBeInTheDocument();
  });

  it('test_handle_empty_my_tickets_data', () => {
    (useMyTickets as jest.Mock).mockReturnValue({ data: [] });
    (useTicketsThisWeek as jest.Mock).mockReturnValue([{}]);

    const { getByText } = render(<SampleDashboardStats />);
    expect(getByText('0')).toBeInTheDocument();
  });
  it('test_handle_empty_tickets_this_week_data', () => {
    (useMyTickets as jest.Mock).mockReturnValue({ data: [{}] });
    (useTicketsThisWeek as jest.Mock).mockReturnValue([]);

    const { getByText } = render(<SampleDashboardStats />);
    expect(getByText('0')).toBeInTheDocument();
  });
});
