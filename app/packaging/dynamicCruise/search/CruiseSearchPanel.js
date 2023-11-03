import React, { Component } from 'react';
import moment from 'moment';
import { fromJS } from 'immutable';
import * as localStorage from 'core/localStorage';
import { InputBox, InputLabel } from 'components/styled/Input';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import { Flexbox } from 'components/styled/Layout';
import SearchBox from 'components/FormFields/SearchBox';
import DateInput from 'components/FormFields/DateInput';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import { Button, PrimaryButtonWithIcon } from 'components/styled/Button';
import { getDateFormat } from 'helpers/dateHelper';

class CruiseSearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      fromDate: null,
      toDate: null,
      sourceMarkets: props.sourceMarkets,
      selectedSourceMarketIds: [],
      selectedSeason: null,
      selectedCruiseIds: [],
      selectedCruiseLineIds: [],
      selectedCruiseRegionIds: [],
      cruises: props.cruises || [],
      cruiseLines: props.cruiseLines || [],
      cruiseRegions: props.cruiseRegions || [],
      localStorageFiltersKey: `cruiseSearch_filters`,
      onlyUnpublished: true
    };
  }

  componentDidMount() {
    this.updateStateFromLocalStorage();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      this.props.sourceMarkets !== nextProps.sourceMarkets ||
      this.props.seasons !== nextProps.seasons ||
      this.props.cruises !== nextProps.cruises ||
      this.props.cruiseLines !== nextProps.cruiseLines ||
      this.props.cruiseRegions !== nextProps.cruiseRegions ||
      this.props.selectedCurrency !== nextProps.selectedCurrency ||
      this.props.searchPreview !== nextProps.searchPreview ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  };

  updateStateFromLocalStorage = () => {
    const savedFilters = localStorage.getItem(this.state.localStorageFiltersKey);
    if (savedFilters) {
      const {
        fromDate,
        toDate,
        selectedSourceMarketIds,
        selectedSeason,
        selectedCruiseIds,
        selectedCruiseLineIds,
        selectedCruiseRegionIds,
        onlyUnpublished
      } = savedFilters;

      this.setState({
        fromDate: fromDate ? moment(fromDate) : null,
        toDate: toDate ? moment(toDate) : null,
        selectedSourceMarketIds,
        selectedSeason,
        selectedCruiseIds,
        selectedCruiseLineIds,
        selectedCruiseRegionIds,
        onlyUnpublished
      });
    }
  };

  saveStateToLocalStorage = () => {
    const {
      fromDate,
      toDate,
      selectedSourceMarketIds,
      selectedSeason,
      selectedCruiseIds,
      selectedCruiseLineIds,
      selectedCruiseRegionIds,
      onlyUnpublished
    } = this.state;
    localStorage.setItem(this.state.localStorageFiltersKey, {
      fromDate,
      toDate,
      selectedSourceMarketIds,
      selectedSeason,
      selectedCruiseIds,
      selectedCruiseLineIds,
      selectedCruiseRegionIds,
      onlyUnpublished
    });
  };

  handleSearchClick = () => {
    this.props.onSearch(this.getSearchData());
  };

  getSearchData = () => {
    return {
      from: this.state.fromDate ? this.state.fromDate.format(getDateFormat()) : '',
      to: this.state.toDate ? this.state.toDate.format(getDateFormat()) : '',
      sourceMarketIds: this.state.selectedSourceMarketIds,
      cruiseIds: this.state.selectedCruiseIds,
      seasonIds: this.state.selectedSeason ? [this.state.selectedSeason.key] : [],
      cruiseLineIds: this.state.selectedCruiseLineIds,
      cruiseRegionIds: this.state.selectedCruiseRegionIds,
      onlyUnpublished: this.state.onlyUnpublished
    };
  };

  handleFromChange = fromDate => {
    let toDate = this.state.toDate;
    if (toDate && toDate < fromDate) {
      toDate = null;
    }
    this.setState(
      {
        fromDate,
        toDate
      },
      () => {
        this.props.onSearchPreview(this.getSearchData());
        this.saveStateToLocalStorage();
      }
    );
  };

  handleToChange = toDate => {
    this.setState(
      {
        toDate
      },
      () => {
        this.props.onSearchPreview(this.getSearchData());
        this.saveStateToLocalStorage();
      }
    );
  };

  handleSeasonChange = selectedItem => {
    const selectedSeason =
      this.state.selectedSeason && this.state.selectedSeason.key === selectedItem.key ? null : selectedItem;
    this.setState({ selectedSeason }, () => {
      this.props.onSearchPreview(this.getSearchData());
      this.saveStateToLocalStorage();
    });
  };

  handleCruiseChange = selectedItemIds => {
    this.setState({ selectedCruiseIds: selectedItemIds.toArray() }, () => {
      this.props.onSearchPreview(this.getSearchData());
      this.saveStateToLocalStorage();
    });
  };

  handleCruiseLineChange = selectedItemIds => {
    this.setState({ selectedCruiseLineIds: selectedItemIds.toArray(), selectedCruiseIds: [] }, () => {
      this.props.onSearchPreview(this.getSearchData());
      this.saveStateToLocalStorage();
    });
  };

  handleCruiseRegionChange = selectedItemIds => {
    this.setState(
      { selectedCruiseRegionIds: selectedItemIds.toArray(), selectedCruiseLineIds: [], selectedCruiseIds: [] },
      () => {
        this.props.onSearchPreview(this.getSearchData());
        this.saveStateToLocalStorage();
      }
    );
  };

  handleSourceMarketChange = selectedItemIds => {
    this.setState({ selectedSourceMarketIds: selectedItemIds.toArray() }, () => {
      this.props.onSearchPreview(this.getSearchData());
      this.saveStateToLocalStorage();
    });
  };

  handleOnlyUnpublishedSelected = isSelected => {
    this.setState({ onlyUnpublished: isSelected }, () => {
      this.props.onSearchPreview(this.getSearchData());
      this.saveStateToLocalStorage();
    });
  };

  handleClearFilters = () => {
    localStorage.removeItem(this.state.localStorageFiltersKey);
    this.setState(
      {
        fromDate: null,
        toDate: null,
        selectedSourceMarketIds: [],
        selectedSeason: null,
        selectedCruiseIds: [],
        selectedCruiseLineIds: [],
        selectedCruiseRegionIds: [],
        onlyUnpublished: true
      },
      () => this.saveStateToLocalStorage()
    );
  };

  filterCruises = () => {
    const { selectedCruiseLineIds, selectedCruiseRegionIds, cruises } = this.state;
    let filteredCruises = cruises;

    if (selectedCruiseRegionIds.length > 0) {
      filteredCruises = filteredCruises.filter(x => selectedCruiseRegionIds.includes(x.regionId));
    }

    if (selectedCruiseLineIds.length > 0) {
      filteredCruises = filteredCruises.filter(x => selectedCruiseLineIds.includes(x.lineId));
    }

    return filteredCruises;
  };

  render() {
    const {
      fromDate,
      toDate,
      selectedSourceMarketIds,
      selectedSeason,
      selectedCruiseIds,
      selectedCruiseLineIds,
      selectedCruiseRegionIds,
      onlyUnpublished
    } = this.state;
    return (
      <Flexbox alignItems={'flex-end'} wrap={'wrap'} marginBottom={'40px'}>
        <Flexbox direction={'column'} alignItems={'flex-start'}>
          <Flexbox childrenMarginRight="10px" justifyContent={'space-between'} width={'100%'}>
            <DropdownMenu
              label={'Planning period'}
              onChange={this.handleSeasonChange}
              width={'210px'}
              defaultValue={selectedSeason ? selectedSeason.value : null}
              items={this.props.seasons.map(season => ({
                key: season.id,
                value: season.name
              }))}
            />
          </Flexbox>
          <Flexbox childrenMarginRight={'10px'} width={'100%'} wrap="wrap">
            <InputBox width={'100px'}>
              <InputLabel>From</InputLabel>
              <DateInput
                selected={moment(fromDate).isValid() ? moment(fromDate) : null}
                maxDate={moment(toDate).isValid() ? moment(toDate) : null}
                openToDate={
                  moment(fromDate).isValid()
                    ? moment(fromDate)
                    : moment(toDate).isValid()
                    ? moment(toDate)
                        .clone()
                        .add(-1, 'days')
                    : null
                }
                onChange={this.handleFromChange}
              />
            </InputBox>
            <InputBox width={'100px'}>
              <InputLabel>To</InputLabel>
              <DateInput
                selected={moment(toDate).isValid() ? moment(toDate) : null}
                minDate={moment(fromDate).isValid() ? moment(fromDate) : null}
                openToDate={
                  moment(toDate).isValid()
                    ? moment(toDate)
                    : moment(fromDate).isValid()
                    ? moment(fromDate)
                        .clone()
                        .add(1, 'days')
                    : null
                }
                onChange={this.handleToChange}
              />
            </InputBox>
          </Flexbox>
        </Flexbox>

        {this.props.sourceMarkets.length > 0 && (
          <Flexbox alignItems={'flex-start'} marginRight={'25px'}>
            <Flexbox direction={'column'} alignItems={'flex-left'}>
              <Flexbox
                justifyContent={'flex-start'}
                alignItems={'flex-end'}
                wrap={'wrap'}
                width={'725px'}
                childrenMarginRight={'10px'}
              >
                <SearchBox
                  items={fromJS(this.state.sourceMarkets)}
                  selectedItemIds={fromJS(selectedSourceMarketIds)}
                  placeholder={'Source market'}
                  onChange={this.handleSourceMarketChange}
                  width={'150px'}
                />
                <SearchBox
                  items={fromJS(this.state.cruiseRegions)}
                  selectedItemIds={fromJS(selectedCruiseRegionIds)}
                  placeholder={'Cruise regions'}
                  onChange={this.handleCruiseRegionChange}
                  width={'150px'}
                />
                <SearchBox
                  items={fromJS(this.state.cruiseLines)}
                  selectedItemIds={fromJS(selectedCruiseLineIds)}
                  placeholder={'Cruise lines'}
                  onChange={this.handleCruiseLineChange}
                  width={'150px'}
                />
                <SearchBox
                  items={fromJS(this.filterCruises())}
                  selectedItemIds={fromJS(selectedCruiseIds)}
                  placeholder={'Cruises'}
                  onChange={this.handleCruiseChange}
                  width={'150px'}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox direction={'column'} marginTop="25px" justifyContent={'space-between'}>
              <InputCheckbox
                label={'Only unpublished cruises'}
                width={'150px'}
                checked={onlyUnpublished}
                onChange={this.handleOnlyUnpublishedSelected}
              />
            </Flexbox>
          </Flexbox>
        )}
        <Flexbox justifyContent="flex-start" alignItems="flex-start" marginTop="20px" direction="column">
          {this.props.searchPreview && (
            <p style={{ fontSize: '12px' }}>
              These criteria will give you <b>{this.props.searchPreview.cruiseCount}</b> cruises
              <br />
              with a total of <b>{this.props.searchPreview.resultCount}</b> results.
            </p>
          )}
          <Flexbox>
            <PrimaryButtonWithIcon onClick={this.handleSearchClick} marginRight={'16px'}>
              <i className="material-icons" style={{ marginRight: '8px', fontSize: '14px', float: 'left' }}>
                search
              </i>
              Search prices
            </PrimaryButtonWithIcon>
            <Button onClick={this.handleClearFilters} marginRight={'16px'}>
              Clear filters
            </Button>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  }
}

export default CruiseSearchPanel;
