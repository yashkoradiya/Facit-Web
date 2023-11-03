import React from 'react';
import { render, cleanup } from 'test-utils';
import userEvent from '@testing-library/user-event';
import DiscountCombinabilityGroup from './DiscountCombinabilityGroup';

afterEach(cleanup);

let user;
describe('DiscountCombinabilityGroup', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should render checkboxes with correct labels', () => {
    const combinations = [
      { id: 1, discountName: 'Discount 1', enabled: true },
      { id: 2, discountName: 'Discount 2', enabled: false }
    ];

    const screen = render(<DiscountCombinabilityGroup combinations={combinations} />);

    const discount1Checkbox = screen.getByText(/discount 1/i);

    expect(discount1Checkbox).toBeInTheDocument();
  });

  it('should call onChange with the updated combinations when a checkbox is clicked', async () => {
    const combinations = [
      { id: 1, discountName: 'Discount 1', enabled: true },
      { id: 2, discountName: 'Discount 2', enabled: false }
    ];

    const mockOnChange = jest.fn();

    const screen = render(<DiscountCombinabilityGroup combinations={combinations} onChange={mockOnChange} />);

    const discount1Checkbox = screen.getByText(/discount 1/i);

    await user.click(discount1Checkbox);
    expect(mockOnChange).toHaveBeenCalledWith([
      { id: 1, discountName: 'Discount 1', enabled: false },
      { id: 2, discountName: 'Discount 2', enabled: false }
    ]);
  });
});
