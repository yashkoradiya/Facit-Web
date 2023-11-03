import React from 'react';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Index from './index';

afterEach(cleanup);

let user;
describe('PackagingSandbox', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders with default value "7" and displays the label "Duration"', () => {
    const { getByRole } = render(<Index />);
    const inputElement = getByRole('spinbutton');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(7);
  });

  it('updates the state value on user input', async () => {
    const { getByRole } = render(<Index />);
    const inputElement = getByRole('spinbutton');

    await user.clear(inputElement);
    await user.type(inputElement, '10');

    expect(inputElement).toHaveValue(10);
  });
});
