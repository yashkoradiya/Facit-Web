import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import { Tabs, Tab, TabText } from 'components/styled/Tabs';
import { Flexbox, AgGridToolTip } from 'components/styled/Layout';
import { getAllotmentColumnDefinitions } from './columnDefinitions/allotmentColumnDefinition';
import { getChildCostColumnDefinitions } from './columnDefinitions/childCostColumnDefinition';
import { getMandatorySupplementCostColumnDefinitions } from './columnDefinitions/mandatorySupplementColumnDefinitions';
import { getAncillaryCostColumnDefinitions } from './columnDefinitions/ancillaryCostColumnDefinitions';
import { getDiscountColumnDefinitions } from './columnDefinitions/discountColumnDefinition';
import AccommodationComments from './components/AccommodationComments';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { getContractVersionColumnDefinitions } from './columnDefinitions/contractVersionColumnDefinition';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

const tabs = {
  childCost: 'child-cost',
  mandatorySupplement: 'mandatorySupplement',
  ancillary: 'ancillary',
  boardUpgrade: 'boardUpgrade',
  allotment: 'allotment',
  discount: 'discount',
  contractVersions: 'contractVersions',
  comments: 'comments'
};

export default function AdditionalCostsGrid({
  childCostData,
  allotmentData,
  mandatorySupplementData,
  ancillaryData,
  boardUpgradeData,
  discountData,
  contractVersionData,
  commentData,
  currency,
  readOnly,
  onUpdateComment,
  onDeleteComment,
  onAddComment,
  contractCurrency
}) {
  const [currentTab, setCurrentTab] = useState(tabs.childCost);
  const flattenedChildCostData = useMemo(() => sortByRoomCode(OriginalflattenData(childCostData, currency)), [
    childCostData,
    currency
  ]);
  const childCostColumnDefinitions = useMemo(() => getChildCostColumnDefinitions({ data: childCostData }), [
    childCostData
  ]);
  const flattenedMandatorySupplementCostData = useMemo(
    () => sortByRoomCode(flattenChildCostData(mandatorySupplementData, currency, contractCurrency)),
    [mandatorySupplementData, currency, contractCurrency]
  );

  const mandatorySupplementColumnDefinitions = useMemo(
    () =>
      getMandatorySupplementCostColumnDefinitions({
        data: mandatorySupplementData
      }),
    [mandatorySupplementData]
  );
  const flattenedAncillaryCostData = useMemo(() => sortByRoomCode(flattenChildCostData(ancillaryData, currency, contractCurrency)), [
    ancillaryData,
    currency,
    contractCurrency
  ]);
  const ancillaryColumnDefinitions = useMemo(
    () =>
      getAncillaryCostColumnDefinitions({
        data: ancillaryData
      }),
    [ancillaryData]
  );
  const flattenedBoardUpgradeCostData = useMemo(
    () => sortByRoomCode(flattenChildCostData(boardUpgradeData, currency, contractCurrency)),
    [boardUpgradeData, currency, contractCurrency]
  );
  const boardUpgradeColumnDefinitions = useMemo(
    () => getMandatorySupplementCostColumnDefinitions({ data: boardUpgradeData }),
    [boardUpgradeData]
  );
  const flattenedAllotmentData = useMemo(() => sortByRoomCode(flattenAllotment(allotmentData, currency)), [
    allotmentData,
    currency
  ]);
  const allotmentColumnDefinitions = useMemo(() => getAllotmentColumnDefinitions({ data: allotmentData }), [
    allotmentData
  ]);
  const discountColumnDefinitions = getDiscountColumnDefinitions();
  const contractVersionColumnDefinitions = getContractVersionColumnDefinitions();
  const agGridKey = useMemo(() => `${currency}`, [currency]);

  const handleContractVersionRowClicked = e => {
    if (!e.data) return null;
    const accommodationId = getPropertyValue(e.data, 'accommodationId');
    const definitionId = getPropertyValue(e.data, 'accommodationDefinitionId');
    const url = `/cost/accommodation/details/${accommodationId}/${definitionId}`;
    window.open(url, '_blank');
  };

  return (
    <React.Fragment>
      <Flexbox justifyContent="space-between" alignItems="flex-start" width="100%">
        <Tabs>
          <Tab isSelected={currentTab === tabs.childCost} onClick={() => setCurrentTab(tabs.childCost)}>
            <TabText>Child cost</TabText>
          </Tab>
          <Tab
            hasWarning={discountData.noCombinationsEnabled}
            isSelected={currentTab === tabs.discount}
            onClick={() => setCurrentTab(tabs.discount)}
          >
            <TabText>Discounts</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.boardUpgrade} onClick={() => setCurrentTab(tabs.boardUpgrade)}>
            <TabText>Board upgrade costs</TabText>
          </Tab>
          <Tab
            isSelected={currentTab === tabs.mandatorySupplement}
            onClick={() => setCurrentTab(tabs.mandatorySupplement)}
          >
            <TabText>Mandatory supplements</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.ancillary} onClick={() => setCurrentTab(tabs.ancillary)}>
            <TabText>Contracted acc. ancillaries</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.allotment} onClick={() => setCurrentTab(tabs.allotment)}>
            <TabText>Allotment</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.contractVersions} onClick={() => setCurrentTab(tabs.contractVersions)}>
            <TabText>Versions</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.comments} onClick={() => setCurrentTab(tabs.comments)}>
            <TabText>Comments ({commentData.length})</TabText>
          </Tab>
        </Tabs>
      </Flexbox>
      <div
        id="additional-costs-grid"
        style={{
          height: '300px'
        }}
        className="ag-theme-balham ag-line-break-header-names"
      >
        <AgGridToolTip width="auto" minHeight="auto" className={'tooltip-content'} />
        {currentTab === tabs.childCost && (
          <AgGridReact
            key={`child_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowData={flattenedChildCostData}
            columnDefs={childCostColumnDefinitions}
            gridOptions={{ suppressPropertyNamesCheck: true }}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.discount && (
          <React.Fragment>
            <AgGridReact
              key={`discount_cost_grid_${agGridKey}`}
              defaultColDef={{
                resizable: true,
                sortable: true
              }}
              gridOptions={{
                context: {
                  currency: { selected: currency }
                },
                suppressPropertyNamesCheck: true
              }}
              rowData={discountData.costs}
              columnDefs={discountColumnDefinitions}
              getContextMenuItems={getDefaultContextMenuItems}
            />
          </React.Fragment>
        )}
        {currentTab === tabs.boardUpgrade && (
          <AgGridReact
            key={`board_upgrade_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowData={flattenedBoardUpgradeCostData}
            columnDefs={boardUpgradeColumnDefinitions}
            gridOptions={{ suppressPropertyNamesCheck: true }}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.mandatorySupplement && (
          <AgGridReact
            key={`mandatory_supplement_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowData={flattenedMandatorySupplementCostData}
            columnDefs={mandatorySupplementColumnDefinitions}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.ancillary && (
          <AgGridReact
            key={`ancillary_cost_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowData={flattenedAncillaryCostData}
            columnDefs={ancillaryColumnDefinitions}
            gridOptions={{ suppressPropertyNamesCheck: true }}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.allotment && (
          <AgGridReact
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowData={flattenedAllotmentData}
            columnDefs={allotmentColumnDefinitions}
            gridOptions={{ suppressPropertyNamesCheck: true }}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.contractVersions && (
          <AgGridReact
            key={`contract_version_grid_${agGridKey}`}
            defaultColDef={{
              resizable: true,
              sortable: true
            }}
            rowSelection={'single'}
            onRowClicked={handleContractVersionRowClicked}
            rowData={contractVersionData}
            columnDefs={contractVersionColumnDefinitions}
            gridOptions={{ suppressPropertyNamesCheck: true }}
            getContextMenuItems={getDefaultContextMenuItems}
          />
        )}
        {currentTab === tabs.comments && (
          <AccommodationComments
            readOnly={readOnly}
            commentData={commentData}
            onUpdateComment={onUpdateComment}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
          ></AccommodationComments>
        )}
      </div>
    </React.Fragment>
  );
}

const flattenChildCostData = (data, currency, contractCurrency) => {
  return data.map(d => {
    const flattenedProperties = d.costPeriods.reduce((properties, periodCost) => {
      const from = moment(periodCost.from).format(getDateFormat());
      const to = moment(periodCost.to).format(getDateFormat());
      const key = `${from}_${to}`;
      if (d.valueType === 'Percentage')
        properties[key] = periodCost.cost.values[contractCurrency ?? 'EUR'];
      else
        properties[key] = periodCost.cost.values[currency];

      return properties;
    }, {});

    return { ...d, ...flattenedProperties };
  });
};

const OriginalflattenData = (data, currency) => {
  return data.map(d => {
    const flattenedProperties = d.costPeriods.reduce((properties, periodCost) => {
      const { daysOfWeek, from, to } = periodCost;
      const key = `${from}-${to}-${daysOfWeek}`;
      const value = periodCost.cost.values[currency];
      properties[key] = Math.ceil(value * 100) / 100;

      return properties;
    }, {});

    return { ...d, ...flattenedProperties };
  });
};


const flattenAllotment = data => {
  return data.map(d => {
    const flattenedProperties = d.allotmentPeriods.reduce((properties, period) => {
      const from = moment(period.from).format(getDateFormat());
      const to = moment(period.to).format(getDateFormat());
      const key = `${from}_${to}`;
      properties[key] = period.allotment;

      return properties;
    }, {});

    return { ...d, ...flattenedProperties };
  });
};

const sortByRoomCode = flattendData => {
  return flattendData.sort((a, b) => {
    if (a.roomCode > b.roomCode) return 1;
    if (a.roomCode < b.roomCode) return -1;

    return 0;
  });
};
