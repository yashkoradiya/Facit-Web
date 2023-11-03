import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AgGridInfinite from '../../../components/AgGrid/AgGridInfinite';
import { Flexbox } from '../../../components/styled/Layout';
import { Tabs, Tab, TabText } from '../../../components/styled/Tabs';
import CustomTooltip from './CustomTooltip';
//import { premiumPriceColDefs } from './columnDefinitions/premiumColumnDefinitions';
//import { comfortPriceColDefs } from './columnDefinitions/comfortColumnDefinitions';
//import { overOccupancyPriceColDefs } from './columnDefinitions/overOccupancyColumnDefinitions';
import { optionalItemsPriceColDefs } from './columnDefinitions/optionalItemsColumnDefinitions';

const tabs = {
  priceDetails: 'price-details',
  premiumPriceDetails: 'premiumPrice-details',
  comfortPriceDetails: 'comfort-priceDetails',
  boardUpgrade: 'board-upgrade',
  optionalItems: 'optional-items'
};

export default function OfferingCharterFlightPriceDetailsTabs({
  baseGridKey,
  priceDetailsData,
  priceDetailsColDefs,
  premiumPriceDetailsData,
  comfortPriceDetailsData,
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
            <TabText>Economy</TabText>
          </Tab>
          <Tab
            isSelected={currentTab === tabs.premiumPriceDetails}
            onClick={() => setCurrentTab(tabs.premiumPriceDetails)}
          >
            <TabText>Premium</TabText>
          </Tab>
          <Tab
            isSelected={currentTab === tabs.comfortPriceDetails}
            onClick={() => setCurrentTab(tabs.comfortPriceDetails)}
          >
            <TabText>Comfort</TabText>
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
      {currentTab === tabs.premiumPriceDetails && (
        <AgGridInfinite
          dataSet={{
            data: premiumPriceDetailsData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={priceDetailsColDefs}
          agGridKey={`${baseGridKey}-premiumPrice-details`}
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
      {currentTab === tabs.comfortPriceDetails && (
        <AgGridInfinite
          dataSet={{
            data: comfortPriceDetailsData,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={priceDetailsColDefs}
          agGridKey={`${baseGridKey}-comfort-priceDetails`}
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
