import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { Content } from 'components/styled/Content';
import { Flexbox } from 'components/styled/Layout';
import { useSelector } from 'react-redux';
import PackageDetailsFilters from './PackageDetailsFilters';
import ChartTile from 'packaging/ChartTile/ChartTile';
import OfferingPriceDetailsTabs from 'packaging/components/details/OfferingPriceDetailsTabs';
import PricesGraph from 'packaging/PricesGraph/PricesGraph';
import DateRangeSelector from 'packaging/components/details/DateRangeSelector';
import moment from 'moment';
import { Button, PrimaryButton } from 'components/styled/Button';
import ExportToExcel from 'packaging/components/ExportToExcel';
import { isEqual, isWithinInterval } from 'date-fns';
import { AgeCategoryFilters } from './AgeCategoryFilters';
import { fromJS, List } from 'immutable';
import { getBoardUpgradePriceColDefs, getPriceDetailsColDefs } from './columnDefinitions';
import { filterDatasetsByAgeCategory, getDatesFromRange, getMinMaxDate } from 'packaging/packaging-utils';

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
  ageCategorySelections: { adult: true, child: false }
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

export default function PackagePriceDetails(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filters, setFilters] = useState({
    flightCriteria: List(),
    selectedFlightItems: List(),
    duration: 7,
    bookingDate: moment(),
    simulationAge: null,
    simulationBed: null
  });
  const [tabData, setTabData] = useState({
    selectedUnderOccupancy: [],
    selectedOverOccupancy: [],
    selectedBoardUpgrade: [],
    selectedOptionalItems: []
  });
  const selectedCurrency = useSelector(reduxState => reduxState.appState.selectedCurrency);
  const access = useSelector(reduxState => reduxState.appState.user.access);

  useEffect(() => {
    const flightCriteria = mapFlightItems(props.flightCriteria);
    if (flightCriteria) {
      setFilters(prevState => ({
        ...prevState,
        flightCriteria: fromJS(flightCriteria),
        selectedFlightItems: fromJS(flightCriteria.map(f => f.id))
      }));
    }
  }, [props.flightCriteria]);

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
          roomTypeId: x.metadata.roomTypeId,
          sourceMarketId: x.metadata.sourceMarketId,
          ageCategoryType: x.metadata.ageCategoryType
        };
      });

    dispatch({
      type: actionConstants.setSelectedPriceDetails,
      payload: getUpdatedSelectedPriceDetails(priceDetails, selectedDates, ageCategorySelections, tileFilters)
    });
    props.onDatasetUpdate(updatedDatasets);
  };

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

  useEffect(() => {
    if (state.selectedDates && state.selectedPriceDetails) {
      const updatedUnderOccupancyData = filterTabDataByDatesAndPriceDetails(
        state.selectedDates,
        state.selectedPriceDetails,
        state.selectedUnderOccupancy ?? props.underOccupancyDetails
      );
      const updatedOverOccupancyData = filterTabDataByDatesAndPriceDetails(
        state.selectedDates,
        state.selectedPriceDetails,
        state.selectedOverOccupancy ?? props.overOccupancyDetails
      );
      const updatedBoardUpgradeData = filterTabDataByDatesAndPriceDetails(
        state.selectedDates,
        state.selectedPriceDetails,
        state.selectedBoardUpgrade ?? props.boardUpgradeDetails
      );
      const updatedOptionalItems = filterTabDataByDatesAndPriceDetails(
        state.selectedDates,
        state.selectedPriceDetails,
        state.selectedOptionalItems ?? props.ancillaryDetails
      );
      setTabData(prevState => ({
        ...prevState,
        selectedUnderOccupancy: updatedUnderOccupancyData,
        selectedOverOccupancy: updatedOverOccupancyData,
        selectedBoardUpgrade: updatedBoardUpgradeData,
        selectedOptionalItems: updatedOptionalItems
      }));
    }
  }, [
    props.ancillaryDetails,
    props.boardUpgradeDetails,
    props.overOccupancyDetails,
    props.underOccupancyDetails,
    state.selectedBoardUpgrade,
    state.selectedDates,
    state.selectedOptionalItems,
    state.selectedOverOccupancy,
    state.selectedPriceDetails,
    state.selectedUnderOccupancy
  ]);

  const onAgeCategoryChange = (key, show) => {
    const updatedAgeCategorySelection = { ...ageCategorySelections, [key]: show };
    dispatch({ type: actionConstants.setAgeCategorySelections, payload: updatedAgeCategorySelection });
    dispatch({
      type: actionConstants.setSelectedPriceDetails,
      payload: getUpdatedSelectedPriceDetails(priceDetails, selectedDates, updatedAgeCategorySelection)
    });
  };

  const onClearDates = () => {
    dispatch({
      type: actionConstants.onClearDates,
      payload: { ...state, selectedDates: [], selectedPriceDetails: [] }
    });
    setTabData({
      selectedUnderOccupancy: [],
      selectedOverOccupancy: [],
      selectedBoardUpgrade: [],
      selectedOptionalItems: []
    });
  };

  const updateFilters = selectedCriteria => {
    let updatedFilters;
    switch (selectedCriteria.key) {
      case 'flight':
        updatedFilters = { ...filters, selectedFlightItems: selectedCriteria.value };
        setFilters(updatedFilters);
        break;
      case 'duration':
        updatedFilters = { ...filters, duration: selectedCriteria.value };
        setFilters(updatedFilters);
        break;
      case 'bookingDate':
        updatedFilters = { ...filters, bookingDate: selectedCriteria.value };
        setFilters(updatedFilters);
        break;
      case 'simulationAge':
        updatedFilters = { ...filters, simulationAge: selectedCriteria.value };
        setFilters(updatedFilters);
        break;
      case 'simulationBed':
        updatedFilters = { ...filters, simulationBed: selectedCriteria.value };
        setFilters(updatedFilters);
        break;
    }

    if (selectedCriteria.value) {
      props.getUpdatedPrices(updatedFilters);
    }
  };

  const handleResetSellingPrice = () => {
    selectedPriceDetails
      .filter(x => x.hasChanges)
      .forEach(value => {
        value.sellingPrice.values[selectedCurrency] = value.originalSellingPrice;
        value.hasChanges = false;
      });

    tabData.selectedBoardUpgrade
      .filter(x => x.hasChanges)
      .forEach(value => {
        value.sellingPrice.values[selectedCurrency] = value.originalSellingPrice;
        value.hasChanges = false;
      });

    props.onResetChanges();
  };

  const handleSaveSellingPrice = () => {
    const sellingPrices = selectedPriceDetails
      .filter(x => x.hasChanges)
      .map(x => {
        return {
          accommodationId: x.accommodationId,
          roomTypeId: x.roomTypeId,
          sourceMarketId: x.sourceMarketId,
          duration: filters.duration,
          ageCategoryType: x.ageCategory,
          childNumber: x.childNumber,
          bedNumber: x.bedNumber,
          ageFrom: x.ageFrom,
          ageTo: x.ageTo,
          priceDay: x.date,
          currency: selectedCurrency,
          sellingPrice: x.sellingPrice ? x.sellingPrice.values[selectedCurrency] : null,
          calculatedPrice: x.calcPrice ? x.calcPrice.values[selectedCurrency] : null
        };
      });

    const boardUpgradeSellingPrices = tabData.selectedBoardUpgrade
      .filter(x => x.hasChanges)
      .flatMap(x => {
        return getDatesFromRange(x.from, x.to).map(d => {
          return {
            accommodationId: x.accommodationId,
            roomTypeId: x.roomTypeId,
            supplementId: x.supplementId,
            sourceMarketId: x.sourceMarketId,
            duration: filters.duration,
            ageCategoryType: x.ageCategory,
            childNumber: x.childNumber,
            bedNumber: x.bedNumber,
            ageFrom: x.ageFrom,
            ageTo: x.ageTo,
            priceDay: moment(d).utcOffset(0, true),
            currency: selectedCurrency,
            sellingPrice: x.sellingPrice ? x.sellingPrice.values[selectedCurrency] : null,
            calculatedPrice: x.calcPrice ? x.calcPrice.values[selectedCurrency] : null
          };
        });
      });

    const payload = sellingPrices.concat(boardUpgradeSellingPrices);

    props.saveSellingPrice(payload).then(() => {
      props.onResetChanges();
      props.getUpdatedPrices(filters);
    });
  };

  const { datasets, priceDetails, hasOutboundHomeboundFlights, hasChanges } = props;

  const { selectedDates, selectedPriceDetails, selectedChartIds, ageCategorySelections } = state;
  const readOnly = !access.publishpackages.charterpackage.write || !access.publishpackages.accommodationonly.write;

  const getComponentBasedOnPriceDetails = () => {
    if (!hasOutboundHomeboundFlights) {
      return (
        <Flexbox width="inherit" justifyContent="space-between" marginBottom={'16px'}>
          <h1>No matching flights found.</h1>
          <PackageDetailsFilters
            filters={{
              flight: filters.flightCriteria,
              selectedFlightItems: filters.selectedFlightItems,
              duration: filters.duration,
              bookingDate: filters.bookingDate,
              simulationAge: filters.simulationAge,
              simulationBed: filters.simulationBed
            }}
            disabledItems={[...(filters.flightCriteria.size ? [] : ['flight'])]}
            onFilterChange={updateFilters}
            onRefresh={() => props.getUpdatedPrices(filters)}
          />
        </Flexbox>
      );
    }
    if (priceDetails.length) {
      return (
        <>
          <Flexbox width="inherit" justifyContent="space-between" marginBottom={'16px'}>
            <ChartTile
              width="40%"
              onTileSelected={onTileSelected}
              selectedChartIds={selectedChartIds}
              items={filterDatasetsByAgeCategory(datasets, ageCategorySelections)}
            />
            <Flexbox width="60%">
              <AgeCategoryFilters
                ageCategorySelections={ageCategorySelections}
                onAgeCategoryChange={onAgeCategoryChange}
              />
              <PackageDetailsFilters
                filters={{
                  flight: filters.flightCriteria,
                  selectedFlightItems: filters.selectedFlightItems,
                  duration: filters.duration,
                  bookingDate: filters.bookingDate,
                  simulationAge: filters.simulationAge,
                  simulationBed: filters.simulationBed
                }}
                onFilterChange={updateFilters}
                onRefresh={() => props.getUpdatedPrices(filters)}
              />
            </Flexbox>
          </Flexbox>
          <PricesGraph
            type="package"
            datasets={filterDatasetsByAgeCategory(datasets, ageCategorySelections)}
            selectedDates={selectedDates}
            selectedCurrency={selectedCurrency}
            selectedChartIds={selectedChartIds}
          />
          <Flexbox width="inherit" justifyContent="space-between" marginBottom={'16px'}>
            <Flexbox>
              <DateRangeSelector
                minDate={getMinMaxDate(priceDetails, 'min')}
                maxDate={getMinMaxDate(priceDetails, 'max')}
                onDateRangeSelected={onDateRangeSelected}
                pageType="package-price-details"
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
          <OfferingPriceDetailsTabs
            baseGridKey={'PackageDetailedPricing'}
            underOccupancyData={tabData.selectedUnderOccupancy}
            overOccupancyData={tabData.selectedOverOccupancy}
            boardUpgradeData={tabData.selectedBoardUpgrade}
            priceDetailsData={selectedPriceDetails}
            optionalItemsData={tabData.selectedOptionalItems}
            priceDetailsColDefs={getPriceDetailsColDefs({
              currency: selectedCurrency,
              duration: filters.duration,
              disableSellingPriceEdit: readOnly
            })}
            boardUpgradePriceDetailsColDefs={getBoardUpgradePriceColDefs()}
            selectedCurrency={selectedCurrency}
          />
          <Flexbox marginTop="24px" alignItems="flex-end" alignSelf="flex-end">
            <PrimaryButton marginRight="10px" disabled={!hasChanges || readOnly} onClick={handleSaveSellingPrice}>
              Save selling price
            </PrimaryButton>
            <Button disabled={!hasChanges || readOnly} onClick={handleResetSellingPrice}>
              Reset selling price
            </Button>
          </Flexbox>
        </>
      );
    }
  };
  return (
    <Content height="auto">
      <Flexbox direction={'column'} width="100%">
        <h1 style={{ alignSelf: 'flex-start', marginTop: 0 }}>Package Details ({selectedCurrency})</h1>
        {getComponentBasedOnPriceDetails()}
      </Flexbox>
    </Content>
  );
}

const mapFlightItems = flightCriteria => {
  return flightCriteria?.map(item => ({ id: item.key, name: item.value }));
};

const filterTabDataByDatesAndPriceDetails = (selectedDates, priceDetails, tabData) => {
  const newData = tabData.filter(x => selectedDates.some(date => isWithinInterval(date, { start: x.from, end: x.to })));

  return newData.filter(x => priceDetails.some(priceDetail => priceDetail.roomTypeId === x.roomTypeId));
};

const getUpdatedSelectedPriceDetails = (priceDetails, selectedDates, ageCategory, tileFilters) => {
  const updatedData = [];
  selectedDates.forEach(date => {
    let currentData = priceDetails.filter(x => isEqual(new Date(x.date), date));

    if (currentData) {
      if (tileFilters) {
        currentData = currentData.filter(item =>
          tileFilters.some(tile => {
            return (
              tile.roomTypeId === item.roomTypeId &&
              tile.sourceMarketId === item.sourceMarketId &&
              tile.ageCategoryType === item.ageCategoryType
            );
          })
        );
      }
      if (!ageCategory.adult) {
        currentData = currentData.filter(x => x.ageCategoryType !== 'Adult');
      }
      if (!ageCategory.child) {
        currentData = currentData.filter(x => !x.ageCategoryType?.toLowerCase().startsWith('child'));
      }
      updatedData.push(...currentData);
    }
  });
  return updatedData;
};
