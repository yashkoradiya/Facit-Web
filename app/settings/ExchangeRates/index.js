import React, { useState, useEffect, useCallback } from 'react';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import { AgGridReact } from 'ag-grid-react';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import { Button } from 'components/styled/Button';
import * as api from './api';
import ExchangeRateModal from './ExchangeRateModal';
import { getColumnDefinition } from './getColumnDefinition';
import { getDateFormat } from 'helpers/dateHelper';
import moment from 'moment';
import { colours } from 'components/styled/defaults';
import useAuth from 'core/identity/useAuth';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';

export default function ExchangeRates() {
  const [planningPeriods, setPlanningPeriods] = useState([]);
  const [newRates, setNewRates] = useState([]);
  const [versions, setVersions] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [selectedVersionKey, setSelectedVersionKey] = useState();
  const [selectedPlanningPeriodKey, setSelectedPlanningPeriodKey] = useState();
  const [showNewExchangeRateModal, setShowNewExchangeRateModal] = useState(false);
  const [sourceMarkets, setSourceMarkets] = useState([]);
  const access = useAuth();

  useEffect(() => {
    async function getData() {
      initializeData();
    }
    getData();
  }, [initializeData]);

  const initializeData = useCallback(async () => {
    const result = await api.getPlanningPeriods();
    const items = result.data.map(x => {
      return { key: x.id, value: x.name };
    });

    setPlanningPeriods(items);
    if (!selectedPlanningPeriodKey) {
      handlePlanningPeriodChange(items[0]);
    } else {
      handlePlanningPeriodChange(items.find(x => x.key === selectedPlanningPeriodKey));
    }
  }, [handlePlanningPeriodChange, selectedPlanningPeriodKey]);

  const handlePlanningPeriodChange = useCallback(async selectedItem => {
    setSelectedPlanningPeriodKey(selectedItem.key);

    const exchangeRates = await fetchExchangeRates(selectedItem.key);
    const versions = exchangeRates.exchangeRateVersions;
    const enabledCurrencies = exchangeRates.enabledCurrencies;
    const defaultSourceMarkets = exchangeRates.defaultSourceMarkets;

    setBaseCurrency(exchangeRates.baseCurrency);
    setSourceMarkets(defaultSourceMarkets);

    setVersions(versions);
    if (versions.length > 0) {
      setSelectedVersionKey(versions[0].versionNumber);
    }

    const existingRates = versions.length > 0 && versions[0].rates ? versions[0].rates : [];
    setRatesToState(enabledCurrencies, existingRates, exchangeRates.baseCurrency, defaultSourceMarkets);
  }, []);

  const setRatesToState = (enabledCurrencies, existingRates, baseCurrency, sourceMarkets) => {
    const rates = enabledCurrencies.flatMap(x => {
      const exchangeRateMatches = existingRates.filter(er => er.currency === x.code);

      if (exchangeRateMatches.length === 0) {
        let rateValue = 0;
        if (x.code === baseCurrency) {
          rateValue = 1;
        }
        return { currency: x.code, name: x.name, rate: rateValue, baseCurrency, sourceMarkets: sourceMarkets };
      }

      return exchangeRateMatches.map(exchangeRateMatch => {
        return {
          currency: x.code,
          name: x.name,
          rate: exchangeRateMatch.rate,
          baseCurrency,
          sourceMarkets: exchangeRateMatch.sourceMarkets
        };
      });
    });
    setNewRates(rates);
  };

  const handleVersionChange = selectedItem => {
    setSelectedVersionKey(selectedItem.key);
  };

  const handleAddNewExchangeRateVersion = () => {
    setShowNewExchangeRateModal(!showNewExchangeRateModal);
  };

  const handleSaveExchangeRate = data => {
    setShowNewExchangeRateModal(!showNewExchangeRateModal);
    api.saveExchangeRate(selectedPlanningPeriod.key, data).then(() => {
      initializeData();
    });
  };

  const selectedPlanningPeriod = planningPeriods.find(x => x.key === selectedPlanningPeriodKey);
  const selectedVersion = versions.find(x => x.versionNumber === selectedVersionKey) || null;

  const readOnly = !access.settings.exchangerates.write;
  return (
    <div>
      <Flexbox marginBottom="10px">
        <PageHeader>Exchange rates</PageHeader>
      </Flexbox>
      <Flexbox direction="row" style={{ marginBottom: '20px' }}>
        <div style={{ marginRight: '10px' }}>
          <label>Planning period</label>
          <DropdownMenu
            onChange={handlePlanningPeriodChange}
            selectedItem={selectedPlanningPeriod}
            width={'120px'}
            defaultValue={selectedPlanningPeriod ? selectedPlanningPeriod.value : null}
            items={planningPeriods}
          />
        </div>

        <div style={{ marginRight: '10px' }}>
          <label>Version</label>
          <DropdownMenu
            onChange={handleVersionChange}
            width={'120px'}
            defaultValue={
              selectedVersion
                ? `(v.${selectedVersion.versionNumber}) ${moment(selectedVersion.createdDate).format(getDateFormat(1))}`
                : null
            }
            items={versions.map(i => {
              return {
                key: i.versionNumber,
                value: `(v.${i.versionNumber}) ${moment(i.createdDate).format(getDateFormat(1))}`
              };
            })}
          />
        </div>
        {!readOnly && (
          <Flexbox alignSelf="flex-end">
            <Button onClick={handleAddNewExchangeRateVersion}>Add new exchange rate</Button>
          </Flexbox>
        )}
      </Flexbox>
      <div
        style={{
          width: '660px',
          height: '400px',
          marginBottom: '10px'
        }}
        className="ag-theme-balham"
      >
        {
          <AgGridReact
            suppressColumnVirtualisation={true}
            rowData={selectedVersion ? sort(groupRates(selectedVersion.rates)) : []}
            columnDefs={getColumnDefinition(false, baseCurrency)}
            getContextMenuItems={getDefaultContextMenuItems}
            gridOptions={{
              getRowStyle: params => {
                return params.data.baseCurrency === params.data.code
                  ? { 'background-color': colours.greyTableInactive }
                  : null;
              },
              defaultColDef: {
                tooltipValueGetter: params => {
                  return params.data.baseCurrency === params.data.code ? 'Base currency' : null;
                }
              },
              suppressPropertyNamesCheck: true
            }}
          />
        }
      </div>
      {selectedVersion && (
        <Flexbox>
          <label>
            Created by {selectedVersion.createdBy} {moment(selectedVersion.createdDate).format(getDateFormat())}
          </label>
        </Flexbox>
      )}

      {newRates && (
        <ExchangeRateModal
          show={showNewExchangeRateModal}
          onClose={() => setShowNewExchangeRateModal(false)}
          currentExchangeRates={sort(newRates)}
          planningPeriod={selectedPlanningPeriod}
          onSave={handleSaveExchangeRate}
          baseCurrency={baseCurrency}
          sourceMarkets={sourceMarkets}
        ></ExchangeRateModal>
      )}
    </div>
  );
}

const fetchExchangeRates = async seasonId => {
  const exchangeRateResponse = await api.getExchangeRates(seasonId);
  return exchangeRateResponse.data;
};

const sort = rates => {
  if (!rates || rates.length == 0) return rates;

  const sorted = rates.sort(
    (a, b) =>
      (a.currency >= b.currency ? 1 : -1) ||
      (a.sourceMarkets.map(sm => sm.name).join() > b.sourceMarkets.map(sm => sm.name).join() ? 1 : -1)
  );
  return sorted;
};

const groupRates = rateVersion => {
  const rates = [...rateVersion];
  return rates.reduce(function(acc, curr) {
    const matchingRate = acc.find(x => x.currency === curr.currency && x.rate === curr.rate);

    if (matchingRate) {
      matchingRate.sourceMarkets = matchingRate.sourceMarkets.concat(curr.sourceMarkets);
      matchingRate.sourceMarkets.sort((a, b) => (a.name >= b.name ? 1 : -1));
    } else {
      acc.push({ ...curr });
    }

    return acc;
  }, []);
};
