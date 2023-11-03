import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CostCurrencyToggle from './CostCurrencyToggle';

let user;
const mockOnDisplayCurrencyChanged = jest.fn();

describe('CostCurrencyToggle', () => {
  beforeEach(() => {
    user = userEvent.setup();
    mockOnDisplayCurrencyChanged.mockReset();
  });

  it('renders the component with selected currency displayed', () => {
    const selectedCurrency = 'USD';
    const contractCurrency = 'USD';

    render(
      <CostCurrencyToggle
        selectedCurrency={selectedCurrency}
        contractCurrency={contractCurrency}
        onDisplayCurrencyChanged={mockOnDisplayCurrencyChanged}
      />
    );

    const visibilityIcon = screen.getByTitle('Contract currency is already displayed');
    expect(visibilityIcon).toBeInTheDocument();
  });

  it('renders the component with contract currency displayed', () => {
    const selectedCurrency = 'USD';
    const contractCurrency = 'EUR';

    render(
      <CostCurrencyToggle
        selectedCurrency={selectedCurrency}
        contractCurrency={contractCurrency}
        onDisplayCurrencyChanged={mockOnDisplayCurrencyChanged}
      />
    );

  });

  it('should toggle display currency when clicked', async () => {
    const selectedCurrency = 'USD';
    const contractCurrency = 'EUR';

    render(
      <CostCurrencyToggle
        selectedCurrency={selectedCurrency}
        contractCurrency={contractCurrency}
        onDisplayCurrencyChanged={mockOnDisplayCurrencyChanged}
      />
    );

    // Ensure the toggle button is visible
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();

    // Simulate clicking the toggle button
    await user.click(toggleButton);

    // Check if the onDisplayCurrencyChanged function is called with the correct currency
    expect(mockOnDisplayCurrencyChanged).toHaveBeenCalledTimes(1);
    expect(mockOnDisplayCurrencyChanged).toHaveBeenCalledWith(contractCurrency);
  });
});
