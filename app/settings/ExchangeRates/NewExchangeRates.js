import React, { useState, useEffect, useCallback } from 'react';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import { InputBox, InputLabel } from 'components/styled/Input';
import DateInput from 'components/FormFields/DateInput';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import * as api from './api';
import { Button } from 'components/styled/Button';
import useAuth from 'core/identity/useAuth';
import { AgGridReact } from 'ag-grid-react';
import { getColumnDefinition } from './getColumnDefinition';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { colours } from 'components/styled/defaults';
import ExchangeRateModal from './ExchangeRateModal';
import styled from 'styled-components';
import RuleValidationModal from 'pricing/rules/components/RuleValidationModal';
import { DropdownHeader, DropdownLabel } from 'components/styled/Dropdown';
import { Container } from 'components/styled/Content';
import LoadingIndicator from 'inbox/components/LoadingIndicator';

export function NewExchangeRates() {
  const [selectedDates, setSelectedDates] = useState({ fromDate: null, toDate: null });

  const [versions, setVersions] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [selectedVersionKey, setSelectedVersionKey] = useState();
  const [baseCurrency, setBaseCurrency] = useState('');
  const [newRates, setNewRates] = useState([]);
  const [showNewExchangeRateModal, setShowNewExchangeRateModal] = useState(false);
  const [sourceMarkets, setSourceMarkets] = useState([]);
  const [error, setError] = useState(null);
  const access = useAuth();

  const [availableDates, setAvailableDates] = useState();
  const [shouldClear, setShouldClear] = useState(false);
  const [selectedAvailableDate, setSelectedAvailableDate] = useState(null);
  const [availableDatesLoading, setAvailableDateLoader] = useState(true);

  const validateDates = (selectedValue, key) => {
    const { fromDate, toDate } = selectedDates;
    let invalidDate;
    if (key === 'fromDate') {
      invalidDate = toDate ? toDate > selectedValue : true;
    } else {
      invalidDate = fromDate ? fromDate < selectedValue : true;
    }
    setError(!invalidDate);
    return invalidDate;
  };

  const handleDateSelection = (value, key) => {
    if (selectedAvailableDate) {
      setSelectedAvailableDate(null);
      setShouldClear(true);
    }
    setSelectedDates(prevState => ({ ...prevState, [key]: value }));
  };

  const loadAvailableDates = () => {
    setAvailableDateLoader(true);
    api
      .getExchangeRatesByDatePeriod()
      .then(response => {
        const availableDatePeriods = response.data.map((item, index) => {
          const value = `${moment(item.fromDate).format('DD-MM-YYYY')} - ${moment(item.toDate).format('DD-MM-YYYY')}`;

          return {
            key: index,
            value,
            fromDate: item.fromDate,
            toDate: item.toDate
          };
        });

        setAvailableDates(availableDatePeriods);
      })
      .catch(() => {
        setAvailableDates([]);
      })
      .finally(() => {
        setAvailableDateLoader(false);
      });
  };

  useEffect(() => {
    loadAvailableDates();
  }, []);

  useEffect(() => {
    const { fromDate, toDate } = selectedDates;

    // Call exchangeRates only when both the values are either null or set.
    if ((fromDate && toDate) || (!fromDate && !toDate)) {
      setExchangeRates();
    }
  }, [selectedDates, setExchangeRates]);

  const setExchangeRates = useCallback(async () => {
    const exchangeRates = await api
      .getExchangeRatesByDate(getFormattedDates(selectedDates))
      .then(response => response.data);

    const exchangeRateVersions = exchangeRates.exchangeRateVersions;
    const enabledCurrencies = exchangeRates.enabledCurrencies;
    const defaultSourceMarkets = exchangeRates.defaultSourceMarkets;

    setBaseCurrency(exchangeRates.baseCurrency);
    setSourceMarkets(defaultSourceMarkets);

    setVersions(exchangeRateVersions);

    if (exchangeRateVersions.length > 0) {
      setSelectedVersionKey(exchangeRateVersions[0].versionNumber);
    }

    const existingRates =
      exchangeRateVersions.length > 0 && exchangeRateVersions[0].rates ? exchangeRateVersions[0].rates : [];
    setRatesToState(enabledCurrencies, existingRates, exchangeRates.baseCurrency, defaultSourceMarkets);
  }, [selectedDates]);

  const setRatesToState = (enabledCurrencies, existingRates, exRateBaseCurrency, srcMarkets) => {
    const rates = enabledCurrencies.flatMap(x => {
      const exchangeRateMatches = existingRates.filter(er => er.currency === x.code);

      if (exchangeRateMatches.length === 0) {
        let rateValue = 0;
        if (x.code === exRateBaseCurrency) {
          rateValue = 1;
        }
        return {
          currency: x.code,
          name: x.name,
          rate: rateValue,
          baseCurrency: exRateBaseCurrency,
          sourceMarkets: srcMarkets
        };
      }

      return exchangeRateMatches.map(exchangeRateMatch => {
        return {
          currency: x.code,
          name: x.name,
          rate: exchangeRateMatch.rate,
          baseCurrency: exRateBaseCurrency,
          sourceMarkets: exchangeRateMatch.sourceMarkets
        };
      });
    });
    setNewRates(rates);
  };

  const handleAddNewExchangeRateVersion = () => {
    setShowNewExchangeRateModal(!showNewExchangeRateModal);
  };

  const getPlanningDates = () => {
    const { fromDate, toDate } = selectedDates;
    return {
      value: fromDate && toDate ? `${fromDate?.format('DD/MM/YYYY')} - ${toDate?.format('DD/MM/YYYY')}` : ''
    };
  };

  const validationErrorMessage = () =>
    `Selected dates ${selectedDates.fromDate?.format('DD/MM/YYYY')} - ${selectedDates.toDate?.format(
      'DD/MM/YYYY'
    )} are overlapping with existing exchange-rate Date periods.`;

  const getAvailableDatesField = () => {
    return (
      <Container margin="10px 0">
        <DropdownLabel>Available Periods</DropdownLabel>
        {!availableDatesLoading ? (
          <DropdownMenu
            clearItemSelection={clearSelection => {
              if (shouldClear) {
                setShouldClear(false);
                clearSelection();
              }
            }}
            width="160px"
            defaultValue={selectedAvailableDate ? selectedAvailableDate.value : ''}
            onChange={item => {
              if (item) {
                setSelectedAvailableDate(item);
                setSelectedDates({
                  fromDate: moment.utc(item.fromDate),
                  toDate: moment.utc(item.toDate)
                });
              }
            }}
            items={[...availableDates]}
          />
        ) : (
          <DropdownHeader>
            <LoadingIndicator loading={availableDatesLoading} iconSize="20px" />
          </DropdownHeader>
        )}
      </Container>
    );
  };

  const selectedVersion = versions.find(x => x.versionNumber === selectedVersionKey) || null;
  const readOnly = !access.settings.exchangerates.write;

  const showAddNewExchangeRateVersion = () => {
    return !readOnly && selectedDates.fromDate && selectedDates.toDate;
  };

  return (
    <Flexbox direction="column" alignItems="start">
      <PageHeader>Exchange rates</PageHeader>
      <Flexbox direction="row" style={{ margin: error ? '10px 0 0' : '10px 0' }}>
        <InputBox width="80px" marginRight="10px">
          <InputLabel>From</InputLabel>
          <DateInput
            key="from"
            selected={selectedDates.fromDate}
            onChange={value => {
              // DateInput onchange event is fired twice, hence this will prevent resetting the state.
              if (value?.toString() === selectedDates.fromDate?.toString()) return;
              
              if (validateDates(value, 'fromDate')) {
                handleDateSelection(value, 'fromDate');
              } else {
                handleDateSelection(null, 'fromDate');
              }
            }}
          />
        </InputBox>
        <InputBox width="80px" marginRight="10px">
          <InputLabel>To</InputLabel>
          <DateInput
            key="to"
            selected={selectedDates.toDate}
            onChange={value => {
              // DateInput onchange event is fired twice, hence this will prevent resetting the state.
              if (value?.toString() === selectedDates.toDate?.toString()) return;
              if (validateDates(value, 'toDate')) {
                handleDateSelection(value, 'toDate');
              } else {
                handleDateSelection(null, 'toDate');
              }
            }}
          />
        </InputBox>

        <div style={{ marginRight: '10px', marginTop: '4px' }}>
          <label>Version</label>
          <DropdownMenu
            onChange={selectedItem => setSelectedVersionKey(selectedItem.key)}
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
        {showAddNewExchangeRateVersion() && (
          <Flexbox alignSelf="flex-end">
            <Button onClick={handleAddNewExchangeRateVersion}>Add new exchange rate</Button>
          </Flexbox>
        )}
      </Flexbox>

      {error && <ErrorText>Invalid Date Selection - Select FromDate Less Than ToDate.</ErrorText>}
      {getAvailableDatesField()}
      <div
        style={{
          width: '660px',
          height: '400px',
          marginBottom: '10px'
        }}
        className="ag-theme-balham"
      >
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
          planningPeriod={getPlanningDates()}
          onSave={data => {
            setShowNewExchangeRateModal(!showNewExchangeRateModal);

            api
              .saveExchangeRateByDates({
                ...getFormattedDates(selectedDates),
                rates: data
              })
              .then(() => {
                loadAvailableDates();
                setExchangeRates();
              })
              .catch(() => {
                setValidationError(true);
              });
          }}
          baseCurrency={baseCurrency}
          sourceMarkets={sourceMarkets}
        ></ExchangeRateModal>
      )}
      <RuleValidationModal
        title="Warning"
        onClose={() => setValidationError(false)}
        show={validationError}
        message={validationErrorMessage()}
      ></RuleValidationModal>
    </Flexbox>
  );
}

/**Format dates for the payload to correct the DatePicker offset.*/
const getFormattedDates = selectedDates => {
  return Object.keys(selectedDates).reduce((acc, currVal) => {
    const date = selectedDates[currVal];
    return { ...acc, [currVal]: date ? date.format('YYYY-MM-DDTHH:mm:ss.SSS') : null };
  }, {});
};

const ErrorText = styled.p`
  color: ${colours.red};
  margin: 8px 0 0;
`;

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
  return rates.reduce(function (acc, curr) {
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
