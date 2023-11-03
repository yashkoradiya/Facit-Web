import React from 'react';
import styled from 'styled-components';

export default function BaseRoomSelect({ intialValue, actionOption, onChange, baseRooms }) {
  return (
    <StyledSelect value={intialValue} onChange={onChange}>
      {!actionOption.showLast && <option value={actionOption.value}>{actionOption.text}</option>}
      {baseRooms.map(x => (
        <option value={x.roomTypeId} key={x.roomTypeId}>
          {x.roomCode}
        </option>
      ))}
      {actionOption.showLast && <option value={actionOption.value}>{actionOption.text}</option>}
    </StyledSelect>
  );
}

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
  width: 100%;
  height: 100%;
  padding-left: 7px;
  font-family: TuiType, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 12px;
`;
