import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SandBox from './index';

let user;
describe('SandBox', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  function getFromToFields() {
    const textfields = screen.getAllByRole('textbox');

    const fromInput = textfields.find(field => field.value === '2019-01-01T00:00:00');
    const toInput = textfields.find(field => field.value === '2020-01-01T00:00:00');
    return { fromInput, toInput };
  }

  it('renders the component without errors', () => {
    render(<SandBox />);
    const sandBoxElement = screen.getByTestId('sandbox');
    expect(sandBoxElement).toBeInTheDocument();
  });

  it('updates the state when input values change', async () => {
    render(<SandBox />);
    const { fromInput, toInput } = getFromToFields();
    await user.clear(fromInput);
    await user.type(fromInput, '2022-01-01T00:00:00');

    await user.clear(toInput);
    await user.type(toInput, '2022-02-01T00:00:00');

    expect(fromInput).toHaveValue('2022-01-01T00:00:00');
    expect(toInput).toHaveValue('2022-02-01T00:00:00');
  });

  it('moves focus between input fields using arrow keys', async () => {
    render(<SandBox />);
    const { fromInput, toInput } = getFromToFields();

    // Press arrow down key
    fireEvent.keyDown(fromInput, { keyCode: 17 });
    fireEvent.keyDown(fromInput, { keyCode: 40 });
    const secondaryFromField = screen.getAllByRole('textbox').find(item => item.id === 'from');
    expect(secondaryFromField).toHaveFocus();

    // Press arrow right key
    fireEvent.keyDown(fromInput, { keyCode: 17 });
    fireEvent.keyDown(fromInput, { keyCode: 39 });
    expect(toInput).toHaveFocus();

    // Press arrow left key
    fireEvent.keyDown(toInput, { keyCode: 17 });
    fireEvent.keyDown(toInput, { keyCode: 37 });
    expect(fromInput).toHaveFocus();
  });

  it('adds a new data entry when the form is submitted', async () => {
    render(<SandBox />);
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.click(submitButton);
    await user.type(fromInput, '2022-01-01T00:00:00');
    await user.type(toInput, '2022-02-01T00:00:00');
  });

  it('deletes the corresponding data entry when "Delete" button is clicked', async () => {
    render(<SandBox />);
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(deleteButton);
  });
});
