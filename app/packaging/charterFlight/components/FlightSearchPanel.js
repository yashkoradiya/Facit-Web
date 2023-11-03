import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as localStorage from 'core/localStorage';
import { PrimaryButtonWithIcon, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';
import { InputBox, InputLabel } from 'components/styled/Input';
import SearchBox from 'components/FormFields/SearchBox';
import DateInput from 'components/FormFields/DateInput';
import { previewSearchFlightSeries, getDetailsReport } from '../search/api';
import InputCheckbox from '../../../components/FormFields/InputCheckbox';

class FlightSearchPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null,
      selectedSeason: List(),
      selectedProductTypeIds: List(),
      selectedSourceMarketIds: List(),
      selectedDepartureAirportIds: List(),
      selectedDestinationAirportIds: List(),
      selectedAirlineCodes: List(),
      selectedWeekdays: List(),
      selectedFromDate: null,
      selectedToDate: null,
      localStorageFiltersKey: 'flightOverview_filters',
      onlyUnpublished: false,
      downloading: false
    };
  }

  componentDidMount() {
    this.updateStateFromLocalStorage();
  }

  updateStateFromLocalStorage = () => {
    const savedFilters = localStorage.getItem(this.state.localStorageFiltersKey);
    if (savedFilters) {
      const {
        selectedSeason,
        selectedProductTypeIds,
        selectedSourceMarketIds,
        selectedDepartureAirportIds,
        selectedDestinationAirportIds,
        selectedAirlineCodes,
        selectedWeekdays,
        selectedFromDate,
        selectedToDate,
        onlyUnpublished
      } = savedFilters;

      this.setState(
        {
          selectedFromDate: selectedFromDate ? moment(selectedFromDate) : null,
          selectedToDate: selectedToDate ? moment(selectedToDate) : null,
          selectedSeason: selectedSeason ?? List(),
          selectedProductTypeIds: fromJS(selectedProductTypeIds) ?? List(),
          selectedSourceMarketIds: fromJS(selectedSourceMarketIds),
          selectedDepartureAirportIds: fromJS(selectedDepartureAirportIds),
          selectedDestinationAirportIds: fromJS(selectedDestinationAirportIds),
          selectedAirlineCodes: fromJS(selectedAirlineCodes),
          selectedWeekdays: fromJS(selectedWeekdays),
          onlyUnpublished: onlyUnpublished
        },
        () => {
          this.updatePreview();
          this.autoSearch();
        }
      );
    }
  };

  autoSearch = () => {
    const searchData = this.getSearchData();
    if (
      this.arrayHasItems(searchData.seasonId) ||
      this.arrayHasItems(searchData.sourceMarketIds) ||
      this.arrayHasItems(searchData.departureAirportIds) ||
      this.arrayHasItems(searchData.destinationAirportIds) ||
      this.arrayHasItems(searchData.airlineCodes) ||
      this.arrayHasItems(searchData.weekdays) ||
      searchData.fromDate ||
      searchData.toDate
    ) {
      this.props.onSearch(searchData);
    }
  };

  arrayHasItems = array => {
    return array && array.length > 0;
  };

  saveStateToLocalStorage = () => {
    const {
      selectedSeason,
      selectedProductTypeIds,
      selectedSourceMarketIds,
      selectedDepartureAirportIds,
      selectedDestinationAirportIds,
      selectedAirlineCodes,
      selectedWeekdays,
      selectedFromDate,
      selectedToDate,
      onlyUnpublished
    } = this.state;

    localStorage.setItem(this.state.localStorageFiltersKey, {
      selectedSeason,
      selectedProductTypeIds,
      selectedSourceMarketIds,
      selectedDepartureAirportIds,
      selectedDestinationAirportIds,
      selectedAirlineCodes,
      selectedWeekdays,
      selectedFromDate,
      selectedToDate,
      onlyUnpublished
    });
  };

  getSearchData = () => {
    const {
      selectedSeason,
      selectedProductTypeIds,
      selectedSourceMarketIds,
      selectedDepartureAirportIds,
      selectedDestinationAirportIds,
      selectedWeekdays,
      selectedAirlineCodes,
      selectedFromDate,
      selectedToDate,
      onlyUnpublished
    } = this.state;
   
    return {
      seasonId: selectedSeason,
      productTypeIds: selectedProductTypeIds.toArray(),
      sourceMarketIds: selectedSourceMarketIds.toArray(),
      departureAirportIds: selectedDepartureAirportIds.toArray(),
      destinationAirportIds: selectedDestinationAirportIds.toArray(),
      airlineCodes: selectedAirlineCodes.toArray(),
      weekdays: selectedWeekdays.toArray(),
      fromDate: selectedFromDate,
      toDate: selectedToDate,
      onlyUnpublished: onlyUnpublished
    };
  };

  handleSearchClick = () => {
    this.props.onSearch(this.getSearchData());
  };

  handleReporting = filters => {
    this.setState({
      downloading: true
    });
    getDetailsReport(filters)
      .then(({ data, headers }) => {
        if (data && data != '') {
          let fileName = `charter-flight-series-export-${moment().format('YYYY_MM_DD_HH_mm_ss')}.csv`;
          let csvContent = `data:${headers['content-type']};charset=utf-8,` + data;

          var encodedUri = encodeURI(csvContent);
          var link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .finally(() =>
        this.setState({
          downloading: false
        })
      );
  };

  handleChange = () => {
    this.saveStateToLocalStorage();
    this.updatePreview();
  };

  updatePreview = async () => {
    const response = await previewSearchFlightSeries(this.getSearchData());

    this.setState({
      preview: response.data
    });
  };

  handleSeasonChange = value => {
    this.setState(
      {
        selectedSeason: value
      },
      () => this.handleChange()
    );
  };

  handleProductTypeChange = value => {
    this.setState(
      {
        selectedProductTypeIds: value
      },
      () => this.handleChange()
    );
  };

  handleSourceMarketChange = value => {
    this.setState(
      {
        selectedSourceMarketIds: value
      },
      () => this.handleChange()
    );
  };

  handleDepartureAirportChange = value => {
    this.setState(
      {
        selectedDepartureAirportIds: value
      },
      () => this.handleChange()
    );
  };

  handleDestinationAirportChange = value => {
    this.setState(
      {
        selectedDestinationAirportIds: value
      },
      () => this.handleChange()
    );
  };

  handleWeekdayChange = value => {
    this.setState(
      {
        selectedWeekdays: value
      },
      () => this.handleChange()
    );
  };

  handleAirlineChange = value => {
    this.setState(
      {
        selectedAirlineCodes: value
      },
      () => this.handleChange()
    );
  };

  handleFromChange = value => {
    this.setState(
      {
        selectedFromDate: value
      },
      () => this.handleChange()
    );
  };

  handleToChange = value => {
    this.setState(
      {
        selectedToDate: value
      },
      () => this.handleChange()
    );
  };

  handleOnlyUnpublishedChange = value => {
    this.setState(
      {
        onlyUnpublished: value
      },
      () => this.handleChange()
    );
  };
  handleClearFilters = () => {
    this.setState(
      {
        preview: null,
        selectedSeason: List(),
        selectedProductTypeIds: List(),
        selectedSourceMarketIds: List(),
        selectedDepartureAirportIds: List(),
        selectedDestinationAirportIds: List(),
        selectedAirlineCodes: List(),
        selectedWeekdays: List(),
        selectedFromDate: null,
        selectedToDate: null,
        onlyUnpublished: false
      },
      () => {
        this.saveStateToLocalStorage();
        this.updatePreview();
      }
    );
  };

  getFromDate = (selectedFromDate, selectedToDate) => {
    if (moment(selectedFromDate).isValid()) return moment(selectedFromDate);
    else if (moment(selectedToDate).isValid()) return moment(selectedToDate).clone().add(-1, 'days');
    else return null;
  };

  getToDate = (selectedToDate, selectedFromDate) => {
    if (moment(selectedToDate).isValid()) return moment(selectedToDate);
    else if (moment(selectedFromDate).isValid()) return moment(selectedFromDate).clone().add(1, 'days');
    else return null;
  };

  render() {
    const {
      preview,
      selectedSeason,
      selectedProductTypeIds,
      selectedSourceMarketIds,
      selectedDepartureAirportIds,
      selectedDestinationAirportIds,
      selectedWeekdays,
      selectedAirlineCodes,
      selectedFromDate,
      selectedToDate,
      onlyUnpublished,
      downloading
    } = this.state;
    return (
      <Flexbox alignItems={'flex-start'} wrap={'wrap'} marginBottom={'40px'}>
        <Flexbox direction={'column'} alignItems={'flex-start'}>
          <Flexbox childrenMarginRight="10px" justifyContent={'space-between'} width={'100%'}>
            <SearchBox
              items={this.props.productTypes}
              selectedItemIds={selectedProductTypeIds}
              placeholder={'Product type'}
              onChange={this.handleProductTypeChange}
              width={'210px'}
            />
            <SearchBox
                  items={fromJS(this.props.seasons)}
                  selectedItemIds={fromJS(selectedSeason)}
                  placeholder={'Planning Period'}
                  onChange={this.handleSeasonChange}
                  width={'200px'}
                />

            <SearchBox
              items={this.props.sourceMarkets}
              selectedItemIds={selectedSourceMarketIds}
              placeholder={'Source market'}
              onChange={this.handleSourceMarketChange}
              width={'150px'}
            />
            <SearchBox
              items={this.props.destinationAirports}
              selectedItemIds={selectedDestinationAirportIds}
              placeholder={'Destination airport'}
              onChange={this.handleDestinationAirportChange}
              width={'150px'}
            />
            <SearchBox
              items={this.props.departureAirports}
              selectedItemIds={selectedDepartureAirportIds}
              placeholder={'Departure airport'}
              onChange={this.handleDepartureAirportChange}
              width={'150px'}
            />

            <SearchBox
              items={this.props.weekdays}
              selectedItemIds={selectedWeekdays}
              placeholder={'Weekday'}
              onChange={this.handleWeekdayChange}
              width={'150px'}
            />
            <SearchBox
              items={this.props.airlines}
              selectedItemIds={selectedAirlineCodes}
              placeholder={'Airline'}
              onChange={this.handleAirlineChange}
              width={'150px'}
            />
          </Flexbox>
          <Flexbox childrenMarginRight="10px">
            <InputBox width={'100px'}>
              <InputLabel>From</InputLabel>
              <DateInput
                selected={moment(selectedFromDate).isValid() ? moment(selectedFromDate) : null}
                maxDate={moment(selectedToDate).isValid() ? moment(selectedToDate) : null}
                openToDate={this.getFromDate(selectedFromDate, selectedToDate)}
                onChange={this.handleFromChange}
              />
            </InputBox>
            <InputBox width={'100px'}>
              <InputLabel>To</InputLabel>
              <DateInput
                selected={moment(selectedToDate).isValid() ? moment(selectedToDate) : null}
                minDate={moment(selectedFromDate).isValid() ? moment(selectedFromDate) : null}
                openToDate={this.getToDate(selectedToDate, selectedFromDate)}
                onChange={this.handleToChange}
              />
            </InputBox>
          </Flexbox>
        </Flexbox>
        <Flexbox marginTop="25px" marginRight="10px">
          <InputCheckbox
            label={'Only unpublished changes'}
            width={'150px'}
            checked={onlyUnpublished}
            onChange={this.handleOnlyUnpublishedChange}
          />
        </Flexbox>
        <Flexbox alignItems="flex-start" direction="column" marginTop="18px">
          <Flexbox>
            <PrimaryButtonWithIcon onClick={this.handleSearchClick} marginRight={'16px'}>
              <i className="material-icons" style={{ marginRight: '8px', fontSize: '14px', float: 'left' }}>
                search
              </i>
              Search
            </PrimaryButtonWithIcon>
            <Button onClick={this.handleClearFilters} marginRight={'16px'}>
              Clear filters
            </Button>
            <PrimaryButtonWithIcon disabled={downloading} onClick={() => this.handleReporting(this.getSearchData())}>
              {!downloading && (
                <i className="material-icons" style={{ marginRight: '0px', fontSize: '14px' }}>
                  save_alt
                </i>
              )}
              {downloading && (
                <i className="material-icons" style={{ marginRight: '0px', fontSize: '14px' }}>
                  autorenew
                </i>
              )}
            </PrimaryButtonWithIcon>
          </Flexbox>
          {preview && (
            <p style={{ fontSize: '12px' }}>
              These criteria will give you <b>{preview.flightCount}</b> flight series
            </p>
          )}
        </Flexbox>
      </Flexbox>
    );
  }
}

FlightSearchPanel.propTypes = {
  onSearch: PropTypes.func.isRequired,
  seasons: PropTypes.array.isRequired,
  destinationAirports: PropTypes.instanceOf(List).isRequired,
  departureAirports: PropTypes.instanceOf(List).isRequired,
  weekdays: PropTypes.instanceOf(List).isRequired,
  airlines: PropTypes.instanceOf(List).isRequired,
  sourceMarkets: PropTypes.instanceOf(List).isRequired,
  onChange: PropTypes.func
};

export default FlightSearchPanel;
