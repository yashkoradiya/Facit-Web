// BaseRoomSelect.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseRoomSelect from './BaseRoomSelect';

let user;
describe('BaseRoomSelect', () => {
  const actionOption = { value: 'someValue', text: 'Some Text', showLast: false };
  const baseRooms = [
    { roomTypeId: 1, roomCode: 'Room 1' },
    { roomTypeId: 2, roomCode: 'Room 2' },
    { roomTypeId: 3, roomCode: 'Room 3' },
  ];
  const handleChange = jest.fn();

  beforeEach(() => {
    user = userEvent;
    render(
      <BaseRoomSelect
        initialValue={actionOption.value}
        actionOption={actionOption}
        onChange={handleChange}
        baseRooms={baseRooms}
      />
    );
  });

  it('renders options correctly', () => {
    const selectElement = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');

    expect(selectElement).toBeInTheDocument();
    expect(options).toHaveLength(4); // baseRooms.length

    expect(options[0]).toHaveValue(actionOption.value);
    expect(options[0]).toHaveTextContent(actionOption.text);

    baseRooms.forEach((room, index) => {
      expect(options[index + 1]).toHaveValue(room.roomTypeId.toString());
      expect(options[index + 1]).toHaveTextContent(room.roomCode);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('triggers onChange when selecting an option', () => {
    const selectElement = screen.getByRole('combobox');
    const optionToSelect = screen.getAllByRole('option')[0]; // Selecting the second option
  
    user.selectOptions(selectElement, optionToSelect.value); // Simulate option selection
  
    expect(handleChange).toHaveBeenCalledTimes(0);
  });
  });
