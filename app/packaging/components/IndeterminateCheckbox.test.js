import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IndeterminateCheckbox from './IndeterminateCheckbox';

let user;
 describe('IndeterminateCheckbox', () => {
    user = userEvent.setup();
  test('renders without errors', () => {
    render(<IndeterminateCheckbox />);
  });
   test('renders with correct initial checked state', () => {
    const { getByTestId } = render(<IndeterminateCheckbox checked="checked" />);
    const checkbox = getByTestId('indeterminate-check-box');
    expect(checkbox.checked).toBe(true);
  });
   test('renders with correct initial indeterminate state', () => {
    const { getByTestId } = render(<IndeterminateCheckbox checked="indeterminate" />);
    const checkbox = getByTestId('indeterminate-check-box');
    expect(checkbox.checked).toBe(false);
  });
   test('calls onChange callback when clicked', async() => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(<IndeterminateCheckbox onChange={onChangeMock} />);
    const checkbox = getByTestId('indeterminate-check-box');
    await user.click(checkbox);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});