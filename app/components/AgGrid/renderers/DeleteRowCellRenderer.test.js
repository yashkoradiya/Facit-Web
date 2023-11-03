import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import DeleteRowCellRenderer from './DeleteRowCellRenderer';

describe('DeleteRowCellRenderer', () => {
  const mockData = { id: 1, name: 'Test' };
  const onClickCB = jest.fn();

  it('should render the component and be able to click', async () => {
    const user = userEvent.setup();
    render(<DeleteRowCellRenderer disable={false} data={mockData} onClick={onClickCB} />);

    const iconButton = screen.getByTestId('clear-button');
    expect(iconButton).toBeInTheDocument();

    await user.click(iconButton);
    expect(onClickCB).toHaveBeenCalled();
  });
});
