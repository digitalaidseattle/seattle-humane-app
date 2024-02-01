import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

describe('Jest', () => {
  it('works', () => {
    render(<h1>Hello World</h1>)

    const testElement = screen.getByText('Hello World');

    expect(testElement).toHaveTextContent('Hello World');
  })
});