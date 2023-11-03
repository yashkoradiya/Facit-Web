import React from 'react';
import { render } from '@testing-library/react';
import PublishStatusCellRenderer from './PublishStatusCellRenderer';

const mockGetStatus = jest.fn(() => ({
  icon: 'mock-icon',
  text: 'Mock Text',
  color: 'mock-color',
}));

describe('PublishStatusCellRenderer', () => {
  it('renders the icon, text, and applies color correctly', () => {
    const { container, getByText } = render(
      <PublishStatusCellRenderer value="some-value" getStatus={mockGetStatus} />
    );

    // Check if the icon is rendered correctly
    const iconElement = container.querySelector('.material-icons');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.textContent).toBe('mock-icon');

    const textElement = getByText('Mock Text');
    expect(textElement).toBeInTheDocument();
    expect(iconElement).toHaveStyle('color: mock-color');
  });
});
