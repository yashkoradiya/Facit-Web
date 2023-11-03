import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingIndicator from './LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should not render when loading is false', () => {
    render(<LoadingIndicator loading={false} />);
    const loadingIndicator = screen.queryByTestId('loading-indicator');
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it('should render when loading is true', () => {
    render(<LoadingIndicator loading={true} />);
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
  });
});
