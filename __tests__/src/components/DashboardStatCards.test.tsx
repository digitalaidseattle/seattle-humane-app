import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardStatCards from '@components/DashboardStatCards';

// Mock the custom hooks
jest.mock('@hooks/useTicketsThisWeek', () => ({
  __esModule: true,
  default: () => [{ id: 1 }, { id: 2 }, { id: 3 }],
}));

jest.mock('@hooks/useAssignedCases', () => ({
  __esModule: true,
  default: () => [{ id: 1 }, { id: 2 }],
}));

describe('DashboardStatCards', () => {
  it('renders without crashing', () => {
    render(<DashboardStatCards />);
    expect(screen.getByText('New Assigned Cases')).toBeInTheDocument();
    expect(screen.getByText('New Cases This Week')).toBeInTheDocument();
  });

  it('displays correct number of new assigned cases', () => {
    render(<DashboardStatCards />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays correct number of new cases this week', () => {
    render(<DashboardStatCards />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<DashboardStatCards className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders correct icons', () => {
    render(<DashboardStatCards />);
    expect(screen.getByTestId('new-assigned-cases-icon')).toHaveClass('pi-inbox');
    expect(screen.getByTestId('new-cases-this-week-icon')).toHaveClass('pi-calendar');
  });
});