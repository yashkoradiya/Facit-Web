import React from 'react';
import { render } from 'test-utils';
import userEvent from '@testing-library/user-event';
import TimeRangeSelector from './TimeRangeSelector';

describe('TimeRangeSelector.test', () => {
  const hours = [
    { key: '00:00', value: '00:00' },
    { key: '01:00', value: '01:00' }
  ];

  it('should render selected values', async () => {
    const { findByPlaceholderText } = render(
      <TimeRangeSelector
        selectedFromTime="00:00"
        selectedToTime="01:00"
        hours={hours}
        onChange={() => {}}
      ></TimeRangeSelector>
    );
    expect(await findByPlaceholderText(/00:00/)).toBeInTheDocument();
    expect(await findByPlaceholderText(/01:00/)).toBeInTheDocument();
  });

  it('should update fromTime when selecting from time', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const { container, getByText } = render(
      <TimeRangeSelector hours={hours} onChange={mockOnChange}></TimeRangeSelector>
    );
    const lists = container.querySelectorAll('input');
    await user.click(lists[0]);
    await user.click(getByText('00:00'));
    expect(mockOnChange).toHaveBeenCalledWith('00:00', undefined);
  });

  it('should update toTime when selecting to time', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const { container, getByText } = render(
      <TimeRangeSelector hours={hours} onChange={mockOnChange}></TimeRangeSelector>
    );
    const lists = container.querySelectorAll('input');
    await user.click(lists[1]);
    await user.click(getByText('00:00'));
    expect(mockOnChange).toHaveBeenCalledWith(undefined, '00:00');
  });

  it('should clear from time and to time when clicking on clear', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const { getByRole, queryByPlaceholderText } = render(
      <TimeRangeSelector
        selectedFromTime="00:00"
        selectedToTime="01:00"
        hours={hours}
        onChange={mockOnChange}
      ></TimeRangeSelector>
    );
    await user.click(getByRole('button'));
    expect(mockOnChange).toHaveBeenCalledWith(null, null);
    expect(queryByPlaceholderText(/00:00/)).toBeNull();
    expect(queryByPlaceholderText(/01:00/)).toBeNull();
  });

  it('should disable the dropdowns when disabled is true', () => {
    const mockOnChange = jest.fn();
    const { container, getByRole } = render(
      <TimeRangeSelector hours={hours} onChange={mockOnChange} disabled={true}></TimeRangeSelector>
    );

    const lists = container.querySelectorAll('input');
    expect(lists[0]).toBeDisabled();
    expect(lists[1]).toBeDisabled();
    expect(getByRole('button')).toBeDisabled();
  });
});
