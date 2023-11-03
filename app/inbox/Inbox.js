import React, { useState } from 'react';
import styled from 'styled-components';
import { Flexbox } from 'components/styled/Layout';
import InboxFilters from './components/InboxFilters';
import FailedExports from './components/FailedExports';
import InboxStatusGrid from './components/InboxStatusGrid/InboxStatusGrid';
import {
  unpublishedContractColDef,
  newAccomColDef,
  failedImportsColDef,
  nonContractedColDefs
} from './inboxColumnDefinitions';
import {
  INBOX_FAILED_IMPORTS,
  INBOX_NEW_ACCOMMODATIONS,
  INBOX_NONCONTRACTED_DISCOUNTS,
  INBOX_UNPUBLISHED_CHANGES
} from './InboxConstants';

export default function Inbox() {
  const [selectedFilters, setSelectedFilters] = useState(null);

  const updateSelectedFilters = filters => {
    setSelectedFilters(filters);
  };

  return (
    <InboxWrapper data-testid="inbox-wrapper">
      <InboxFilters onChange={updateSelectedFilters} />
      {selectedFilters && (
        <Columns>
          <Flexbox direction="column" flex="1">
            <InboxStatusGrid
              gridKey={INBOX_NEW_ACCOMMODATIONS}
              gridHeight="30vh"
              title="New Accommodations"
              columnDefinitions={newAccomColDef}
              dependencies={getDependencies(selectedFilters, [
                'season',
                'sourcemarket',
                'country',
                'destination',
                'resort',
                'airport',
                'package_type'
              ])}
            />
            <InboxStatusGrid
              gridKey={INBOX_FAILED_IMPORTS}
              gridHeight="30vh"
              title="Failed Imports"
              columnDefinitions={failedImportsColDef}
              dependencies={getDependencies(selectedFilters, [
                'season',
                'sourcemarket',
                'country',
                'destination',
                'resort',
                'airport',
                'package_type'
              ])}
            />
            <FailedExports
              dependencies={getDependencies(selectedFilters, [
                'season',
                'sourcemarket',
                'country',
                'destination',
                'resort',
                'airport',
                'package_type'
              ])}
            />
          </Flexbox>
          <Flexbox direction="column" flex="1">
            <InboxStatusGrid
              gridKey={INBOX_UNPUBLISHED_CHANGES}
              gridHeight="60vh"
              title="Unpublished Contract Changes"
              columnDefinitions={unpublishedContractColDef}
              dependencies={getDependencies(selectedFilters, [
                'season',
                'sourcemarket',
                'country',
                'destination',
                'resort',
                'airport',
                'package_type'
              ])}
            />
            <InboxStatusGrid
              gridKey={INBOX_NONCONTRACTED_DISCOUNTS}
              gridHeight="30vh"
              title="Non Contracted Discounts"
              columnDefinitions={nonContractedColDefs}
              dependencies={getDependencies(selectedFilters, [
                'season',
                'sourcemarket',
                'country',
                'destination',
                'resort',
                'airport',
                'package_type'
              ])}
            />
          </Flexbox>
        </Columns>
      )}
    </InboxWrapper>
  );
}

function getDependencies(filters, keys) {
  return keys.reduce((acc, curr) => {
    acc[getKeyMapper(curr)] = filters[curr];
    return acc;
  }, {});
}

function getKeyMapper(key) {
  switch (key) {
    case 'season':
      return 'seasonIds';
    case 'sourcemarket':
      return 'sourceMarketIds';
    case 'country':
      return 'countryIds';
    case 'destination':
      return 'destinationIds';
    case 'resort':
      return 'resortIds';
    case 'airport':
      return 'airportIds';
    case 'package_type':
      return 'packageTypes';
  }
}

const InboxWrapper = styled.div`
  padding: 0 20px 20px 20px;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 20px;
  align-items: start;
`;
