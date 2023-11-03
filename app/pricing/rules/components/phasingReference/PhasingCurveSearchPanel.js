import React, { useState, useEffect } from 'react';
import { fromJS, List, is } from 'immutable';
import { Flexbox } from '../../../../components/styled/Layout';
import InputField from '../../../../components/FormFields/InputField';
import FilteredSearchBoxes from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { parsePaginatedResortCriteria } from 'components/FormFields/form-fields-utils';
import { useSelector } from 'react-redux';

export default function PhasingCurveSearchPanel({ criterias, errorMessages, onChange, selectedFilters, disabled }) {
  const [allCriteriaItems, setAllCriteriaItems] = useState();
  const [criteriaItems, setCriteriaItems] = useState();
  const [selectedCriterias, setSelectedCriterias] = useState(List());
  const [selectedMaxCommitmentPercentage, setSelectedMaxCommitmentPercentage] = useState(
    selectedFilters.selectedMaxCommitmentPercentage ? selectedFilters.selectedMaxCommitmentPercentage * 100 : ''
  );
  const resortsList = useSelector(state => state.appState.resortsList);

  useEffect(() => {
    setCriteriaItems(criterias);
    setAllCriteriaItems(criterias);
  }, [criterias]);

  useEffect(() => {
    if (allCriteriaItems && selectedFilters && Object.keys(selectedFilters).length) {
      const mappedFilters = Object.keys(selectedFilters).map(key => {
        return { criteriaKey: key, values: selectedFilters[key] };
      });

      const newSelectedItems = fromJS(mappedFilters);
      if (!is(newSelectedItems, selectedCriterias)) {
        setSelectedCriterias(newSelectedItems);
      }
    }
  }, [selectedFilters, selectedCriterias, allCriteriaItems]);

  useEffect(() => {
    const newAllItems = parsePaginatedResortCriteria(resortsList, allCriteriaItems);
    if (newAllItems) {
      setAllCriteriaItems(newAllItems);
    }
  }, [allCriteriaItems, resortsList]);

  const handleFilterChange = (selectedItemIds, filteredItems) => {
    setCriteriaItems(filteredItems);
    setSelectedCriterias(selectedItemIds);
    const forOnChange = selectedItemIds.toJS().reduce((acc, curr) => {
      acc[curr.criteriaKey] = curr.values;
      return acc;
    }, {});
    onChange(forOnChange);
  };

  return (
    <Flexbox justifyContent={'flex-start'} wrap="wrap">
      {criterias && (
        <FilteredSearchBoxes
          items={allCriteriaItems}
          filteredItems={criteriaItems}
          selectedItemIds={selectedCriterias}
          onChange={handleFilterChange}
        />
      )}
      <InputField
        disabled={disabled}
        width="150px"
        placeholder={'% and lower'}
        label={'Max commitment percentage'}
        onChange={e => setSelectedMaxCommitmentPercentage(e.target.value)}
        value={selectedMaxCommitmentPercentage}
        errorMessage={errorMessages.maxCommitmentPercentage}
      />
    </Flexbox>
  );
}
