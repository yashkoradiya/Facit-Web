import React, { useState } from 'react';
import styled from 'styled-components';
import ModalBase from '../../../../components/ModalBase';
import { PrimaryButton, Button } from '../../../../components/styled/Button';
import {
  Flexbox,
  StickyResponsiveTableHeader,
  Gridbox,
  ResponsiveTableCell
} from '../../../../components/styled/Layout';
import { ContextMoneyLabel } from '../../../../components/MoneyLabels';
import BaseRoomSelect from '../components/BaseRoomSelect';

export function ManageBaseRoomModal({ show, onClose, onSave, data }) {
  const [baseRoomData, setBaseRoomData] = useState(sortData(data));

  const handleSetBaseRoom = (roomTypeId, target) => {
    if (target === 'isBaseRoom') return;

    let updatedBaseRoomData = [];

    if (target === 'setAsBaseRoom') {
      updatedBaseRoomData = setAsBaseRoom(roomTypeId, baseRoomData);
    } else {
      updatedBaseRoomData = setBaseRoom(roomTypeId, target, baseRoomData);
    }

    setBaseRoomData(sortData(updatedBaseRoomData));
  };

  const getBaseRoomSelect = roomType => {
    let baseRooms = baseRoomData.filter(x => x.isBaseRoom && x.unit === roomType.unit && x.stdOccupancy === roomType.stdOccupancy).sort(sortByRoomCode);
    baseRooms = roomType.isBaseRoom ? baseRooms.filter(x => (x.roomTypeId !== roomType.roomTypeId && x.roomTypeCategory == roomType.roomTypeCategory)) : (baseRooms.filter(x => x.roomTypeCategory == roomType.roomTypeCategory));
    const initialValue = roomType.isBaseRoom ? 'isBaseRoom' : roomType.baseRoomTypeId;
    const actionOption = roomType.isBaseRoom
      ? { value: 'isBaseRoom', text: 'Is base room' }
      : { value: 'setAsBaseRoom', text: 'Set as base room', showLast: true };

    return (
      <BaseRoomSelect
        intialValue={initialValue}
        onChange={e => handleSetBaseRoom(roomType.roomTypeId, e.target.value)}
        actionOption={actionOption}
        baseRooms={baseRooms}
      />
    );
  };

  return (
    <ModalBase show={show} onRequestClose={onClose} title={'Base room selection'} width="500px" height="auto">
      <Flexbox height="100%" direction="column" alignItems="flex-start" justifyContent="space-between">
        <Flexbox>
          <Gridbox
            style={{
              width: '100%',
              marginBottom: '5px',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}
            columnDefinition={'100px 100px auto 100px'}
            border
          >
            <StickyResponsiveTableHeader>Room ID</StickyResponsiveTableHeader>
            <StickyResponsiveTableHeader>Room type</StickyResponsiveTableHeader>
            <StickyResponsiveTableHeader>Base room</StickyResponsiveTableHeader>
            <StickyResponsiveTableHeader>Upgrade cost</StickyResponsiveTableHeader>
            {baseRoomData.map(x => {
              return (
                <React.Fragment key={x.roomTypeId}>
                  <BaseRoomTableCell isBaseRoom={x.isBaseRoom}>{x.roomTypeId}</BaseRoomTableCell>
                  <BaseRoomTableCell isBaseRoom={x.isBaseRoom}>{x.roomCode}</BaseRoomTableCell>
                  <BaseRoomTableCell isBaseRoom={x.isBaseRoom} noPadding={true}>
                    {getBaseRoomSelect(x)}
                  </BaseRoomTableCell>
                  <BaseRoomTableCell isBaseRoom={x.isBaseRoom}>
                    <ContextMoneyLabel values={x.upgradeCost.values} showCurrency={true} />
                  </BaseRoomTableCell>
                </React.Fragment>
              );
            })}
          </Gridbox>
        </Flexbox>
        <Flexbox alignSelf="flex-end">
          <PrimaryButton marginRight="10px" onClick={() => onSave(mapToInputModel(baseRoomData))}>
            Save base room selection
          </PrimaryButton>
          <Button onClick={onClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}

const mapToInputModel = data => {
  return data.reduce((total, current) => {
    const idx = total.findIndex(x => x.baseRoomId === current.baseRoomTypeId);
    if (idx === -1) {
      total.push({
        baseRoomId: current.baseRoomTypeId,
        supplementRoomIds: [current.roomTypeId]
      });
    } else {
      total[idx].supplementRoomIds.push(current.roomTypeId);
    }
    return total;
  }, []);
};

const setAsBaseRoom = (roomTypeId, baseRoomData) => {
  const idx = baseRoomData.findIndex(x => x.roomTypeId === roomTypeId);
  const roomType = baseRoomData[idx];

  roomType.isBaseRoom = true;
  roomType.baseRoomTypeId = roomType.roomTypeId;
  roomType.baseRoom = roomType.roomCode;
  roomType.upgradeCost.values = updateUpgradeCost(roomType, roomType);

  const updatedBaseRoomData = [...baseRoomData];
  updatedBaseRoomData[idx] = roomType;

  return updatedBaseRoomData;
};

const setBaseRoom = (roomTypeId, baseRoomId, baseRoomData) => {
  const idx = baseRoomData.findIndex(x => x.roomTypeId === roomTypeId);
  const roomType = baseRoomData[idx];

  const baseRoom = baseRoomData.find(x => x.roomTypeId === baseRoomId);

  roomType.baseRoomTypeId = baseRoom.roomTypeId;
  roomType.baseRoom = baseRoom.roomCode;
  roomType.isBaseRoom = false;
  roomType.upgradeCost.values = updateUpgradeCost(roomType, baseRoom);

  const updatedBaseRoomData = [...baseRoomData];
  updatedBaseRoomData[idx] = roomType;

  var supplementRooms = baseRoomData.filter(
    x => x.baseRoomTypeId === roomType.roomTypeId && x.roomTypeId !== roomTypeId
  );
  supplementRooms.forEach(x => {
    const supplementIdx = baseRoomData.findIndex(d => d.roomTypeId === x.roomTypeId);
    const supplementRoom = baseRoomData[supplementIdx];
    supplementRoom.baseRoomTypeId = baseRoom.roomTypeId;
    supplementRoom.baseRoom = baseRoom.roomCode;
    supplementRoom.upgradeCost.values = updateUpgradeCost(supplementRoom, baseRoom);

    updatedBaseRoomData[supplementIdx] = supplementRoom;
  });

  return updatedBaseRoomData;
};

const updateUpgradeCost = (roomType, baseRoom) => {
  return Object.keys(roomType.upgradeCost.values).reduce(
    (x, key) => ({
      ...x,
      [key]: roomType.averageCalculatedCost.values[key] - baseRoom.averageCalculatedCost.values[key]
    }),
    {}
  );
};

const sortData = data => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (a.baseRoomTypeId > b.baseRoomTypeId) return 1;
    if (a.baseRoomTypeId < b.baseRoomTypeId) return -1;

    if (!a.isBaseRoom && b.isBaseRoom) return 1;
    if (a.isBaseRoom && !b.isBaseRoom) return -1;

    if (a.roomCode > b.roomCode) return 1;
    if (a.roomCode < b.roomCode) return -1;

    return 0;
  });

  return sortedData;
};

const sortByRoomCode = (a, b) => {
  if (a.roomCode > b.roomCode) return 1;
  if (a.roomCode < b.roomCode) return -1;

  return 0;
};

const BaseRoomTableCell = styled(ResponsiveTableCell)`
  padding: ${props => (props.noPadding ? 0 : null)};
`;
