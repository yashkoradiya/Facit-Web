import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { ManageBaseRoomModal } from './modals/ManageBaseRoomModal';
import { Tabs, Tab, TabText } from '../../../components/styled/Tabs';
import { Flexbox, AgGridToolTip } from '../../../components/styled/Layout';
import { getOccupancyColumnDefinitions } from './columnDefinitions/OccupancyColumnDefinition';
import { getBaseCostColumnDefinitions } from './columnDefinitions/baseCostColumnDefinition';
import { getUnderOccupancyCostColumnDefinitions } from './columnDefinitions/underOccupancyColumnDefinition';
import { getOverOccupancyCostColumnDefinitions } from './columnDefinitions/overOccupancyColumnDefinition';
import settings from '../../../core/settings/settings';


const tabs = {
  cost: 'cost',
  occupancy: 'occupancy',
  underOccupancy: 'under-occupancy',
  overOccupancy: 'over-occupancy'
};

export default function AccommodationRoomTypeCostsGrid({
  costData,
  occupancyData,
  underOccupancyData,
  overOccupancyData,
  currency,
  onBaseRoomUpdate,
  readOnly
}) {
  const [showBaseRoomModal, setShowBaseRoomModal] = useState(false);
  const flattenedCostData = useMemo(() => OriginalflattenData(costData, currency), [costData, currency]);
  const columnDefinitions = useMemo(() => getBaseCostColumnDefinitions({ costData, currency }), [costData, currency]);
  const occupancySortedData = useMemo(() => sortData(occupancyData), [occupancyData]);
  const flattenedUnderOccupancyData = useMemo(() => OriginalflattenData(underOccupancyData, currency), [
    underOccupancyData,
    currency
  ]);
  const flattenedOverOccupancyData = useMemo(() => OriginalflattenData(overOccupancyData, currency), [
    overOccupancyData,
    currency
  ]);
  const baseRoomModalData = useMemo(() => getBaseRoomModalData(costData, occupancySortedData), [costData, occupancySortedData]);
  const [currentTab, setCurrentTab] = useState(tabs.cost);
  const gridOptions = useMemo(() => setGridOptions(currency), [currency]);
  const agGridKey = useMemo(() => `${currency}`, [currency]);

  if (!costData) return null;

  const handleSaveBaseRooms = data => {
    onBaseRoomUpdate(data);
    setShowBaseRoomModal(false);
  };

  return (
    <React.Fragment>
      <h4 style={{ marginTop: 0 }}>Room type base cost ({currency})</h4>
      <Flexbox justifyContent="space-between" alignItems="flex-start" width="100%">
        <Tabs>
          <Tab isSelected={currentTab === tabs.cost} onClick={() => setCurrentTab(tabs.cost)}>
            <TabText>Cost</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.occupancy} onClick={() => setCurrentTab(tabs.occupancy)}>
            <TabText>Occupancy</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.underOccupancy} onClick={() => setCurrentTab(tabs.underOccupancy)}>
            <TabText>Under occupancy</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.overOccupancy} onClick={() => setCurrentTab(tabs.overOccupancy)}>
            <TabText>Over occupancy</TabText>
          </Tab>
        </Tabs>
      </Flexbox>

      <div
        id="accommodation-roomtype-costs-grid"
        style={{
          height: '300px',
          marginBottom: '14px'
        }}
        className="ag-theme-balham ag-line-break-header-names"
      >
        <AgGridToolTip width="auto" minHeight="auto" className={'tooltip-content'} />
        {currentTab === tabs.cost && (
          <AgGridReact
            key={`room_type_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            gridOptions={gridOptions}
            rowData={flattenedCostData}
            columnDefs={columnDefinitions}
            getContextMenuItems={params =>
              getContextMenuItems(params, {
                onManageBaseRoomClick: () => setShowBaseRoomModal(true),
                disabled: readOnly
              })
            }
          />
        )}
        {currentTab === tabs.occupancy && (
          <AgGridReact
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            gridOptions={gridOptions}
            rowData={occupancySortedData}
            columnDefs={getOccupancyColumnDefinitions()}
            getContextMenuItems={params =>
              getContextMenuItems(params, {
                onManageBaseRoomClick: () => setShowBaseRoomModal(true),
                disabled: readOnly
              })
            }
          />
        )}
        {currentTab === tabs.underOccupancy && (
          <AgGridReact
            key={`under_occ_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            gridOptions={{ ...gridOptions, suppressPropertyNamesCheck: true }}
            rowData={flattenedUnderOccupancyData}
            getContextMenuItems={getDefaultContextMenuItems}
            columnDefs={getUnderOccupancyCostColumnDefinitions({ data: flattenedUnderOccupancyData })}
          />
        )}
        {currentTab === tabs.overOccupancy && (
          <AgGridReact
            key={`over_occ_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            gridOptions={{ ...gridOptions, suppressPropertyNamesCheck: true }}
            rowData={flattenedOverOccupancyData}
            getContextMenuItems={getDefaultContextMenuItems}
            columnDefs={getOverOccupancyCostColumnDefinitions({ data: flattenedOverOccupancyData })}
          />
        )}
      </div>
      <ManageBaseRoomModal
        show={showBaseRoomModal}
        data={baseRoomModalData}
        onClose={() => setShowBaseRoomModal(false)}
        onSave={handleSaveBaseRooms}
      />
    </React.Fragment>
  );
}

const setGridOptions = currency => {
  return {
    context: {
      currency: { selected: currency }
    },
    getRowClass: params => {
      if (!params.data) {
        return null;
      }
      if (params.data.isBaseRoom && settings.SHOW_BASEROOMS) return;
    }
  };
};

const getContextMenuItems = (params, props) => {
  const field = params.column && params.column.colDef.field;
  var options = getDefaultContextMenuItems(params);

  if (settings.SHOW_BASEROOMS) {
    options.unshift({
      name: 'Manage base room selection..',
      action: () => {
        props.onManageBaseRoomClick();
      },
      disabled: props.disabled
    });
  }

  if (field === 'upgradeCost') {
    options.unshift({
      name: 'Manage minimum upgrade cost..',
      action: () => {
        console.log('Manage minimum upgrade cost');
      },
      disabled: true
    });
  }

  return options;
};

const getBaseRoomModalData = (data, occupancySortedData) => {
  let baseRoomToBeMappedWithOccupany = data;
  let occupancyDataToBeCompared = occupancySortedData;
  baseRoomToBeMappedWithOccupany.forEach((room) => {
    var roomOccupancyResult = occupancyDataToBeCompared.filter(occ => occ.roomCode === room.roomCode);
    if (roomOccupancyResult !== undefined && roomOccupancyResult[0] !== undefined) {
      if (room.unit === "PUPN") {
        room.stdOccupancy = roomOccupancyResult[0].nomOverride;
      }
      else {
        room.stdOccupancy = roomOccupancyResult[0].nom;
      }
    }
  });
  return baseRoomToBeMappedWithOccupany.map(roomType => {
    return {
      roomTypeId: roomType.id,
      roomCode: roomType.roomCode,
      baseRoomTypeId: roomType.baseRoomTypeId,
      baseRoom: roomType.baseRoom,
      isBaseRoom: roomType.isBaseRoom,
      upgradeCost: roomType.upgradeCost,
      roomTypeCategory: roomType.roomTypeCategory,
      averageCalculatedCost: roomType.averageCalculatedCost,
      unit: roomType.unit,
      stdOccupancy: roomType.stdOccupancy
    };
  });
};

const OriginalflattenData = (data, currency) => {
  const flattenedData = data.map(d => {
    const flattenedProperties = d.costPeriods.reduce((properties, periodCost) => {
      const { daysOfWeek, from, to } = periodCost;
      const key = `${from}-${to}-${daysOfWeek}`;
      const value = periodCost.cost.values[currency];
      properties[key] = Math.ceil(value * 100) / 100;


      return properties;
    }, {});

    return {
      ...d,
      ...flattenedProperties
    };
  });
  return sortData(flattenedData);
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
