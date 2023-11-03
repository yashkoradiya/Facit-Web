import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { List, fromJS } from 'immutable';
import * as localStorage from 'core/localStorage';
import FilteredSearchBoxes, {
  createCriteriaItem,
  createValueItem
} from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { Button, PrimaryButton } from 'components/styled/Button';
import { InputLabel, InputBox } from 'components/styled/Input';
import DateInput from 'components/FormFields/DateInput';
import InputField from 'components/FormFields/InputField';
import { Flexbox } from 'components/styled/Layout';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as api from './api';
import InputCheckbox from '../../../components/FormFields/InputCheckbox';
import * as sourceMarketApi from '../../../apis/sourceMarketsApi';
import settings from 'core/settings/settings';
import { useSelector } from 'react-redux';
import { filterCriteriasBasedOnAccommodations } from 'components/FormFields/form-fields-utils';

export default function ContractSearchPanel({ onSearch, onSearchPreview, searchPreview }) {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(List());
  const [selectedSeasonKey, setSelectedSeasonKey] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [minCommitment, setMinCommitment] = useState('');
  const [maxCommitment, setMaxCommitment] = useState('');
  const [contractAccCode, setContractAccCode] = useState('');
  const [onlyUnpublishedChanges, setOnlyUnpublishedChanges] = useState(false);
  const [updatePreview, setUpdatePreview] = useState(false);

  const localStorageFiltersKey = 'accommodationContractOverview_filters';
  const resortsList = useSelector(state => state.appState.resortsList);

  useEffect(() => {
    updateStateFromLocalStorage();
    initializeFilters().then(response => {
      setFilteredItems(response.filteredItems);
      setAllItems(response.allItems);
    });

    setUpdatePreview(true);
  }, [updateStateFromLocalStorage]);

  useEffect(() => {
    localStorage.setItem(localStorageFiltersKey, {
      selectedFilters,
      selectedSeasonKey,
      fromDate,
      toDate,
      minCommitment,
      maxCommitment,
      onlyUnpublishedChanges,
      contractAccCode
    });

    if (updatePreview) {
      onSearchPreview(
        selectedFilters,
        selectedSeasonKey,
        fromDate,
        toDate,
        minCommitment,
        maxCommitment,
        onlyUnpublishedChanges,
        contractAccCode
      );
    }
  }, [
    selectedFilters,
    selectedSeasonKey,
    fromDate,
    toDate,
    minCommitment,
    maxCommitment,
    onlyUnpublishedChanges,
    updatePreview,
    onSearchPreview,
    contractAccCode
  ]);

  const updateStateFromLocalStorage = useCallback(() => {
    const savedFilters = localStorage.getItem(localStorageFiltersKey);
    if (savedFilters) {
      const selectedFilters = fromJS(savedFilters.selectedFilters);
      const selectedSeasonKey = savedFilters.selectedSeasonKey;
      const fromDate = savedFilters.fromDate ? moment(savedFilters.fromDate) : null;
      const toDate = savedFilters.toDate ? moment(savedFilters.toDate) : null;
      const minCommitment = savedFilters.minCommitment;
      const maxCommitment = savedFilters.maxCommitment;
      const onlyUnpublishedChanges = savedFilters.onlyUnpublishedChanges;
      const contractAccCode = savedFilters.contractAccCode;

      setSelectedFilters(selectedFilters);
      setSelectedSeasonKey(selectedSeasonKey);
      setFromDate(fromDate ? moment(fromDate) : null);
      setToDate(toDate ? moment(toDate) : null);
      setMinCommitment(minCommitment);
      setMaxCommitment(maxCommitment);
      setOnlyUnpublishedChanges(onlyUnpublishedChanges);
      setContractAccCode(contractAccCode);

      if (
        selectedFilters.size > 0 ||
        selectedSeasonKey ||
        fromDate ||
        toDate ||
        minCommitment ||
        maxCommitment ||
        contractAccCode ||
        onlyUnpublishedChanges
      ) {
        onSearch(
          selectedFilters,
          selectedSeasonKey,
          fromDate,
          toDate,
          minCommitment,
          maxCommitment,
          onlyUnpublishedChanges,
          contractAccCode
        );
      }
    }
  }, [onSearch]);

  const handleFilterChange = (selectedItemIds, filteredItems) => {
    setSelectedFilters(selectedItemIds);
    setFilteredItems(filteredItems);
  };

  const handleClearFilters = () => {
    setSelectedFilters(List());
    setFilteredItems(allItems);
    setSelectedSeasonKey(null);
    setFromDate(null);
    setToDate(null);
    setMinCommitment('');
    setMaxCommitment('');
    setContractAccCode('');
  };

  const handleFromChange = date => {
    setFromDate(date);
  };

  const handleToChange = date => {
    setToDate(date);
  };

  const handleMinCommitmentChange = e => {
    setMinCommitment(e.target.value);
  };

  const handleMaxCommitmentChange = e => {
    setMaxCommitment(e.target.value);
  };

  const handleOnlyUnpublishedChanges = selected => setOnlyUnpublishedChanges(selected);

  const handleSearch = () => {
    onSearch(
      selectedFilters,
      selectedSeasonKey,
      fromDate,
      toDate,
      minCommitment,
      maxCommitment,
      onlyUnpublishedChanges,
      contractAccCode
    );
  };

  useEffect(() => {
    if (
      resortsList.length &&
      allItems.find(item => item.criteriaKey === 'resort')?.values.size !== resortsList.length
    ) {
      const valueItems = resortsList.map(item =>
        createValueItem(
          item.id,
          item.name,
          item.code,
          item.parentIds,
          item.sourceMarketIds,
          item.parentCountryIds,
          item.parentDestinationIds
        )
      );

      allItems.splice(
        allItems.findIndex(item => item.criteriaKey === 'resort'),
        1,
        createCriteriaItem('resort', valueItems)
      );
      setAllItems([...allItems]);
    }
  }, [resortsList, allItems]);

  return (
    <div style={{ marginBottom: 30 }}>
      <Flexbox alignItems="flex-start" marginRight="15px">
        <Flexbox marginRight="15px" direction={'column'} alignItems={'flex-start'}>
          <Flexbox childrenMarginRight={'10px'} width={'100%'} wrap="nowrap" alignItems="flex-start">
            <InputBox width={'100px'} marginRight={'10px'} data-testid="from-date-container">
              <InputLabel style={{ width: '220px' }}>Contract from date</InputLabel>
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
                onChange={handleFromChange}
              />
            </InputBox>
            <InputBox width={'100px'} marginRight={'10px'} data-testid="to-date-container">
              <InputLabel> Contract to date</InputLabel>
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
                onChange={handleToChange}
              />
            </InputBox>
          </Flexbox>
          <Flexbox childrenMarginRight={'10px'} width={'100%'} wrap="nowrap" alignItems="flex-start">
            <InputBox width={'100px'} marginRight={'10px'} data-testid="min-commitment-field">
              <InputLabel style={{ width: '220px' }}>Min commitment %</InputLabel>
              <InputField
                type="number"
                width="100px"
                onChange={handleMinCommitmentChange}
                value={minCommitment}
                min="0"
                max="100"
              />
            </InputBox>
            <InputBox width={'100px'} marginRight={'10px'} data-testid="max-commitment-field">
              <InputLabel style={{ width: '220px' }}>Max commitment %</InputLabel>
              <InputField
                type="number"
                width="100px"
                onChange={handleMaxCommitmentChange}
                value={maxCommitment}
                min="0"
                max="100"
              />
            </InputBox>
          </Flexbox>
        </Flexbox>
        <Flexbox direction={'column'} alignItems={'flex-left'}>
          <Flexbox alignItems={'flex-end'}>
            <Flexbox wrap={'wrap'} marginRight={'15px'} data-testid="filters-container">
              <FilteredSearchBoxes
                key={`FilteredSearchBoxes_${allItems.map(x => x.id).join('_')}`}
                items={allItems}
                filteredItems={filteredItems}
                selectedItemIds={selectedFilters}
                onChange={handleFilterChange}
              />
            </Flexbox>

            <Flexbox marginTop={'23px'}>
              <InputCheckbox
                label={'Only unpublished changes'}
                width={'154px'}
                checked={onlyUnpublishedChanges}
                onChange={handleOnlyUnpublishedChanges}
              />
            </Flexbox>

            <Flexbox direction="column" alignItems="flex-start">
              <Flexbox marginTop="12px">
                {searchPreview !== null && (
                  <p style={{ fontSize: '12px' }}>
                    These criteria will give you <b>{searchPreview}</b> contracts
                  </p>
                )}
              </Flexbox>
              <Flexbox>
                <PrimaryButton onClick={handleSearch} marginRight="8px">
                  Search
                </PrimaryButton>
                <Button onClick={handleClearFilters}>Clear filters</Button>
              </Flexbox>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </div>
  );
}

const initializeFilters = () => {
  const promises = [
    matchingCriteriasApi.get(['season', 'country', 'destination', 'concept', 'classification', 'accommodationcode']),
    api.getContractStatus(),
    sourceMarketApi.getSourceMarkets(),
    matchingCriteriasApi.getCommissionMarker()
  ];

  return Promise.all(promises).then(responses => {
    const filtersData = responses[0].data;

    // Filter classification values based on available accommodations.
    filterCriteriasBasedOnAccommodations(filtersData);

    if (responses[3].data.length) {
      // Splice in the Commission marker values after Classification field.
      const classificationFieldIdx = filtersData.findIndex(item => item.key === 'classification');
      if (classificationFieldIdx > -1) {
        filtersData.splice(classificationFieldIdx + 1, 0, responses[3].data[0]);
      } else {
        filtersData.push(responses[3].data[0]);
      }
    }

    const data = {
      criterias: filtersData,
      contractStatus: responses[1].data,
      sourceMarkets: responses[2].data
    };

    let allItems = [];
    let sourceMarkets = [];
    if (data.contractStatus) {
      const contractStatusValues = data.contractStatus.map(status =>
        createValueItem(status.id, status.name, null, null)
      );
      const contractStatusItem = createCriteriaItem('contractstatus', contractStatusValues);
      allItems.push(contractStatusItem);
    }
    if (data.sourceMarkets) {
      const sourceMarketsValues = data.sourceMarkets.map(status => createValueItem(status.id, status.name));
      const sourceMarketsItem = createCriteriaItem('sourcemarket', sourceMarketsValues);
      allItems.push(sourceMarketsItem);
    }

    data.criterias.forEach(mc => {
      const criteriaKey = mc.key;

      const values = mc.values.map(value => {
        if (settings.IS_MULTITENANT_ENABLED) {
          return createValueItem(
            value.id,
            value.name,
            value.code,
            value.parentIds,
            value.sourceMarketIds,
            value.parentCountryIds,
            value.parentDestinationIds
          );
        } else {
          return createValueItem(
            value.id,
            value.name,
            value.code,
            value.parentId,
            value.sourceMarketIds,
            value.parentCountryIds,
            value.parentDestinationIds
          );
        }
      });

      const item = createCriteriaItem(criteriaKey, values);
      allItems.push(item);

      // If the current criteriakey equals 'destination', then add a placeholder item for 'Resorts'
      if (criteriaKey === 'destination') {
        allItems.push(createCriteriaItem('resort', []));
      }
    });

    return {
      allItems,
      filteredItems: allItems,
      sourceMarkets
    };
  });
};
