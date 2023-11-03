import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Flexbox } from 'components/styled/Layout';
import FlightDetailsPriceGraph from './FlightDetailsPriceGraph';
import moment from 'moment';
import DateRangeSelector from './DateRangeSelector';
import { v4 as uuidv4 } from 'uuid';
import { Button, PrimaryButton } from 'components/styled/Button';
import { Content } from 'components/styled/Content';
import Spinner from 'components/Spinner';
import OfferingCharterFlightPriceDetailsTabs from './OfferingCharterFlightPriceDetailsTabs';
import { isWithinInterval } from 'date-fns';
import { colours } from '../../../components/styled/defaults';
import ExportToExcel from '../ExportToExcel';
import { isF5Key } from '../../../helpers/keyChecker';

class CharterFlightPriceDetailsForSimulation extends Component {
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
      graphKey: uuidv4(),
      showAgeCategoryPrices: { adult: true, child: true },
      showSeatCategoryPrices: { economy: true, comfort: false, premium: false },
      selectedCurrency: null,
      priceDetails: [],
      comfortPriceDetails: [],
      selectedPriceDetails: [],
      premiumpriceDetails: [],
      selectedPremiumpriceDetails: [],
      selectedComfortPriceDetails: [],
      selectedUnderOccupancy: [],
      sourceMarket: '',
      country: '',
      destination: '',
      countryId: '',
      destinationId: '',
      planningPeriodId: '',
      sourceMarketId: '',
      airportcode: '',
      isValidDuration: true,
      transportCode: '',
      departureAirport: '',
      departureAirportCode: '',
      arrivalAirport: '',
      arrivalAirportCode: '',
      airlines: '',
      weekday: '',
      friendlyWeekday: '',
      frequency: '',
      currency: '',
      seasonId: '',
      masterId: '',
      availableSeatClasses: [],
      overViewData: {}
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

  UpdatePricesForSingleFlight = data => {
    this.setState({ isLoading: true, selectedDateRanges: [], selectedDates: [] });
    this.props.onFlightPriceDetails(data.masterId).then(response => {
      const results = response.data;
      const datasets = [...mapGraphData(results, data)];
      const comfortPriceDetails = mapComfortPriceDetails(results); //detaileddata.comfortPriceDetails;
      const priceDetails = mapEconomyPriceDetails(results); // to do use method to map data
      const premiumpriceDetails = mapPremiumPriceDetails(results);
      const selectedItems = this.updateSelectedData(priceDetails, premiumpriceDetails, comfortPriceDetails);
      this.setState({
        datasets,
        priceDetails,
        premiumpriceDetails,
        comfortPriceDetails,
        ...selectedItems,
        isLoading: false
      });
    });
  };

  getPricesForSingleFlight = data => {
    this.setState({ isLoading: true, selectedDateRanges: [], selectedDates: [] });
    this.props.onFlightPriceDetails(data.masterId).then(response => {
      const results = response.data;
      const datasets = mapGraphData(results, data);
      const comfortPriceDetails = mapComfortPriceDetails(results); //detaileddata.comfortPriceDetails;
      const priceDetails = mapEconomyPriceDetails(results); // to do use method to map data
      const premiumpriceDetails = mapPremiumPriceDetails(results);
      const selectedItems = this.updateSelectedData(priceDetails, premiumpriceDetails, comfortPriceDetails);
      this.setState({
        datasets,
        priceDetails,
        premiumpriceDetails,
        comfortPriceDetails,
        overViewData: data,
        ...selectedItems,
        isLoading: false
      });
    });
  };

  updateSelectedData = (priceDetails, premiumpriceDetails, comfortPriceDetails) => {
    let selectedPriceDetails = [];
    let selectedPremiumpriceDetails = [];
    let selectedComfortPriceDetails = [];

    if (this.state.selectedDates.length > 0) {
      selectedPriceDetails = this.updateSelectedPriceDetails(
        priceDetails,
        this.state.showAgeCategoryPrices,
        this.state.showSeatCategoryPrices,
        'economy'
      );
      selectedPremiumpriceDetails = this.updateSelectedPriceDetails(
        premiumpriceDetails,
        this.state.showAgeCategoryPrices,
        this.state.showSeatCategoryPrices,
        'premium'
      );
      selectedComfortPriceDetails = this.updateSelectedPriceDetails(
        comfortPriceDetails,
        this.state.showAgeCategoryPrices,
        this.state.showSeatCategoryPrices,
        'comfort'
      );
    }
    return {
      selectedPriceDetails,
      selectedPremiumpriceDetails,
      selectedComfortPriceDetails
    };
  };

  handleMessage = message => {
    const { data, event } = message.data;
    if (event === 'disconnect' || this.state.disconnected) {
      this.setState({ disconnected: true });
    } else if (event === 'remove') {
      const { datasets, priceDetails, premiumpriceDetails, comfortPriceDetails } = this.state;
      const dataKey = `${data.masterId}`;
      const updatedDatasets = datasets.filter(dataset => dataset.masterId !== dataKey);
      const updatedPriceDetails = priceDetails.filter(d => !(d.masterId === data.masterId));
      const updatedPremiumpriceDetails = premiumpriceDetails.filter(d => !(d.masterId === data.masterId));
      const updatedComfortpriceDetails = comfortPriceDetails.filter(d => !(d.masterId === data.masterId));
      this.setState({
        datasets: updatedDatasets,
        priceDetails: updatedPriceDetails,
        premiumpriceDetails: updatedPremiumpriceDetails,
        comfortPriceDetails: updatedComfortpriceDetails
      });
    } else {
      this.setState(
        {
          isLoading: true,
          selectedCurrency: data.currency
        },
        () => this.getPricesForSingleFlight(data)
      );
    }
  };

  getSelectedDates = selectedDateRanges => {
    return selectedDateRanges.flatMap(range => this.getDatesFromRange(range.from, range.to));
  };

  getDatesFromRange = (startDate, endDate) => {
    let dates = [],
      currentDate = startDate,
      addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };

    function getFormattedDate(date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      let day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return year + '-' + month + '-' + day;
    }

    while (getFormattedDate(currentDate) <= getFormattedDate(endDate)) {
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

    this.setState(
      {
        selectedDates: updatedDates,
        isLoading: true,
        selectedPriceDetails: [],
        selectedPremiumpriceDetails: [],
        selectedComfortPriceDetails: []
      },
      () => {
        const updatedPriceDetails = this.updateSelectedPriceDetails(
          this.state.priceDetails,
          this.state.showAgeCategoryPrices,
          this.state.showSeatCategoryPrices,
          'economy'
        );
        const updatedPremiumpriceDetails = this.updateSelectedPriceDetails(
          this.state.premiumpriceDetails,
          this.state.showAgeCategoryPrices,
          this.state.showSeatCategoryPrices,
          'premium'
        );
        const updatedComfortpriceDetails = this.updateSelectedPriceDetails(
          this.state.comfortPriceDetails,
          this.state.showAgeCategoryPrices,
          this.state.showSeatCategoryPrices,
          'comfort'
        );
        this.setState({
          selectedPriceDetails: updatedPriceDetails,
          selectedPremiumpriceDetails: updatedPremiumpriceDetails,
          selectedComfortPriceDetails: updatedComfortpriceDetails,
          selectedDateRanges: [],
          isLoading: false
        });
      }
    );
  };

  handleSimulationAgeChanged = simulationAge => {
    this.setState({ simulationAge });
  };

  getRoundedValueByCurrency = values => Math.round(values[this.state.selectedCurrency.toUpperCase()] * 100) / 100;

  updateSelectedDataWithDateRange = (data, updatedPriceDetails) => {
    const { selectedDates } = this.state;
    const newData = data.filter(x => selectedDates.some(date => isWithinInterval(date, { start: x.from, end: x.to })));

    var newList = newData.filter(x => updatedPriceDetails.some(priceDetail => priceDetail.roomTypeId === x.roomTypeId));
    return newList;
  };

  updateSelectedPriceDetails = (data, showAgeCategoryPrices, showSeatCategoryPrices, seatClasseName) => {
    const { selectedDates } = this.state;
    let newData = [];
    selectedDates.forEach(date => {
      let currentData = data.filter(
        x =>
          String(
            new Date(x.date).getDate() + '-' + new Date(x.date).getMonth() + '-' + new Date(x.date).getFullYear()
          ) ===
          date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
      );
      if (currentData) {
        if (!showAgeCategoryPrices.adult) {
          currentData = currentData.filter(x => x.ageCategoryType !== 'Adult & Child');
        }
        // if (!showAgeCategoryPrices.child) {
        //   currentData = currentData.filter(x => !x.ageCategoryType.includes('Child'));
        // }
        if (!showSeatCategoryPrices.economy && seatClasseName === 'economy') {
          currentData = currentData.filter(x => x.seatClassName !== 'Economy');
        }
        if (!showSeatCategoryPrices.premium && seatClasseName === 'premium') {
          currentData = currentData.filter(x => x.seatClassName.includes('Premium'));
        }
        if (!showSeatCategoryPrices.comfort && seatClasseName === 'comfort') {
          currentData = currentData.filter(x => x.seatClassName.includes('Comfort'));
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
      this.state.showSeatCategoryPrices
    );
    const updatedPremiumpriceDetails = this.updateSelectedPriceDetails(
      this.state.premiumpriceDetails,
      this.state.showAgeCategoryPrices,
      this.state.showSeatCategoryPrices
    );
    this.setState({
      selectedRoomTypeCategories: selectedRoomTypeCategories,
      datasets: updatedDatasets,
      selectedPriceDetails: updatedPriceDetails,
      selectedPremiumpriceDetails: updatedPremiumpriceDetails
    });
  };

  handleShowAgeCategoryPricesChanged = (showAdult, showChild) => {
    const showAgeCategoryPrices = { adult: showAdult, child: showChild };

    const updatedPriceDetails = this.updateSelectedPriceDetails(
      this.state.priceDetails,
      showAgeCategoryPrices,
      this.state.showSeatCategoryPrices
    );
    const updatedPremiumpriceDetails = this.updateSelectedPriceDetails(
      this.state.premiumpriceDetails,
      showAgeCategoryPrices,
      this.state.showSeatCategoryPrices
    );
    this.setState({
      showAgeCategoryPrices,
      selectedPriceDetails: updatedPriceDetails,
      selectedPremiumpriceDetails: updatedPremiumpriceDetails
    });
  };

  handleShowSeatCategoryPricesChanged = (showEconomy, showComfort, showPremium) => {
    let showSeatCategoryPrices = this.state;
    showSeatCategoryPrices = { economy: showEconomy, comfort: showComfort, premium: showPremium };
    const updatedPriceDetails = this.updateSelectedPriceDetails(
      this.state.priceDetails,
      this.state.showAgeCategoryPrices,
      showSeatCategoryPrices,
      'economy'
    );
    const updatedPremiumpriceDetails = this.updateSelectedPriceDetails(
      this.state.premiumpriceDetails,
      this.state.showAgeCategoryPrices,
      showSeatCategoryPrices,
      'premium'
    );
    const updatedComfortpriceDetails = this.updateSelectedPriceDetails(
      this.state.comfortPriceDetails,
      this.state.showAgeCategoryPrices,
      showSeatCategoryPrices,
      'comfort'
    );
    this.setState({
      showSeatCategoryPrices,
      selectedPriceDetails: showEconomy ? updatedPriceDetails : [],
      selectedPremiumpriceDetails: showPremium ? updatedPremiumpriceDetails : [],
      selectedComfortPriceDetails: showComfort ? updatedComfortpriceDetails : []
    });
  };
  handleBookingDateChange = date => {
    this.setState({ selectedBookingDate: date });
  };

  handleClearDates = () => {
    this.setState({
      selectedDates: [],
      selectedPriceDetails: [],
      selectedPremiumpriceDetails: [],
      selectedComfortPriceDetails: [],
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
      premiumpriceDetails,
      comfortPriceDetails,
      isLoading,
      disconnected,
      selectedDates,
      simulationAge,
      selectedPriceDetails,
      selectedPremiumpriceDetails,
      selectedComfortPriceDetails
    } = this.state;
    const { access } = this.props;
    const readOnly = !access.publishpackages.charterpackage.write || !access.publishpackages.accommodationonly.write; //TODO: need to check correct package type?
    let excelData = selectedPriceDetails.concat(selectedPremiumpriceDetails);
    excelData = excelData.concat(selectedComfortPriceDetails);
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
              {(priceDetails.length > 0) | (premiumpriceDetails.length > 0) | (comfortPriceDetails.length > 0) &&
                this.state.selectedCurrency && (
                  <React.Fragment>
                    <FlightDetailsPriceGraph
                      data={{
                        datasets
                      }}
                      selectedDates={selectedDates}
                      selectedCurrency={this.state.selectedCurrency}
                      onLegendSelectionChanged={this.handlePriceGraphSelectionChanged}
                      key={this.state.graphKey}
                      showAgeCategoryPrices={this.state.showAgeCategoryPrices}
                      onShowAgeCategoryPricesChanged={this.handleShowAgeCategoryPricesChanged}
                      simulationAge={simulationAge}
                      onSimulationAgeChanged={this.handleSimulationAgeChanged}
                      onSimulationAgeBlur={this.handleSimulationAgeOnBlur}
                      packageType={this.props.packageType}
                      showSeatCategoryPrices={this.state.showSeatCategoryPrices}
                      onShowSeatCategoryPricesChanged={this.handleShowSeatCategoryPricesChanged}
                      onRefresh={() => this.UpdatePricesForSingleFlight(this.state.overViewData)}
                    />

                    <Flexbox marginTop="4px" alignItems="flex-end" alignSelf="flex-start">
                      <DateRangeSelector
                        minDate={this.getMinDate(priceDetails)}
                        maxDate={this.getMaxDate(priceDetails)}
                        onDateRangeSelected={this.handleDateRangeSelected}
                        pageType="charter-flight-details"
                      />
                      <Button onClick={this.handleClearDates}>Clear dates</Button>
                    </Flexbox>

                    <Flexbox alignItems="flex-end" alignSelf="flex-end">
                      <ExportToExcel
                        data={excelData}
                        columnDefinitions={this.props.getPriceDetailsColDefs({
                          currency: this.state.selectedCurrency,
                          duration: this.state.duration
                        })}
                        currency={this.state.selectedCurrency}
                      />
                    </Flexbox>

                    <OfferingCharterFlightPriceDetailsTabs
                      baseGridKey={this.props.gridKey}
                      premiumPriceDetailsData={selectedPremiumpriceDetails}
                      comfortPriceDetailsData={selectedComfortPriceDetails}
                      priceDetailsData={selectedPriceDetails}
                      priceDetailsColDefs={this.props.getPriceDetailsColDefs({
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

CharterFlightPriceDetailsForSimulation.propTypes = {
  gridKey: PropTypes.string,
  getPriceDetailsColDefs: PropTypes.func,
  getBoardUpgradePriceDetailsColDefs: PropTypes.func,
  onGetPriceDetails: PropTypes.func,
  titleText: PropTypes.string.isRequired,
  homeBoundFlights: PropTypes.array,
  outBoundFlights: PropTypes.array
};

const mapStateToProps = state => {
  return {
    access: state.appState.user.access
  };
};

export default connect(mapStateToProps)(CharterFlightPriceDetailsForSimulation);

const mapGraphData = (result, data) => {
  return result.chartData.datasets.map(dataset => ({
    key: uuidv4(),
    masterId: result.id,
    id: dataset.label,
    label: dataset.label,
    seatClassesName: dataset.seatClassesName,
    data: dataset.data,
    selected: true,
    metadata: {
      ageCategoryType: dataset.ageCategoryType,
      sourceMarketId: data.sourceMarketId,
      sourceMarketName: data.sourceMarketName,
      transportCode: result.transportCode,
      departureAirport: result.departureAirport,
      departureAirportCode: result.departureAirportCode,
      arrivalAirport: result.arrivalAirport
    }
  }));
};

const mapPremiumPriceDetails = data => {
  const premiumpriceDetail = data.premiumPriceDetails;
  if (!premiumpriceDetail) return [];

  return data.premiumPriceDetails.map(x => ({
    key: `${data.id}`,
    masterId: data.id,
    sourceMarketName: x.sourceMarketName,
    ageCategoryType: x.ageCategoryType,
    allotment: x.allotment,
    calculatedCost: x.calculatedCost,
    contractCost: x.contractCost,
    distributionCost: x.distributionCost,
    direction: x.direction,
    emptyLegFactor: x.emptyLegFactor,
    margin: x.margin,
    vat: x.vat,
    totalPrice: x.totalPrice,
    taxCost: x.taxCost,
    weekday: x.weekday,
    date: x.date,
    tooltips: x.tooltips,
    seatClassName: 'premium',
    guaranteeFundFlightCost: x.guaranteeFundFlightCost,
    fuelSurchargeCost: x.fuelSurchargeCost,
    productType: x.productType
  }));
};

const mapComfortPriceDetails = data => {
  const comfortpriceDetail = data.comfortPriceDetails;
  if (!comfortpriceDetail) return [];

  return data.comfortPriceDetails.map(x => ({
    key: `${data.id}`,
    masterId: data.id,
    sourceMarketName: x.sourceMarketName,
    ageCategoryType: x.ageCategoryType,
    allotment: x.allotment,
    calculatedCost: x.calculatedCost,
    contractCost: x.contractCost,
    distributionCost: x.distributionCost,
    direction: x.direction,
    emptyLegFactor: x.emptyLegFactor,
    margin: x.margin,
    vat: x.vat,
    totalPrice: x.totalPrice,
    taxCost: x.taxCost,
    weekday: x.weekday,
    date: x.date,
    tooltips: x.tooltips,
    seatClassName: 'comfort',
    guaranteeFundFlightCost: x.guaranteeFundFlightCost,
    fuelSurchargeCost: x.fuelSurchargeCost,
    productType: x.productType
  }));
};
const mapEconomyPriceDetails = data => {
  const economypriceDetail = data.priceDetails;
  if (!economypriceDetail) return [];

  return data.priceDetails.map(x => ({
    key: `${data.id}`,
    masterId: data.id,
    sourceMarketName: x.sourceMarketName,
    ageCategoryType: x.ageCategoryType,
    allotment: x.allotment,
    calculatedCost: x.calculatedCost,
    contractCost: x.contractCost,
    distributionCost: x.distributionCost,
    direction: x.direction,
    emptyLegFactor: x.emptyLegFactor,
    margin: x.margin,
    vat: x.vat,
    totalPrice: x.totalPrice,
    taxCost: x.taxCost,
    weekday: x.weekday,
    date: x.date,
    tooltips: x.tooltips,
    seatClassName: 'economy',
    guaranteeFundFlightCost: x.guaranteeFundFlightCost,
    fuelSurchargeCost: x.fuelSurchargeCost,
    productType: x.productType
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
