import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import LinkWithClickHandlerCellRenderer from './LinkWithClickHandlerCellRenderer';

describe('LinkWithClickHandlerCellRenderer', () => {
  const mockData = { id: 1 };
  const mockHandler = jest.fn();

  it('should render the link button and be able to click it', async () => {
    const user = userEvent.setup();
    const linkText = 'Link';
    render(<LinkWithClickHandlerCellRenderer value={{ name: linkText, handler: mockHandler }} data={mockData} />);

    const link = screen.getByText(linkText);
    expect(link).toBeInTheDocument();
    await user.click(link);
    expect(mockHandler).toHaveBeenCalled();
  });
});
