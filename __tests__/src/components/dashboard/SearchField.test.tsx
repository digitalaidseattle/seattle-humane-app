import SearchField from '@components/dashboard/SearchField';
import { TicketSearchContext, TicketSearchProvider } from '@context/dashboard/ticketSearchContext';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';

function TestSearchContextOutput() {
  const search = useContext(TicketSearchContext);
  return (
    <span aria-label="test-output">
      Output:
      {' '}
      {search}
    </span>
  );
}

describe('<SearchField />', () => {
  it('should render an input field', () => {
    // Arrange
    const screen = render(
      <TicketSearchProvider>
        <SearchField />
      </TicketSearchProvider>,
    );
    const inputField = screen.getByRole('textbox', { name: 'search' });
    // Assert
    expect(inputField).toBeInTheDocument();
    expect(inputField).toBeEnabled();
  });

  it('should update the search box and context when clicking submit', async () => {
    // Arrange
    const user = userEvent.setup();
    const screen = render(
      <TicketSearchProvider>
        <SearchField />
        <TestSearchContextOutput />
      </TicketSearchProvider>,
    );
    const inputField = screen.getByRole('textbox', { name: 'search' });
    const submitButton = screen.getByRole('button', { name: 'submit search' });
    const outputElement = screen.getByText(/Output:$/);
    // Act
    await user.type(inputField, 'Sparky surgery');
    await user.click(submitButton);
    // Assert
    expect(inputField).toHaveValue('Sparky surgery');
    expect(outputElement).toHaveTextContent(/Output: Sparky surgery$/);
  });

  it('should update the search box and context when pressing enter', async () => {
    // Arrange
    const user = userEvent.setup();
    const screen = render(
      <TicketSearchProvider>
        <SearchField />
        <TestSearchContextOutput />
      </TicketSearchProvider>,
    );
    const outputElement = screen.getByText(/Output:$/);
    const inputField = screen.getByRole('textbox', { name: 'search' });
    // Act
    await user.type(inputField, 'Sparky surgery');
    await user.keyboard('[Enter]');
    // Assert
    expect(inputField).toHaveValue('Sparky surgery');
    expect(outputElement).toHaveTextContent(/Output: Sparky surgery$/);
  });

  it('should clear the search box and context when clear is pressed', async () => {
    // Arrange
    const user = userEvent.setup();
    const screen = render(
      <TicketSearchProvider>
        <SearchField />
        <TestSearchContextOutput />
      </TicketSearchProvider>,
    );
    const outputElement = screen.getByText(/Output:$/);
    const inputField = screen.getByRole('textbox', { name: 'search' });
    const submitButton = screen.getByRole('button', { name: 'submit search' });
    const clearButton = screen.getByRole('button', { name: 'clear search' });
    // Act
    await user.type(inputField, 'Sparky surgery');
    await user.click(submitButton);
    await user.click(clearButton);
    // Assert
    expect(inputField).toHaveValue('');
    expect(outputElement).toHaveTextContent(/Output:$/);
  });
});
