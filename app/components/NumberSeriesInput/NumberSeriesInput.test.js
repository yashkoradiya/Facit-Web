import React from 'react';
import { render, cleanup } from 'test-utils';
import NumberSeriesInput from './NumberSeriesInput';
import userEvent from '@testing-library/user-event';

let user;
describe('NumberSeriesInput', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(cleanup);
  const placeholderText = '0, 7, 14...';

  it('should render input', () => {
    const { getByPlaceholderText } = render(<NumberSeriesInput />);
    const input = getByPlaceholderText(placeholderText);

    expect(input).toBeInTheDocument();
  });

  it('should render label', () => {
    const { getByText } = render(<NumberSeriesInput label="lejböl" />);
    const label = getByText('lejböl');

    expect(label).toBeInTheDocument();
  });

  it('should render default numbers in input', () => {
    const { getByPlaceholderText } = render(<NumberSeriesInput defaultNumbers={[0, 7, 14, 21, 28]} />);
    const input = getByPlaceholderText(placeholderText);

    expect(input.value).toEqual('0, 7, 14, 21, 28');
  });

  it('should call onChange with input values', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), '0 , 2,5');

    expect(mockOnChange).toHaveBeenCalledWith([0, 2, 5]);
  });

  it('should render error message for negative values', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), '-1,2');

    expect(getByText(/invalid/i)).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('should render error message for non-numeric values', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), 'wasd,2');

    expect(getByText(/invalid/i)).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('should render error message for numbers without commas', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), '0, 7 24, 20');

    expect(getByText(/invalid/i)).toBeInTheDocument();
  });

  it('should not render error message for trailing commas', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, queryByText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), '0, 7, 24,');

    expect(queryByText(/invalid/i)).toBeNull();
    expect(mockOnChange).toHaveBeenCalledWith([0, 7, 24]);
  });

  it('should not render error message for trailing spaces', async () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, queryByText } = render(<NumberSeriesInput onChange={mockOnChange} />);

    await user.type(getByPlaceholderText(placeholderText), '0, 7, 24, ');

    expect(queryByText(/invalid/i)).toBeNull();
    expect(mockOnChange).toHaveBeenCalledWith([0, 7, 24]);
  });
});
