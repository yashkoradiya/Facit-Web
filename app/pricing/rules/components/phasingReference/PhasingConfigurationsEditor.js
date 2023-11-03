import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Flexbox } from '../../../../components/styled/Layout';
import { colours } from '../../../../components/styled/defaults';
import * as matchingCriteriasApi from '../../../../apis/matchingCriteriasApi';
import PhasingCurveSearchPanel from './PhasingCurveSearchPanel';
import { Button } from '../../../../components/styled/Button';
import * as rulesApi from '../../../../apis/rulesApi';
import { isNumber, convertFromPercentage } from '../../../../helpers/numberHelper';
import { getNumberOfProperties } from '../../../../helpers/objectHelper';
import { isEmpty } from '../../../../helpers/stringHelper';
import { valueTypes } from '../../ruleConstants';
import PhasingPeriodGraph from './PhasingPeriodGraph';
import PhasingEditRuleButtons from './PhasingEditRuleButtons';
import { createCriteriaItem, createValueItem } from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import {
  filterCriteriasBasedOnAccommodations,
  getKeyForFilters,
  getKeyForProperties,
  reorderCriteriaItems
} from 'components/FormFields/form-fields-utils';
import SourceMarketEditor from '../SourceMarketEditor';
import { DropdownLabel } from 'components/styled/Dropdown';

const PhasingWrapper = styled(Flexbox)`
  border: 2px solid ${colours.tuiGrey200};
  padding: 16px;
  margin-bottom: 15px;
`;

export default function PhasingConfigurationsEditor({
  configurations,
  onChange,
  valueDefinitions,
  deleteButton,
  onSave,
  onSaveAndReturn,
  editButtonsDisabled,
  onCancel,
  saveSuccess,
  selectedApplicability,
  ruleId,
  ruleDefinitionId,
  updateProperties,
  properties,
  disabled,
  sourceMarkets
}) {
  const [criterias, setCriterias] = useState();
  const [selectedFilters, setSelectedFilters] = useState(createStoredFilters(properties));
  const [initialPhasingCurveData, setinitialPhasingCurveData] = useState([]);
  const [phasingCurveData, setPhasingCurveData] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [searchPanelKey, setSearchPanelKey] = useState(uuidv4());

  useEffect(() => {
    matchingCriteriasApi
      .get([
        'season',
        'country',
        'destination',
        'classification',
        'concept',
        'label',
        'accommodationcode',
        'contractlevel'
      ])
      .then(response => {
        const criterias = response.data;

        // Filter classification values based on available accommodations.
        filterCriteriasBasedOnAccommodations(criterias);

        const mappedCriterias = criterias.map(mc => {
          const key = mc.key;
          const values = mc.values.map(val => createValueItem(val.id, val.name, val.code, val.parentId));

          return createCriteriaItem(key, values);
        });

        // Check if Destination exists in criteria, if exists, then get the criteria index
        const destIdx = mappedCriterias.findIndex(criteria => criteria.criteriaKey === 'destination');
        if (destIdx > -1) {
          // Add placeholder value for the Resort, since it's a paginated filter.
          mappedCriterias.push(createCriteriaItem('resort', []));
        }

        const reorderedCriterias = reorderCriteriaItems(mappedCriterias, [
          'season',
          'country',
          'destination',
          'resort',
          'accommodationcode',
          'classification',
          'concept',
          'label',
          'contractlevel'
        ]);

        setCriterias(reorderedCriterias);
      });

    var curveData = configurations[0].dateBands.map(db => {
      const factor = db.values.find(x => x.type === valueTypes.percentage);
      const averageCost = db.values.find(x => x.type === valueTypes.absolute);

      return {
        from: db.from,
        to: db.to,
        factor: factor.value,
        averageCost: averageCost.value
      };
    });

    setPhasingCurveData(curveData);
    setinitialPhasingCurveData(curveData);
    // eslint-disable-next-line
  }, []);

  const previewPhasingCurve = () => {
    rulesApi.getPhasingReferenceCurve(selectedFilters).then(res => {
      setPhasingCurveData(res.data);

      const newConfigurations = [...configurations];
      if (newConfigurations.length === 0) return;

      newConfigurations[0].dateBands = createDateBands(res.data, valueDefinitions);
      onChange(newConfigurations);
      const properties = createPropertiesFromFilters(selectedFilters);
      updateProperties(properties);
    });
  };

  const handleFiltersChange = useCallback(selectedFilters => {
    const maxCommitmentPercentage = selectedFilters.selectedMaxCommitmentPercentage;
    if (!isEmpty(maxCommitmentPercentage) && !isNumber(maxCommitmentPercentage))
      setErrorMessages({ maxCommitmentPercentage: 'Not a valid number' });
    else setErrorMessages({});

    setSelectedFilters({
      ...selectedFilters,
      selectedMaxCommitmentPercentage: convertFromPercentage(maxCommitmentPercentage)
    });
  }, []);

  const resetPhasingCurve = () => {
    setSearchPanelKey(uuidv4());
    setPhasingCurveData(initialPhasingCurveData);
    setSelectedFilters([]);
    updateProperties([]);
  };

  const handleSourceMarketChange = sourceMarkets => {
    if (!configurations.length) return;
    const newConfigurations = [...configurations];

    newConfigurations[0].sourceMarkets = sourceMarkets;
    onChange(newConfigurations);
  };

  return (
    <div>
      <DropdownLabel>Source market</DropdownLabel>
      <SourceMarketEditor
        disabled={disabled}
        sourceMarkets={sourceMarkets}
        selectedSourceMarkets={configurations[0].sourceMarkets}
        onSourceMarketChange={handleSourceMarketChange}
      />
      <h2>Phasing Curve</h2>
      <PhasingWrapper direction="column" alignItems="flex-start">
        <PhasingCurveSearchPanel
          disabled={disabled}
          key={searchPanelKey}
          criterias={criterias}
          onChange={handleFiltersChange}
          errorMessages={errorMessages}
          selectedFilters={selectedFilters}
        />
        {!disabled && (
          <Flexbox childrenMarginRight="10px" marginTop="20px">
            <Button onClick={resetPhasingCurve}>Reset curve</Button>
            <Button onClick={previewPhasingCurve} disabled={getNumberOfProperties(errorMessages) > 0}>
              Preview phasing curve
            </Button>
          </Flexbox>
        )}
        {phasingCurveData.length > 0 && (
          <PhasingPeriodGraph data={transformPhasingCurveDataToGraphData(phasingCurveData)} />
        )}
      </PhasingWrapper>
      <PhasingEditRuleButtons
        deleteButton={deleteButton}
        onSave={onSave}
        onSaveAndReturn={onSaveAndReturn}
        disabled={disabled}
        dirty={editButtonsDisabled}
        onCancel={onCancel}
        saveSuccess={saveSuccess}
        selectedApplicability={selectedApplicability}
        isEdit={!!ruleId}
        ruleId={ruleId}
        ruleDefinitionId={ruleDefinitionId}
      />
    </div>
  );
}

const transformPhasingCurveDataToGraphData = phasingCurveData => {
  const initialState = {
    labels: [],
    data: []
  };

  const phasingCurve = phasingCurveData.reduce((data, db) => {
    const percentageValue = Math.floor(db.factor * 100);
    data.labels.push(db.from);
    data.data.push(percentageValue);
    data.labels.push(db.to);
    data.data.push(percentageValue);
    return data;
  }, initialState);

  return fromJS({
    labels: phasingCurve.labels,
    datasets: [
      {
        data: phasingCurve.data,
        label: 'Phasing'
      }
    ]
  });
};

const createDateBands = (phasingCurveData, valueDefinitions) => {
  const factorDef = valueDefinitions.find(x => x.get('valueType') === valueTypes.percentage);
  const averageCostDef = valueDefinitions.find(x => x.get('valueType') === valueTypes.absolute);

  return phasingCurveData.map(d => ({
    from: moment(d.from),
    to: moment(d.to),
    values: [
      {
        valueDefinitionId: factorDef.get('id'),
        value: d.factor,
        type: factorDef.get('valueType'),
        title: factorDef.get('title'),
        ageCategoryType: factorDef.get('ageCategoryType'),
        ageCategoryIndex: factorDef.get('ageCategoryIndex')
      },
      {
        valueDefinitionId: averageCostDef.get('id'),
        value: d.averageCost,
        type: averageCostDef.get('valueType'),
        title: averageCostDef.get('title'),
        ageCategoryType: averageCostDef.get('ageCategoryType'),
        ageCategoryIndex: averageCostDef.get('ageCategoryIndex')
      }
    ]
  }));
};

const createPropertiesFromFilters = filters => {
  const properties = [];
  Object.keys(filters).forEach(key => {
    if (key === 'selectedMaxCommitmentPercentage' && filters[key]) {
      properties.push({ key, value: filters[key] });
    } else if (filters[key] && filters[key].length > 0) {
      properties.push({
        key: getKeyForProperties(key),
        value: filters[key].join(',')
      });
    }
  });

  return properties;
};

const createStoredFilters = storedFilters => {
  let selectedFilters = {};
  for (const filter of storedFilters) {
    if (filter.key === 'selectedMaxCommitmentPercentage') {
      if (filter.value) {
        selectedFilters[filter.key] = filter.value;
      }
    } else {
      selectedFilters[getKeyForFilters(filter.key)] = filter.value.split(',');
    }
  }
  return selectedFilters;
};
