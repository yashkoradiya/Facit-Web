import React from 'react';
import { render } from '@testing-library/react';
import Authenticating from './Authenticating';

describe('Authenticating', () => {
  it('should render error message', () => {
    const screen = render(<Authenticating status="error" />);

    expect(screen.getByText(/there was an error/i)).toBeInTheDocument();
  });
  it('should render authenticating message', () => {
    const screen = render(<Authenticating status="authenticating" />);

    expect(screen.getByText(/authenticating/i)).toBeInTheDocument();
  });
});
