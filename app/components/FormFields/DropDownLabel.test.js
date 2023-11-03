import React from 'react';
import { render, cleanup } from 'test-utils';
import userEvent from '@testing-library/user-event';
import DropDownLabel from './DropDownLabel';

afterEach(cleanup);

const mockOnChange = jest.fn();

let user;
describe('DropDownLabel', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  const defaultProps = {
    id: 'dropdown1',
    name: 'Dropdown Label',
    defaultValue: 'Option 1',
    errorMessage: 'Error message',
    items: [
      { key: 'Option 1', value: 'Option 1' },
      { key: 'Option 2', value: 'Option 2' },
      { key: 'Option 3', value: 'Option 3' }
    ],
    onChange: mockOnChange
  };

  it('should render the component correctly', () => {
    const screen = render(<DropDownLabel {...defaultProps} />);

    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();

    const dropdownMenu = screen.getByTestId('dropdown-menu');
    expect(dropdownMenu).toBeInTheDocument();
  });

  it('should call the onChange function when DropdownMenu value changes', async () => {
    const screen = render(<DropDownLabel {...defaultProps} />);

    const textfield = screen.getByTestId('dropdown-input');
    await user.click(textfield);
    const optionToSelect = screen.getAllByRole('option')[0];
    const dropdownMenu = screen.getByTestId('dropdown-menu');
    await user.selectOptions(dropdownMenu, optionToSelect.value);

    expect(mockOnChange).toHaveBeenCalled();
  });
});
