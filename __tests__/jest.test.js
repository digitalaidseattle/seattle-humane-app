import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

// This test exists only to verify that your Jest setup is working
describe('Jest', () => {
  it('works', () => {
    render(<h1>Hello World</h1>)

    const testElement = screen.getByText('Hello World');

    expect(testElement).toHaveTextContent('Hello World');
  })
});