import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Flexbox } from 'components/styled/Layout';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import { convertFromPercentage } from 'helpers/numberHelper';
import { searchAccommodationDefinitions, previewSearchAccommodationDefinitions } from './api';
import { getColumnDefinition } from './columnDefinitions';
import ContractSearchPanel from './ContractSearchPanel';
import Spinner from 'components/Spinner';
import CollapsableContainer from 'components/CollapsableContainer';

export default function AccommodationContractOverview({ selectedCurrency }) {
  const [searchResult, setSearchResult] = useState({ data: [], dataSetKey: null });
  const [searchPreview, setSearchPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (
    selectedFilters,
    selectedSeason,
    fromDate,
    toDate,
    minCommitment,
    maxCommitment,
    onlyUnpublishedChanges,
    contractAccCode
  ) => {
    setLoading(true);
    const request = createRequest(
      selectedFilters,
      selectedSeason,
      fromDate,
      toDate,
      minCommitment,
      maxCommitment,
      onlyUnpublishedChanges,
      contractAccCode
    );
    searchAccommodationDefinitions(request)
      .then(response => {
        const dataSetKey = uuidv4();
        setSearchResult({ data: response.data, dataSetKey });
      })
      .finally(() => setLoading(false));
  };

  const handleSearchPreview = (
    selectedFilters,
    selectedSeason,
    fromDate,
    toDate,
    minCommitment,
    maxCommitment,
    onlyUnpublishedChanges,
    contractAccCode
  ) => {
    const request = createRequest(
      selectedFilters,
      selectedSeason,
      fromDate,
      toDate,
      minCommitment,
      maxCommitment,
      onlyUnpublishedChanges,
      contractAccCode
    );
    previewSearchAccommodationDefinitions(request).then(response => {
      setSearchPreview(response.data);
    });
  };

  return (
    <Flexbox direction="column" height="100%" alignItems="flex-start">
      <Spinner loading={loading} />
      <CollapsableContainer
        title="Accommodation Contract Overview"
        hideText="Hide search filters"
        showText="Show search filters"
        localStorageKey="accommodation_contract_collapsed_search_panel"
      >
        <Flexbox alignItems="flex-start">
          <ContractSearchPanel
            onSearch={handleSearch}
            onSearchPreview={handleSearchPreview}
            searchPreview={searchPreview}
          />
        </Flexbox>
      </CollapsableContainer>

      <AgGridInfinite
        gridHeight={'100%'}
        columnDefinitions={getColumnDefinition({
          currency: selectedCurrency
        })}
        dataSet={searchResult}
        gridOptions={{
          context: {
            currency: { selected: selectedCurrency }
          },
          getRowClass: params => {
            if (!params.data) {
              return null;
            }
            if (params.data.hasUnpublishedChanges) return 'unpublished-row';
          }
        }}
        agGridKey={'accommodation_definitions_ag_grid'}
      />
    </Flexbox>
  );
}

const createRequest = (
  selectedFilters,
  selectedSeasonKey,
  fromDate,
  toDate,
  minCommitment,
  maxCommitment,
  onlyUnpublishedChanges,
  contractAccCode
) => {
  const searchFilters = selectedFilters
    .map(x => {
      return {
        key: x.get('criteriaKey'),
        values: x.get('values').toArray()
      };
    })
    .toArray();

  if (selectedSeasonKey) {
    searchFilters.push({
      key: 'season',
      values: [selectedSeasonKey]
    });
  }

  return {
    searchFilters: searchFilters.filter(m => m.values.length),
    contractFromDate: fromDate,
    contractToDate: toDate,
    minCommitmentLevel: convertFromPercentage(minCommitment),
    maxCommitmentLevel: convertFromPercentage(maxCommitment),
    onlyUnpublishedChanges,
    contractAccCode
  };
};
