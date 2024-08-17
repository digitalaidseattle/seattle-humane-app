import '@testing-library/jest-dom';
import {
  render,
  renderHook,
  waitFor,
  cleanup,
} from '@testing-library/react';
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';

afterEach(cleanup);

jest.mock('@services/DataService');

describe('Dashboard', () => {
  it('renders without crashing', () => {
    // need to implement
  });
  describe('New Cases This Week', () => {
    it('should have the right content', async () => {
      // Act
      const { result } = renderHook(() => useTicketsThisWeek());

      // Arrange
      const { getByText } = render(
        <div>
          <span className="block text-500 font-medium mb-3">
            New Cases This Week
          </span>
          <div className="text-900 font-medium text-xl">
            {result.current.length}
          </div>
        </div>,
      );
      // Assert
      await waitFor(() => {
        expect(getByText('New Cases This Week')).toBeInTheDocument();
        expect(getByText(result.current.length)).toBeInTheDocument();
      });
    });
  });
});
