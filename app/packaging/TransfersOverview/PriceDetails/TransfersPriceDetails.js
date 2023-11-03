import React, { useEffect, useReducer, useCallback } from 'react';
import { Content } from 'components/styled/Content';
import { Flexbox } from 'components/styled/Layout';
import { v4 as uuidv4 } from 'uuid';
import ChartTile from '../../ChartTile/ChartTile';
import Options from './Options';
import { useSelector } from 'react-redux';
import PricesGraph from '../../PricesGraph/PricesGraph';
import DateRangeSelector from 'packaging/components/details/DateRangeSelector';
import { Button } from 'components/styled/Button';
import moment from 'moment';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import CustomTooltip from 'packaging/components/details/CustomTooltip';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import PriceDetailToolTipRenderer from 'components/AgGrid/renderers/PriceDetailTooltipRenderer';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';
import { MoneyComparator } from 'components/AgGrid/comparators';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import ExportToExcel from 'packaging/components/ExportToExcel';
import { ruleTypes } from 'pricing/rules/ruleConstants';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import PropTypes from 'prop-types';
import { filterDatasetsByAgeCategory, getDatesFromRange, getMinMaxDate } from 'packaging/packaging-utils';

TransfersPriceDetails.propTypes = {
  datasets: PropTypes.array.isRequired,
  onDatasetUpdate: PropTypes.func.isRequired,
  priceDetails: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired
};

TransfersPriceDetails.defaultProps = {
  datasets: [],
  onDatasetUpdate: () => null,
  priceDetails: [],
  onRefresh: () => null
};

const gridKey = 'TransfersPricingDetailsGrid';

const actionConstants = {
  setSelectedDates: 'setSelectedDates',
  setSelectedPriceDetails: 'setSelectedPriceDetails',
  setSelectedChartIds: 'setSelectedChartIds',
  setAgeCategorySelections: 'setAgeCategorySelections',
  onClearDates: 'onClearDates'
};

const initialState = {
  selectedDates: [],
  selectedPriceDetails: [],
  selectedChartIds: [],
  ageCategorySelections: { adult: true, child: true, infant: true }
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionConstants.setSelectedDates:
      return { ...state, selectedDates: action.payload };
    case actionConstants.setSelectedPriceDetails:
      return { ...state, selectedPriceDetails: action.payload };
    case actionConstants.setSelectedChartIds:
      return { ...state, selectedChartIds: action.payload };
    case actionConstants.setAgeCategorySelections:
      return { ...state, ageCategorySelections: action.payload };
    case actionConstants.onClearDates:
      return { ...action.payload };
  }
};

export default function TransfersPriceDetails(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedCurrency = useSelector(reduxState => reduxState.appState.selectedCurrency);

  useEffect(() => {
    setChartIds();
  }, [props.datasets, setChartIds]);

  const setChartIds = useCallback(() => {
    const chartIds = [...state.selectedChartIds];

    props.datasets.forEach(item => {
      if (!state.selectedChartIds?.some(chart => chart.key === item.key)) {
        chartIds.push({ key: item.key, selected: item.selected });
      }
    });
    dispatch({ type: actionConstants.setSelectedChartIds, payload: chartIds });
  }, [props.datasets, state.selectedChartIds]);

  const onDateRangeSelected = (selectedDateRanges, selectedWeekdays) => {
    let calculatedDays = selectedDateRanges.flatMap(range => getDatesFromRange(range.from, range.to));
    if (selectedWeekdays && selectedWeekdays.size > 0) {
      calculatedDays = calculatedDays.filter(date => selectedWeekdays.some(day => day === moment(date).format('dd')));
    }

    const updatedDates = selectedDates
      .concat(calculatedDays)
      .filter((date, i, self) => self.findIndex(d => d.getTime() === date.getTime()) === i);

    dispatch({ type: actionConstants.setSelectedDates, payload: updatedDates });
  };

  useEffect(() => {
    // Creating a callback for updating selected price details when selectedDates change,
    // Since, updating the selectedPriceDetails from here would require
    // parameters as dependencies.
    updateSelectedPriceDetails(props.priceDetails);
  }, [props.priceDetails, state.selectedDates, updateSelectedPriceDetails]);

  const updateSelectedPriceDetails = useCallback(
    priceData => {
      dispatch({
        type: actionConstants.setSelectedPriceDetails,
        payload: getUpdatedSelectedPriceDetails(priceData, state.selectedDates, state.ageCategorySelections)
      });
    },
    [state.selectedDates, state.ageCategorySelections]
  );

  const onTileSelected = key => {
    const updatedChartIds = selectedChartIds.map(x => (x.key === key ? { ...x, selected: !x.selected } : x));
    dispatch({ type: actionConstants.setSelectedChartIds, payload: updatedChartIds });

    const updatedDatasets = datasets.map(item => ({
      ...item,
      selected: updatedChartIds.some(chart => chart.key === item.key && chart.selected)
    }));
    const tileFilters = updatedDatasets
      .filter(x => x.selected)
      .map(x => {
        return {
          sourceMarket: x.metadata.sourceMarketName,
          ageCategoryType: x.metadata.ageCategoryType,
          salableUnitId: x.metadata.salableUnitId,
          unitType: x.metadata.unitType
        };
      });

    dispatch({
      type: actionConstants.setSelectedPriceDetails,
      payload: getUpdatedSelectedPriceDetails(priceDetails, selectedDates, ageCategorySelections, tileFilters)
    });
    props.onDatasetUpdate(updatedDatasets);
  };

  const onAgeCategoryChange = (key, show) => {
    const updatedAgeCategorySelection = { ...ageCategorySelections, [key]: show };
    dispatch({ type: actionConstants.setAgeCategorySelections, payload: updatedAgeCategorySelection });
    dispatch({
      type: actionConstants.setSelectedPriceDetails,
      payload: getUpdatedSelectedPriceDetails(priceDetails, selectedDates, updatedAgeCategorySelection)
    });
  };

  const onClearDates = () => {
    dispatch({ type: actionConstants.onClearDates, payload: { ...state, selectedDates: [], selectedPriceDetails } });
  };

  const { datasets, priceDetails, onRefresh } = props;
  if (!datasets?.length) {
    return null;
  }

  const { selectedDates, selectedPriceDetails, selectedChartIds, ageCategorySelections } = state;

  return (
    <Content height="auto">
      <Flexbox direction={'column'} width="100%">
        <h1 style={{ alignSelf: 'flex-start', marginTop: 0 }}>Transfer Pricing Details ({selectedCurrency})</h1>
        <Flexbox width="inherit" justifyContent="space-between" marginBottom={'16px'}>
          <ChartTile
            onTileSelected={onTileSelected}
            selectedChartIds={selectedChartIds}
            items={filterDatasetsByAgeCategory(datasets, ageCategorySelections)}
          />
          <Options
            ageCategorySelections={ageCategorySelections}
            onAgeCategoryChange={onAgeCategoryChange}
            onRefresh={() => {
              dispatch({ type: actionConstants.setSelectedDates, payload: [] });
              onRefresh();
            }}
          />
        </Flexbox>
        <PricesGraph
          type="transfers"
          datasets={filterDatasetsByAgeCategory(datasets, ageCategorySelections)}
          selectedDates={selectedDates}
          selectedCurrency={selectedCurrency}
          selectedChartIds={selectedChartIds}
        />
        {!!priceDetails.length && (
          <Flexbox width="inherit" justifyContent="space-between" marginBottom={'16px'}>
            <Flexbox>
              <DateRangeSelector
                minDate={getMinMaxDate(priceDetails, 'min')}
                maxDate={getMinMaxDate(priceDetails, 'max')}
                onDateRangeSelected={onDateRangeSelected}
                pageType="transfer-price-details"
              />
              <Button marginTop="18px" onClick={onClearDates}>
                Clear dates
              </Button>
            </Flexbox>
            <div>
              <ExportToExcel
                data={selectedPriceDetails}
                columnDefinitions={getPriceDetailsColDefs({ currency: selectedCurrency })}
                currency={selectedCurrency}
              />
            </div>
          </Flexbox>
        )}

        <AgGridInfinite
          agGridKey={gridKey}
          dataSet={{
            data: selectedPriceDetails,
            dataSetKey: uuidv4()
          }}
          columnDefinitions={getPriceDetailsColDefs({ currency: selectedCurrency })}
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
      </Flexbox>
    </Content>
  );
}

const getUpdatedSelectedPriceDetails = (priceDetails, selectedDates, ageCategory, tileFilters) => {
  const updatedData = [];
  selectedDates.forEach(date => {
    let currentData = priceDetails.filter(
      x =>
        String(
          new Date(x.date).getDate() + '-' + new Date(x.date).getMonth() + '-' + new Date(x.date).getFullYear()
        ) ===
        date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
    );

    if (currentData) {
      if (tileFilters) {
        currentData = currentData.filter(item =>
          tileFilters.some(tile => {
            return tile.sourceMarket === item.sourceMarket && tile.ageCategoryType === item.ageCategoryType;
          })
        );
      }
      if (!ageCategory.adult) {
        currentData = currentData.filter(x => x.ageCategoryType !== 'Adult');
      }
      if (!ageCategory.child) {
        currentData = currentData.filter(x => !x.ageCategoryType?.toLowerCase().startsWith('child'));
      }
      if (!ageCategory.infant) {
        currentData = currentData.filter(x => x.ageCategoryType !== 'Infant');
      }
      updatedData.push(...currentData);
    }
  });
  return updatedData;
};

const getPriceDetailsColDefs = options => [
  {
    field: 'productType',
    headerName: 'Product type',
    width: 120,
    valueGetter: srcData => (srcData.data ? srcData.data.productType : null)
  },
  {
    field: 'sourceMarket',
    tooltipField: 'sourceMarket',
    headerName: 'SM',
    width: 50
  },
  {
    field: 'date',
    headerName: 'Date',
    cellRenderer: DateCellRenderer,
    width: 100
  },
  {
    headerName: 'Unit type',
    field: 'unitType',
    width: 80
  },
  {
    headerName: 'Day',
    field: 'weekday',
    width: 60
  },
  {
    headerName: 'Age Category',
    field: 'ageCategoryType',
    width: 105
  },
  {
    headerName: 'Cost',
    field: 'transferCost',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Distr. cost',
    field: 'distributionCost',
    type: 'numericColumn',
    width: 91,
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'distributionCost'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: [ruleTypes.transferDistributionCost],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('distributionCost', options.currency)
  },
  {
    headerName: 'VAT',
    field: 'vat',
    type: 'numericColumn',
    width: 135,
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'vat'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: [ruleTypes.transferVat],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('vat', options.currency)
  },
  {
    headerName: 'Margin',
    field: 'margin',
    type: 'numericColumn',
    width: 135,
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'margin'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: [ruleTypes.transferMarginComponent],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('margin', options.currency)
  },
  {
    field: 'transferPrice',
    headerName: 'Price',
    type: 'numericColumn',
    width: 135,
    valueGetter: (cell, customField) => {
      const value = contextCurrencyValueGetter(cell, customField);

      if (value) {
        return Math.ceil(value);
      }
      return value;
    },
    cellRendererParams: {
      displayValueGetter: params => params.value,
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('price', options.currency)
  }
];
