import React, { useState, useCallback, useEffect, useReducer, useRef } from 'react';
import { List, fromJS } from 'immutable';
import moment from 'moment';
import * as localStorage from 'core/localStorage';
import { Button, PrimaryButtonWithIcon } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';
import { InputBox, InputLabel } from 'components/styled/Input';
import SearchBox from 'components/FormFields/SearchBox';
import DateInput from 'components/FormFields/DateInput';
import { getDateFormat } from 'helpers/dateHelper';
import { transfersPreview } from '../api';

const LifeCycleStates = {
  mounted: 'mounted',
  updated: 'updated'
};

const actionConstants = {
  setFilters: 'setFilters',
  clearFilters: 'clearFilters'
};

const localStorageFiltersKey = 'transfersOverview_filters';

const filtersInitialState = {
  selectedProductTypeIds: List(),
  selectedSeasonIds: List(),
  selectedSourceMarketIds: List(),
  selectedDeparturePointIds: List(),
  selectedArrivalPointIds: List(),
  selectedWeekdays: List(),
  selectedFromDate: null,
  selectedToDate: null,
  selectedTransferTypeIds: List(),
  selectedUnitTypeIds: List()
};

function reducer(state, action) {
  switch (action.type) {
    case actionConstants.setFilters:
      return { ...state, ...action.payload };
    case actionConstants.clearFilters:
      return filtersInitialState;
    default:
      return state;
  }
}

export default function TransfersSearchPanel(props) {
  const [filters, dispatch] = useReducer(reducer, filtersInitialState);
  const [preview, setPreview] = useState(null);
  const componentState = useRef(null);

  //ComponentDidMount equivalent
  useEffect(() => {
    const savedFilters = localStorage.getItem(localStorageFiltersKey);

    if (savedFilters) {
      const {
        selectedProductTypeIds,
        selectedSeasonIds,
        selectedSourceMarketIds,
        selectedDeparturePointIds,
        selectedArrivalPointIds,
        selectedWeekdays,
        selectedFromDate,
        selectedToDate,
        selectedTransferTypeIds,
        selectedUnitTypeIds
      } = savedFilters;

      dispatch({
        type: actionConstants.setFilters,
        payload: {
          selectedProductTypeIds: fromJS(selectedProductTypeIds) ?? List(),
          selectedSeasonIds: fromJS(selectedSeasonIds) ?? List(),
          selectedSourceMarketIds: fromJS(selectedSourceMarketIds) ?? List(),
          selectedDeparturePointIds: fromJS(selectedDeparturePointIds) ?? List(),
          selectedArrivalPointIds: fromJS(selectedArrivalPointIds) ?? List(),
          selectedTransferTypeIds: fromJS(selectedTransferTypeIds) ?? List(),
          selectedUnitTypeIds: fromJS(selectedUnitTypeIds) ?? List(),
          selectedWeekdays: fromJS(selectedWeekdays) ?? List(),
          selectedFromDate: selectedFromDate ? moment(selectedFromDate) : null,
          selectedToDate: selectedToDate ? moment(selectedToDate) : null
        }
      });
    }
  }, []);

  useEffect(() => {
    // Set reference to component life cycle state
    if (!componentState.current) {
      componentState.current = LifeCycleStates.mounted;
    } else {
      componentState.current = LifeCycleStates.updated;
    }
    const currentState = componentState.current;

    saveFiltersToLocalStorage(filters);

    const payload = getPayloadData(filters);
    transfersPreview(payload).then(response => {
      // Set the preview results only when current life cycle matches the reference. (Clousure)
      if (currentState === componentState.current) {
        setPreview(response.data);
      }
    });
  }, [filters, saveFiltersToLocalStorage]);

  const saveFiltersToLocalStorage = useCallback(selectedFilters => {
    const {
      selectedProductTypeIds,
      selectedSeasonIds,
      selectedSourceMarketIds,
      selectedDeparturePointIds,
      selectedArrivalPointIds,
      selectedWeekdays,
      selectedFromDate,
      selectedToDate,
      selectedTransferTypeIds,
      selectedUnitTypeIds
    } = selectedFilters;

    localStorage.setItem(localStorageFiltersKey, {
      selectedProductTypeIds,
      selectedSeasonIds,
      selectedSourceMarketIds,
      selectedDeparturePointIds,
      selectedArrivalPointIds,
      selectedWeekdays,
      selectedFromDate,
      selectedToDate,
      selectedTransferTypeIds,
      selectedUnitTypeIds
    });
  }, []);

  const handleFilterChange = (key, value) => {
    dispatch({
      type: actionConstants.setFilters,
      payload: {
        [key]: value
      }
    });
  };

  const getOpenToDate = (fromDate, toDate) => {
    if (moment(fromDate).isValid()) return moment(fromDate);
    else if (moment(toDate).isValid()) return moment(toDate).clone().add(-1, 'days');
    else return null;
  };

  const clearFilters = () => {
    dispatch({
      type: actionConstants.clearFilters
    });
  };

  const getPayloadData = filterData => {
    const {
      selectedProductTypeIds,
      selectedSeasonIds,
      selectedSourceMarketIds,
      selectedDeparturePointIds,
      selectedArrivalPointIds,
      selectedWeekdays,
      selectedFromDate,
      selectedToDate,
      selectedTransferTypeIds,
      selectedUnitTypeIds
    } = filterData;

    return {
      productTypeIds: selectedProductTypeIds.toArray(),
      seasonIds: selectedSeasonIds.toArray(),
      sourceMarketIds: selectedSourceMarketIds.toArray(),
      departurePointIds: selectedDeparturePointIds.toArray(),
      arrivalPointIds: selectedArrivalPointIds.toArray(),
      weekdays: selectedWeekdays.toArray(),
      transferTypeIds: selectedTransferTypeIds.toArray(),
      unitTypeIds: selectedUnitTypeIds.toArray(),
      fromDate: selectedFromDate ? selectedFromDate.format(getDateFormat(4)) : null,
      toDate: selectedToDate ? selectedToDate.format(getDateFormat(4)) : null
    };
  };

  const searchCB = () => {
    props.onSearch(getPayloadData(filters));
  };

  return (
    <Flexbox width="100%" direction="column" marginBottom="10px">
      <Flexbox data-testid="search-panel" justifyContent={'flex-start'} wrap="wrap" childrenMarginRight="14px">
        <SearchBox
          items={props.productTypes}
          selectedItemIds={filters.selectedProductTypeIds}
          placeholder={'Product type'}
          onChange={value => handleFilterChange('selectedProductTypeIds', value)}
          width={'210px'}
        />
        <SearchBox
          items={props.seasons}
          selectedItemIds={filters.selectedSeasonIds}
          placeholder={'Planning Period'}
          onChange={value => handleFilterChange('selectedSeasonIds', value)}
          width={'200px'}
        />
        <SearchBox
          items={props.sourceMarkets}
          selectedItemIds={filters.selectedSourceMarketIds}
          placeholder={'Source market'}
          onChange={value => handleFilterChange('selectedSourceMarketIds', value)}
          width={'150px'}
        />
        <SearchBox
          items={props.departurePoint}
          selectedItemIds={filters.selectedDeparturePointIds}
          placeholder={'Departure point'}
          onChange={value => handleFilterChange('selectedDeparturePointIds', value)}
          width={'160px'}
        />
        <SearchBox
          items={props.arrivalPoint}
          selectedItemIds={filters.selectedArrivalPointIds}
          placeholder={'Arrival point'}
          onChange={value => handleFilterChange('selectedArrivalPointIds', value)}
          width={'160px'}
        />
        <SearchBox
          items={props.weekdays}
          selectedItemIds={filters.selectedWeekdays}
          placeholder={'Weekday'}
          onChange={value => handleFilterChange('selectedWeekdays', value)}
          width={'150px'}
        />
        <SearchBox
          items={props.transferTypes}
          selectedItemIds={filters.selectedTransferTypeIds}
          placeholder={'Transfer type'}
          onChange={value => handleFilterChange('selectedTransferTypeIds', value)}
          width={'150px'}
        />
        <SearchBox
          items={props.unitTypes}
          selectedItemIds={filters.selectedUnitTypeIds}
          placeholder={'Unit type'}
          onChange={value => handleFilterChange('selectedUnitTypeIds', value)}
          width={'150px'}
        />
        <InputBox width={'100px'}>
          <InputLabel>From</InputLabel>
          <DateInput
            selected={moment(filters.selectedFromDate).isValid() ? moment(filters.selectedFromDate) : null}
            maxDate={moment(filters.selectedToDate).isValid() ? moment(filters.selectedToDate) : null}
            openToDate={getOpenToDate(filters.selectedFromDate, filters.selectedToDate)}
            onChange={value => handleFilterChange('selectedFromDate', value)}
          />
        </InputBox>
        <InputBox width={'100px'}>
          <InputLabel>To</InputLabel>
          <DateInput
            selected={moment(filters.selectedToDate).isValid() ? moment(filters.selectedToDate) : null}
            minDate={moment(filters.selectedFromDate).isValid() ? moment(filters.selectedFromDate) : null}
            openToDate={getOpenToDate(filters.selectedFromDate, filters.selectedToDate)}
            onChange={value => handleFilterChange('selectedToDate', value)}
          />
        </InputBox>
      </Flexbox>

      <Flexbox width="100%" marginTop="20px" marginBottom="10px">
        <PrimaryButtonWithIcon onClick={searchCB} marginRight={'16px'}>
          <i className="material-icons" style={{ marginRight: '8px', fontSize: '14px' }}>
            search
          </i>
          Search
        </PrimaryButtonWithIcon>
        <Button onClick={clearFilters} marginRight={'16px'}>
          Clear filters
        </Button>
        {preview && (
          <p style={{ fontSize: '12px' }}>
            These criteria will give you <b>{preview.transferCount}</b> results
          </p>
        )}
      </Flexbox>
    </Flexbox>
  );
}
