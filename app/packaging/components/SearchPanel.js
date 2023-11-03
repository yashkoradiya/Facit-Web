import React, { Component } from 'react';
import moment from 'moment';
import { fromJS, List } from 'immutable';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import * as localStorage from 'core/localStorage';
import { InputBox, InputLabel } from 'components/styled/Input';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import { Flexbox } from 'components/styled/Layout';
import DateInput from 'components/FormFields/DateInput';
import { Button, PrimaryButtonWithIcon } from 'components/styled/Button';
import settings from '../../core/settings/settings';
import { withRouter } from 'react-router';
import FilteredSearchBoxes from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    const localStorageGeographyFiltersKey = `${props.overviewFilterKey}_geographySearch_filters`;
    const accommodationId = new URLSearchParams(this.props.location.search).get('accommodationId');
    let urlSearchData = null;
    if (accommodationId) {
      window.history.replaceState({}, null, this.props.location.pathname);
      localStorage.removeItem(localStorageGeographyFiltersKey);
      urlSearchData = { accommodationId };
    }

    this.state = {
      page: 1,
      fromDate: null,
      toDate: null,
      baseRoomSelected: false,
      onlyUnpublished: false,
      duration: 7,
      localStorageFiltersKey: `${props.overviewFilterKey}_filters`,
      localStorageGeographyFiltersKey: localStorageGeographyFiltersKey,
      resetFiltersKey: uuidv4(),
      urlSearchData: urlSearchData,
      filteredItems: this.props.criterias,
      selectedItemIds: List()
    };
  }

  async componentDidMount() {
    if (this.state.urlSearchData) {
      this.saveStateToLocalStorage();
    } else {
      this.updateStateFromLocalStorage();
    }
  }

  updateStateFromLocalStorage = () => {
    const savedFilters = localStorage.getItem(this.state.localStorageFiltersKey);
    if (savedFilters) {
      const { fromDate, toDate, baseRoomSelected, duration, onlyUnpublished, selectedItemIds } = savedFilters;

      this.setState({
        fromDate: fromDate ? moment(fromDate) : null,
        toDate: toDate ? moment(toDate) : null,
        baseRoomSelected,
        duration,
        onlyUnpublished,
        selectedItemIds: fromJS(selectedItemIds)
      });
    }
  };

  saveStateToLocalStorage = () => {
    const { fromDate, toDate, baseRoomSelected, duration, onlyUnpublished, selectedItemIds } = this.state;

    localStorage.setItem(this.state.localStorageFiltersKey, {
      fromDate,
      toDate,
      baseRoomSelected,
      duration,
      onlyUnpublished,
      selectedItemIds: selectedItemIds.toJS()
    });
  };

  handleSearchClick = () => {
    const searchData = this.getSearchData();
    this.props.onSearchPreview(searchData);
    this.props.onSearch(searchData);
  };

  getSearchData = () => {
    const selectedCriteriaIds = this.state.selectedItemIds.toJS();
    const criteriaPayload = selectedCriteriaIds.reduce((acc, item) => {
      acc[item.criteriaKey] = item.values;
      return acc;
    }, {});
    return {
      ...this.state,
      ...criteriaPayload
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

  handleBaseRoomSelected = isSelected => {
    this.setState({ baseRoomSelected: isSelected }, () => {
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
    localStorage.removeItem(this.state.localStorageGeographyFiltersKey);
    this.setState(
      {
        fromDate: null,
        toDate: null,
        baseRoomSelected: false,
        onlyUnpublished: false,
        duration: 7,
        resetFiltersKey: uuidv4(),
        urlSearchData: null,
        selectedItemIds: List()
      },
      () => this.saveStateToLocalStorage()
    );
  };

  handleFiltersChange = (selectedItemIds, filteredItems) => {
    this.setState({ filteredItems, selectedItemIds }, () => {
      this.saveStateToLocalStorage();
      this.props.onSearchPreview(this.getSearchData());
    });
  };

  render() {
    const { fromDate, toDate, baseRoomSelected, onlyUnpublished, selectedItemIds, filteredItems } = this.state;

    return (
      <Flexbox marginBottom="16px">
        <Flexbox wrap="wrap">
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
                    ? moment(toDate).clone().add(-1, 'days')
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
                    ? moment(fromDate).clone().add(1, 'days')
                    : null
                }
                onChange={this.handleToChange}
              />
            </InputBox>
          </Flexbox>

          <Flexbox wrap="wrap">
            <FilteredSearchBoxes
              items={this.props.criterias}
              filteredItems={filteredItems}
              selectedItemIds={selectedItemIds}
              onChange={this.handleFiltersChange}
            />
          </Flexbox>
        </Flexbox>
        <Flexbox direction="column">
          <Flexbox direction="column" marginBottom="16px" marginTop="16px">
            {settings.SHOW_BASEROOMS && (
              <InputCheckbox
                label={'Only base rooms'}
                width={'150px'}
                checked={baseRoomSelected}
                onChange={this.handleBaseRoomSelected}
              />
            )}
            <InputCheckbox
              label={'Only unpublished changes'}
              width={'150px'}
              checked={onlyUnpublished}
              onChange={this.handleOnlyUnpublishedSelected}
            />
          </Flexbox>
          {this.props.searchPreview && (
            <p style={{ fontSize: '12px' }}>
              These criteria will give you <b>{this.props.searchPreview.accommodationCount}</b> accommodations
              <br />
              with a total of <b>{this.props.searchPreview.roomTypeCount}</b> results.
              <br />
            </p>
          )}
          <Flexbox data-testid="buttons-container">
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

SearchPanel.propTypes = {
  overviewFilterKey: PropTypes.string.isRequired
};

export default withRouter(SearchPanel);
