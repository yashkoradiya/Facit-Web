import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Flexbox } from 'components/styled/Layout';
import PriceGraph from './PriceGraph';
import moment from 'moment';
import DateRangeSelector from './DateRangeSelector';
import { v4 as uuidv4 } from 'uuid';
import { Button, PrimaryButton } from 'components/styled/Button';
import { Content } from 'components/styled/Content';
import Spinner from 'components/Spinner';
import OfferingPriceDetailsTabs from './OfferingPriceDetailsTabs';
import { isWithinInterval, isEqual } from 'date-fns';
import { colours } from '../../../components/styled/defaults';
import ExportToExcel from '../ExportToExcel';
import PackagePriceDetailsFilters from './PackagePriceDetailsFilters';
import { isF5Key } from '../../../helpers/keyChecker';

class PackagePriceDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'date',
      asc: true,
      selectedDates: [],
      selectedRoomTypes: [],
      selectedBookingDate: moment(),
      simulationAge: null,
      simulationBed: null,
      duration: 7,
      datasets: [],
      isLoading: true,
      disconnected: false,
      underOccupancyData: [],
      overOccupancyData: [],
      boardUpgradeData: [],
      optionalItemsData: [],
      graphKey: uuidv4(),
      showAgeCategoryPrices: { adult: true, child: false },
      selectedCurrency: null,
      priceDetails: [],
      selectedPriceDetails: [],
      selectedUnderOccupancy: [],
      selectedOverOccupancy: [],
      selectedBoardUpgrade: [],
      selectedOptionalItems: [],
      selectedRoomTypeCategories: null
    };
  }

  componentDidMount() {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', this.handleMessage);

      if (window.onServiceWorkerReady) window.onServiceWorkerReady();
    }
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (isF5Key(event.which)) {
      event.preventDefault();
      event.stopPropagation();
      this.getUpdatedPricesForAll(this.state.duration);
      return;
    }
  };

  getUpdatedPricesForAll = duration => {
    this.setState({ isLoading: true });
    const selectedBookingDate = moment(this.state.selectedBookingDate);
    const inputModels = this.state.selectedRoomTypes.map(rt => ({
      accommodationId: rt.accommodationId,
      roomTypeId: rt.roomTypeId,
      sourceMarketId: rt.sourceMarketId,
      duration,
      bookingDate: selectedBookingDate.isValid() ? selectedBookingDate.format('YYYY-MM-DD') : null,
      simulationAge: this.state.simulationAge,
      simulationBed: this.state.simulationBed,
      productType: rt.productType,
      currency: this.state.selectedCurrency
    }));

    this.props.onGetPrices(inputModels).then(response => {
      const results = response.data;

      const datasets = results.flatMap(r => mapGraphData(r, duration));
      const priceDetails = results.flatMap(r => r.details.prices);
      const underOccupancyData = results.flatMap(r => mapUnderOccupancyData(r));
      const overOccupancyData = results.flatMap(r => mapOverOccupancyData(r));
      const boardUpgradeData = results.flatMap(r => mapBoardUpgradeData(r));
      const optionalItems = results.flatMap(r => mapOptionalItems(r));

      const selectedItems = this.updateSelectedData(
        priceDetails,
        underOccupancyData,
        overOccupancyData,
        boardUpgradeData,
        optionalItems
      );

      this.setState({
        datasets,
        underOccupancyData: underOccupancyData,
        overOccupancyData: overOccupancyData,
        boardUpgradeData: boardUpgradeData,
        priceDetails,
        isLoading: false,
        graphKey: uuidv4(),
        duration,
        ...selectedItems
      });
    });
  };

  getPricesForSingleRoomType = ({ masterId, roomTypeId, sourceMarketId, productType }) => {
    const selectedBookingDate = moment(this.state.selectedBookingDate);
    const inputModels = [
      {
        accommodationId: masterId,
        roomTypeId,
        sourceMarketId,
        duration: this.state.duration,
        bookingDate: selectedBookingDate.isValid() ? selectedBookingDate.format('YYYY-MM-DD') : null,
        simulationAge: this.state.simulationAge,
        simulationBed: this.state.simulationBed,
        productType: productType,
        currency: this.state.selectedCurrency
      }
    ];

    this.props.onGetPrices(inputModels).then(response => {
      const result = response.data.length > 0 ? response.data[0] : null;

      const datasets = [...this.state.datasets, ...mapGraphData(result, this.state.duration)];
      const priceDetails = [...this.state.priceDetails, ...result.details.prices];
      const underOccupancyData = [...this.state.underOccupancyData, ...mapUnderOccupancyData(result)];
      const overOccupancyData = [...this.state.overOccupancyData, ...mapOverOccupancyData(result)];
      const boardUpgradeData = [...this.state.boardUpgradeData, ...mapBoardUpgradeData(result)];
      const optionalItemsData = [...this.state.optionalItemsData, ...mapOptionalItems(result)];
      console.log('priceDetails');
      console.log(priceDetails);
      const selectedItems = this.updateSelectedData(
        priceDetails,
        underOccupancyData,
        overOccupancyData,
        boardUpgradeData,
        optionalItemsData
      );

      this.setState({
        datasets,
        underOccupancyData,
        overOccupancyData,
        boardUpgradeData,
        optionalItemsData,
        priceDetails,
        isLoading: false,
        selectedRoomTypes: [
          ...this.state.selectedRoomTypes,
          { ...result, id: `${result.sourceMarketId}_${result.roomTypeId}`, productType }
        ],
        ...selectedItems
      });
    });
  };

  updateSelectedData = (priceDetails, underOccupancyData, overOccupancyData, boardUpgradeData, optionalItemsData) => {
    let selectedBoardUpgrade = [];
    let selectedUnderOccupancy = [];
    let selectedOverOccupancy = [];
    let selectedPriceDetails = [];
    let selectedOptionalItems = [];

    if (this.state.selectedDates.length > 0) {
      selectedPriceDetails = this.updateSelectedPriceDetails(
        priceDetails,
        this.state.showAgeCategoryPrices,
        this.state.selectedRoomTypeCategories
      );

      selectedUnderOccupancy = this.updateSelectedDataWithDateRange(underOccupancyData, selectedPriceDetails);
      selectedOverOccupancy = this.updateSelectedDataWithDateRange(overOccupancyData, selectedPriceDetails);
      selectedBoardUpgrade = this.updateSelectedDataWithDateRange(boardUpgradeData, selectedPriceDetails);
      selectedOptionalItems = this.updateSelectedDataWithDateRange(optionalItemsData, selectedPriceDetails);
    }

    return {
      selectedPriceDetails,
      selectedOverOccupancy,
      selectedUnderOccupancy,
      selectedBoardUpgrade,
      selectedOptionalItems
    };
  };

  handleMessage = message => {
    const { data, event } = message.data;
    if (event === 'disconnect' || this.state.disconnected) {
      this.setState({ disconnected: true });
    } else if (event === 'remove') {
      const {
        datasets,
        selectedRoomTypes,
        underOccupancyData,
        selectedUnderOccupancy,
        overOccupancyData,
        selectedOverOccupancy,
        boardUpgradeData,
        selectedBoardUpgrade,
        priceDetails,
        selectedPriceDetails
      } = this.state;
      const dataKey = `${data.sourceMarketId}_${data.roomTypeId}`;
      const updatedDatasets = datasets.filter(dataset => dataset.id !== dataKey);
      const updatedSelectedRoomTypes = selectedRoomTypes.filter(dataset => dataset.id !== dataKey);
      const updatedUnderOccupancyData = underOccupancyData.filter(data => data.key !== dataKey);
      const updatedSelectedUnderOccupancy = selectedUnderOccupancy.filter(data => data.key !== dataKey);
      const updatedOverOccupancyData = overOccupancyData.filter(data => data.key !== dataKey);
      const updatedSelectedOverOccupancy = selectedOverOccupancy.filter(data => data.key !== dataKey);
      const updatedBoardUpgradeData = boardUpgradeData.filter(data => data.key !== dataKey);
      const updatedSelectedBoardUpgrade = selectedBoardUpgrade.filter(data => data.key !== dataKey);

      const updatedSelectedPriceDetails = selectedPriceDetails.filter(
        d => !(d.roomTypeId === data.roomTypeId && d.sourceMarketId === data.sourceMarketId)
      );
      const updatedPriceDetails = priceDetails.filter(
        d => !(d.roomTypeId === data.roomTypeId && d.sourceMarketId === data.sourceMarketId)
      );

      this.setState({
        datasets: updatedDatasets,
        priceDetails: updatedPriceDetails,
        underOccupancyData: updatedUnderOccupancyData,
        selectedUnderOccupancy: updatedSelectedUnderOccupancy,
        overOccupancyData: updatedOverOccupancyData,
        selectedOverOccupancy: updatedSelectedOverOccupancy,
        boardUpgradeData: updatedBoardUpgradeData,
        selectedBoardUpgrade: updatedSelectedBoardUpgrade,
        selectedRoomTypes: updatedSelectedRoomTypes,
        selectedPriceDetails: updatedSelectedPriceDetails
      });
    } else {
      this.setState(
        {
          isLoading: true,
          selectedCurrency: data.currency
        },
        () => this.getPricesForSingleRoomType(data)
      );
    }
  };

  getSelectedDates = selectedDateRanges => {
    return selectedDateRanges.flatMap(range => this.getDatesFromRange(range.from, range.to));
  };

  getDatesFromRange = (startDate, endDate) => {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };

  getMinDate = priceDetails => {
    const startDates = priceDetails.map(priceDetail => moment(priceDetail.date));
    return moment.min(startDates);
  };

  getMaxDate = priceDetails => {
    const startDates = priceDetails.map(priceDetail => moment(priceDetail.date));
    return moment.max(startDates);
  };

  handleDateRangeSelected = (selectedDateRanges, selectedWeekdays) => {
    let selectedDates = this.getSelectedDates(selectedDateRanges);

    if (selectedWeekdays && selectedWeekdays.size > 0) {
      selectedDates = selectedDates.filter(date => selectedWeekdays.some(day => day === moment(date).format('dd')));
    }

    const updatedDates = this.state.selectedDates
      .concat(selectedDates)
      .filter((date, i, self) => self.findIndex(d => d.getTime() === date.getTime()) === i);

    this.setState({ selectedDates: updatedDates, isLoading: true }, () => {
      const updatedPriceDetails = this.updateSelectedPriceDetails(
        this.state.priceDetails,
        this.state.showAgeCategoryPrices,
        this.state.selectedRoomTypeCategories
      );
      this.setState({
        selectedPriceDetails: updatedPriceDetails,
        selectedUnderOccupancy: this.updateSelectedDataWithDateRange(
          this.state.underOccupancyData,
          updatedPriceDetails
        ),
        selectedOverOccupancy: this.updateSelectedDataWithDateRange(this.state.overOccupancyData, updatedPriceDetails),
        selectedBoardUpgrade: this.updateSelectedDataWithDateRange(this.state.boardUpgradeData, updatedPriceDetails),
        selectedOptionalItems: this.updateSelectedDataWithDateRange(this.state.optionalItemsData, updatedPriceDetails),
        isLoading: false
      });
    });
  };

  handleDurationValueChanged = duration => {
    this.setState({ duration });
  };

  handleSimulationAgeChanged = simulationAge => {
    this.setState({ simulationAge });
  };

  handleSimulationBedChanged = simulationBed => {
    this.setState({ simulationBed });
  };

  getRoundedValueByCurrency = values => Math.round(values[this.state.selectedCurrency.toUpperCase()] * 100) / 100;

  updateSelectedDataWithDateRange = (data, updatedPriceDetails) => {
    const { selectedDates } = this.state;

    const newData = data.filter(x => selectedDates.some(date => isWithinInterval(date, { start: x.from, end: x.to })));

    var newList = newData.filter(x => updatedPriceDetails.some(priceDetail => priceDetail.roomTypeId === x.roomTypeId));
    return newList;
  };

  updateSelectedPriceDetails = (data, showAgeCategoryPrices, selectedRoomTypes) => {
    const { selectedDates } = this.state;
    let newData = [];

    selectedDates.forEach(date => {
      let currentData = data.filter(x => isEqual(new Date(x.date), date));
      if (currentData) {
        if (!showAgeCategoryPrices.adult) {
          currentData = currentData.filter(x => x.ageCategoryType !== 'Adult');
        }
        if (!showAgeCategoryPrices.child) {
          currentData = currentData.filter(x => !x.ageCategoryType.includes('Child'));
        }
        if (selectedRoomTypes) {
          currentData = currentData.filter(x => {
            for (let i = 0; i < selectedRoomTypes.length; i++) {
              if (
                selectedRoomTypes[i].roomTypeId === x.roomTypeId &&
                selectedRoomTypes[i].sourceMarketId === x.sourceMarketId &&
                selectedRoomTypes[i].ageCategoryType === x.ageCategoryType
              ) {
                return true;
              }
            }
            return false;
          });
        }
        newData.push(...currentData);
      }
    });
    return newData;
  };

  handlePriceGraphSelectionChanged = selectedChartIds => {
    const { datasets } = this.state;
    const updatedDatasets = datasets.map(x => {
      return { ...x, selected: selectedChartIds.some(y => y.key === x.key && y.selected) };
    });

    const selectedRoomTypeCategories = updatedDatasets
      .filter(x => x.selected)
      .map(x => {
        return {
          roomTypeId: x.metadata.roomTypeId,
          sourceMarketId: x.metadata.sourceMarketId,
          ageCategoryType: x.metadata.ageCategoryType
        };
      });

    const updatedPriceDetails = this.updateSelectedPriceDetails(
      this.state.priceDetails,
      this.state.showAgeCategoryPrices,
      selectedRoomTypeCategories
    );

    this.setState({
      selectedRoomTypeCategories: selectedRoomTypeCategories,
      datasets: updatedDatasets,
      selectedPriceDetails: updatedPriceDetails,
      selectedUnderOccupancy: this.updateSelectedDataWithDateRange(this.state.underOccupancyData, updatedPriceDetails),
      selectedOverOccupancy: this.updateSelectedDataWithDateRange(this.state.overOccupancyData, updatedPriceDetails),
      selectedBoardUpgrade: this.updateSelectedDataWithDateRange(this.state.boardUpgradeData, updatedPriceDetails),
      selectedOptionalItems: this.updateSelectedDataWithDateRange(this.state.selectedOptionalItems, updatedPriceDetails)
    });
  };

  handleShowAgeCategoryPricesChanged = (showAdult, showChild) => {
    const showAgeCategoryPrices = { adult: showAdult, child: showChild };

    const updatedPriceDetails = this.updateSelectedPriceDetails(
      this.state.priceDetails,
      showAgeCategoryPrices,
      this.state.selectedRoomTypeCategories
    );

    this.setState({
      showAgeCategoryPrices,
      selectedPriceDetails: updatedPriceDetails,
      selectedUnderOccupancy: this.updateSelectedDataWithDateRange(this.state.underOccupancyData, updatedPriceDetails),
      selectedOverOccupancy: this.updateSelectedDataWithDateRange(this.state.overOccupancyData, updatedPriceDetails),
      selectedBoardUpgrade: this.updateSelectedDataWithDateRange(this.state.boardUpgradeData, updatedPriceDetails),
      selectedOptionalItems: this.updateSelectedDataWithDateRange(this.state.selectedOptionalItems, updatedPriceDetails)
    });
  };

  handleBookingDateChange = date => {
    this.setState({ selectedBookingDate: date });
  };

  handleBookingDateOnBlur = () => {
    this.getUpdatedPricesForAll(this.state.duration);
  };

  handleSimulationAgeOnBlur = () => {
    this.getUpdatedPricesForAll(this.state.duration);
  };

  handleSimulationBedOnBlur = () => {
    this.getUpdatedPricesForAll(this.state.duration);
  };

  handleSimulationDurationOnBlur = () => {
    this.getUpdatedPricesForAll(this.state.duration);
  };

  handleClearDates = () => {
    this.setState({
      selectedDates: [],
      selectedPriceDetails: [],
      selectedUnderOccupancy: [],
      selectedOverOccupancy: [],
      selectedBoardUpgrade: [],
      selectedOptionalItems: []
    });
  };

  handleSaveSellingPrice = () => {
    const { selectedPriceDetails, selectedBoardUpgrade, duration, selectedCurrency } = this.state;

    const sellingPrices = selectedPriceDetails
      .filter(x => x.hasChanges)
      .map(x => {
        return {
          accommodationId: x.accommodationId,
          roomTypeId: x.roomTypeId,
          sourceMarketId: x.sourceMarketId,
          duration: duration,
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

    const boardUpgradeSellingPrices = selectedBoardUpgrade
      .filter(x => x.hasChanges)
      .flatMap(x => {
        return this.getDatesFromRange(x.from, x.to).map(d => {
          return {
            accommodationId: x.accommodationId,
            roomTypeId: x.roomTypeId,
            supplementId: x.supplementId,
            sourceMarketId: x.sourceMarketId,
            duration: duration,
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

    this.props.onSaveSellingPrice(payload).then(() => {
      this.props.onResetChanges();
      this.getUpdatedPricesForAll(duration);
    });
  };

  handleResetSellingPrice = () => {
    const { selectedPriceDetails, selectedBoardUpgrade } = this.state;

    selectedPriceDetails
      .filter(x => x.hasChanges)
      .forEach(value => {
        value.sellingPrice.values[this.state.selectedCurrency] = value.originalSellingPrice;
        value.hasChanges = false;
      });

    selectedBoardUpgrade
      .filter(x => x.hasChanges)
      .forEach(value => {
        value.sellingPrice.values[this.state.selectedCurrency] = value.originalSellingPrice;
        value.hasChanges = false;
      });

    this.props.onResetChanges();
  };

  render() {
    const {
      datasets,
      priceDetails,
      duration,
      isLoading,
      disconnected,
      selectedDates,
      selectedBookingDate,
      simulationAge,
      simulationBed,
      selectedPriceDetails,
      selectedOptionalItems,
      selectedUnderOccupancy,
      selectedOverOccupancy,
      selectedBoardUpgrade
    } = this.state;

    const { access } = this.props;
    const readOnly = !access.publishpackages.charterpackage.write || !access.publishpackages.accommodationonly.write; //TODO: need to check correct package type?
    console.log('selectedPriceDetails');
    console.log(selectedPriceDetails);
    const title = (
      <h1 style={{ alignSelf: 'flex-start', marginTop: 0 }}>
        {this.props.titleText} ({this.state.selectedCurrency})
      </h1>
    );
    return (
      <React.Fragment>
        <Spinner loading={isLoading} />
        {disconnected && <DisconnectedBar>Disconnected from overview</DisconnectedBar>}
        <Content height="auto">
          <Flexbox justifyContent="center" width="100%">
            <Flexbox direction={'column'} width="100%">
              {title}
              <Flexbox />
              {priceDetails.length === 0 && (
                <Flexbox justifyContent="space-between" width="100%">
                  <h2 style={{ textAlign: 'center' }}>{isLoading ? '' : 'No result'}</h2>
                  <PackagePriceDetailsFilters
                    durationValueChanged={this.handleDurationValueChanged}
                    duration={this.state.duration}
                    bookingDate={selectedBookingDate}
                    onBookingDateChange={this.handleBookingDateChange}
                    onBookingDateBlur={this.handleBookingDateOnBlur}
                    simulationAge={simulationAge}
                    onSimulationAgeChanged={this.handleSimulationAgeChanged}
                    onSimulationAgeBlur={this.handleSimulationAgeOnBlur}
                    simulationBed={simulationBed}
                    onSimulationBedChanged={this.handleSimulationBedChanged}
                    onSimulationBedBlur={this.handleSimulationBedOnBlur}
                    onDurationBlur={this.handleSimulationDurationOnBlur}
                    packageType={this.props.packageType}
                    onRefresh={() => this.getUpdatedPricesForAll(duration)}
                  />
                </Flexbox>
              )}
              {priceDetails.length > 0 && this.state.selectedCurrency && (
                <React.Fragment>
                  <PriceGraph
                    data={{
                      datasets,
                      duration
                    }}
                    selectedDates={selectedDates}
                    selectedCurrency={this.state.selectedCurrency}
                    durationValueChanged={this.handleDurationValueChanged}
                    duration={this.state.duration}
                    onLegendSelectionChanged={this.handlePriceGraphSelectionChanged}
                    key={this.state.graphKey}
                    showAgeCategoryPrices={this.state.showAgeCategoryPrices}
                    onShowAgeCategoryPricesChanged={this.handleShowAgeCategoryPricesChanged}
                    bookingDate={selectedBookingDate}
                    onBookingDateChange={this.handleBookingDateChange}
                    onBookingDateBlur={this.handleBookingDateOnBlur}
                    simulationAge={simulationAge}
                    onSimulationAgeChanged={this.handleSimulationAgeChanged}
                    onSimulationAgeBlur={this.handleSimulationAgeOnBlur}
                    simulationBed={simulationBed}
                    onSimulationBedChanged={this.handleSimulationBedChanged}
                    onSimulationBedBlur={this.handleSimulationBedOnBlur}
                    onDurationBlur={this.handleSimulationDurationOnBlur}
                    packageType={this.props.packageType}
                    onRefresh={() => this.getUpdatedPricesForAll(duration)}
                  />

                  <Flexbox marginTop="4px" alignItems="flex-end" alignSelf="flex-start">
                    <DateRangeSelector
                      minDate={this.getMinDate(priceDetails)}
                      maxDate={this.getMaxDate(priceDetails)}
                      onDateRangeSelected={this.handleDateRangeSelected}
                    />
                    <Button onClick={this.handleClearDates}>Clear dates</Button>
                  </Flexbox>

                  <Flexbox alignItems="flex-end" alignSelf="flex-end">
                    <ExportToExcel
                      data={selectedPriceDetails}
                      columnDefinitions={this.props.getPriceDetailsColDefs({
                        currency: this.state.selectedCurrency,
                        duration: this.state.duration
                      })}
                      currency={this.state.selectedCurrency}
                    />
                  </Flexbox>

                  <OfferingPriceDetailsTabs
                    baseGridKey={this.props.gridKey}
                    underOccupancyData={selectedUnderOccupancy}
                    overOccupancyData={selectedOverOccupancy}
                    boardUpgradeData={selectedBoardUpgrade}
                    priceDetailsData={selectedPriceDetails}
                    optionalItemsData={selectedOptionalItems}
                    priceDetailsColDefs={this.props.getPriceDetailsColDefs({
                      currency: this.state.selectedCurrency,
                      duration: this.state.duration,
                      disableSellingPriceEdit: readOnly
                    })}
                    boardUpgradePriceDetailsColDefs={this.props.getBoardUpgradePriceDetailsColDefs({
                      currency: this.state.selectedCurrency,
                      duration: this.state.duration,
                      disableSellingPriceEdit: readOnly
                    })}
                    selectedCurrency={this.state.selectedCurrency}
                  />
                  <Flexbox marginTop="24px" marginBottom="24px" alignItems="flex-end" alignSelf="flex-end">
                    <PrimaryButton
                      marginRight="10px"
                      disabled={!this.props.hasChanges || readOnly}
                      onClick={this.handleSaveSellingPrice}
                    >
                      Save selling price
                    </PrimaryButton>
                    <Button disabled={!this.props.hasChanges || readOnly} onClick={this.handleResetSellingPrice}>
                      Reset selling price
                    </Button>
                  </Flexbox>
                </React.Fragment>
              )}
            </Flexbox>
          </Flexbox>
        </Content>
      </React.Fragment>
    );
  }
}

PackagePriceDetails.propTypes = {
  gridKey: PropTypes.string.isRequired,
  getPriceDetailsColDefs: PropTypes.func.isRequired,
  getBoardUpgradePriceDetailsColDefs: PropTypes.func.isRequired,
  onGetPrices: PropTypes.func.isRequired,
  titleText: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    access: state.appState.user.access
  };
};

export default connect(mapStateToProps)(PackagePriceDetails);

const mapGraphData = (data, duration) => {
  return data.chartData.datasets.map(dataset => ({
    key: uuidv4(),
    id: `${data.sourceMarketId}_${data.roomTypeId}`,
    label: dataset.label,
    data: dataset.data,
    selected: true,
    metadata: {
      accommodationName: dataset.accommodationName,
      roomType: dataset.roomType,
      classification: dataset.classification,
      duration: duration,
      ageCategoryType: dataset.ageCategoryType,
      accommodationId: data.accommodationId,
      roomTypeId: data.roomTypeId,
      sourceMarketId: data.sourceMarketId,
      sourceMarketName: data.sourceMarketName
    }
  }));
};

const mapUnderOccupancyData = data => {
  const underOccupancy = data.details.underOccupancy;
  if (!underOccupancy) return [];

  return data.details.underOccupancy.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    bedNumber: x.bedNumber,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    baseCost: x.baseCost,
    underOccupancyCost: x.underOccupancyCost,
    supplement: x.supplement,
    discount: x.discount,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    price: x.price,
    totalPrice: x.totalPrice,
    standardPrice: x.standardPrice,
    tooltips: x.tooltips
  }));
};

const mapOverOccupancyData = data => {
  const overOccupancy = data.details.overOccupancy;
  if (!overOccupancy) return [];

  return data.details.overOccupancy.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    roomCost: x.roomCost,
    overOccupancyCost: x.overOccupancyCost,
    difference: x.difference,
    discount: x.discount,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    reduction: x.reduction,
    price: x.price,
    standardPrice: x.standardPrice,
    tooltips: x.tooltips,
    overOccupancyToolTips: x.overOccupancyToolTips
  }));
};

const mapBoardUpgradeData = data => {
  const boardUpgrade = data.details.boardUpgrade;
  if (!boardUpgrade) return [];

  return boardUpgrade.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    sourceMarketId: data.sourceMarketId,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageCategory: x.ageCategory,
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    board: x.board,
    supplementId: x.supplementId,
    boardUpgradeCost: x.boardUpgradeCost,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    calcPrice: x.calcPrice,
    sellingPrice: x.sellingPrice,
    discount: x.discount
  }));
};

const mapOptionalItems = data => {
  const optionalItems = data.details.ancillaries;
  if (!optionalItems) return [];

  return optionalItems.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    name: x.name,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    ancillaryCost: x.ancillaryCost,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    price: x.price
  }));
};

const DisconnectedBar = styled.div`
  background-color: ${colours.red};
  color: white;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
`;
