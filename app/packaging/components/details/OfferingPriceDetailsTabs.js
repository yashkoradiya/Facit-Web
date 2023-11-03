import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AgGridInfinite from '../../../components/AgGrid/AgGridInfinite';
import { Flexbox } from '../../../components/styled/Layout';
import { Tabs, Tab, TabText } from '../../../components/styled/Tabs';
import CustomTooltip from './CustomTooltip';
import { underOccupancyPriceColDefs } from './columnDefinitions/underOccupancyColumnDefinitions';
import { overOccupancyPriceColDefs } from './columnDefinitions/overOccupancyColumnDefinitions';
import { optionalItemsPriceColDefs } from './columnDefinitions/optionalItemsColumnDefinitions';

const tabs = {
  priceDetails: 'price-details',
  underOccupancy: 'under-occupancy',
  overOccupancy: 'over-occupancy',
  boardUpgrade: 'board-upgrade',
  optionalItems: 'optional-items'
};

export default function OfferingPriceDetailsTabs({
  baseGridKey,
  priceDetailsData,
  priceDetailsColDefs,
  underOccupancyData,
  overOccupancyData,
  boardUpgradeData,
  optionalItemsData,
  selectedCurrency,
  boardUpgradePriceDetailsColDefs
}) {
  
  const [currentTab, setCurrentTab] = useState(tabs.priceDetails);
  return (
    <React.Fragment>
      <Flexbox justifyContent="space-between" alignItems="flex-start" width="100%">
        <Tabs>
          <Tab isSelected={currentTab === tabs.priceDetails} onClick={() => setCurrentTab(tabs.priceDetails)}>
            <TabText>Price Details</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.underOccupancy} onClick={() => setCurrentTab(tabs.underOccupancy)}>
            <TabText>Under occ.</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.overOccupancy} onClick={() => setCurrentTab(tabs.overOccupancy)}>
            <TabText>Over occ.</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.boardUpgrade} onClick={() => setCurrentTab(tabs.boardUpgrade)}>
            <TabText>Board</TabText>
          </Tab>
          <Tab isSelected={currentTab === tabs.optionalItems} onClick={() => setCurrentTab(tabs.optionalItems)}>
            <TabText>Optional Items</TabText>
          </Tab>
        </Tabs>
      </Flexbox>
      {currentTab === tabs.priceDetails && (
        <AgGridInfinite
          dataSet={{
            data: priceDetailsData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={priceDetailsColDefs}
          agGridKey={`${baseGridKey}-price-details`}
          defaultColDef={{
            tooltipComponent: 'customTooltip'
          }}
          frameworkComponents={{ customTooltip: CustomTooltip }}
          disableSelection={true}
          gridOptions={{
            enableBrowserTooltips: true,
            stopEditingWhenGridLosesFocus: true,
            context: {
              currency: { selected: selectedCurrency }
            }
          }}
        />
      )}
      {currentTab === tabs.underOccupancy && (
        <AgGridInfinite
          dataSet={{
            data: underOccupancyData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={underOccupancyPriceColDefs({currency: selectedCurrency})}
          agGridKey={`${baseGridKey}-under-occupancy`}
          defaultColDef={{
            tooltipComponent: 'customTooltip'
          }}
          frameworkComponents={{ customTooltip: CustomTooltip }}
          disableSelection={true}
          gridOptions={{
            enableBrowserTooltips: true,
            context: {
              currency: { selected: selectedCurrency }
            }
          }}
        />
      )}
      {currentTab === tabs.overOccupancy && (
        <AgGridInfinite
          dataSet={{
            data: overOccupancyData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={overOccupancyPriceColDefs(selectedCurrency)}
          agGridKey={`${baseGridKey}-over-occupancy`}
          defaultColDef={{
            tooltipComponent: 'customTooltip'
          }}
          frameworkComponents={{ customTooltip: CustomTooltip }}
          disableSelection={true}
          gridOptions={{
            enableBrowserTooltips: true,
            context: {
              currency: { selected: selectedCurrency }
            }
          }}
        />
      )}
      {currentTab === tabs.boardUpgrade && (
        <AgGridInfinite
          dataSet={{
            data: boardUpgradeData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={boardUpgradePriceDetailsColDefs}
          agGridKey={`${baseGridKey}-board-upgrade`}
          defaultColDef={{
            tooltipComponent: 'customTooltip'
          }}
          frameworkComponents={{ customTooltip: CustomTooltip }}
          disableSelection={true}
          gridOptions={{
            enableBrowserTooltips: true,
            stopEditingWhenGridLosesFocus: true,
            context: {
              currency: { selected: selectedCurrency }
            }
          }}
        />
      )}
      {currentTab === tabs.optionalItems && (
        <AgGridInfinite
          dataSet={{
            data: optionalItemsData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={optionalItemsPriceColDefs}
          agGridKey={`${baseGridKey}-optional-items`}
          frameworkComponents={{ customTooltip: CustomTooltip }}
          disableSelection={true}
          gridOptions={{
            context: {
              currency: { selected: selectedCurrency }
            }
          }}
        />
      )}
    </React.Fragment>
  );
}
