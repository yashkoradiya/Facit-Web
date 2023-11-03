import React, { useState, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import { PrimaryButton, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';
import { AgGridReact } from 'ag-grid-react';
import { getColumnDefinition } from './getColumnDefinition';
import { colours } from 'components/styled/defaults';
import { Tabs, Tab, TabContent, TabText } from 'components/styled/Tabs';
import SourceMarketEditor from 'pricing/rules/components/SourceMarketEditor';
import ConfirmationBox from './ConfirmationBox';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';

export default function ExchangeRatemodal({
  show,
  onClose,
  onSave,
  currentExchangeRates,
  planningPeriod,
  baseCurrency,
  sourceMarkets
}) {
  const [configurations, setConfigurations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const ratesGroupedBySourceMarket = currentExchangeRates.reduce(function(acc, curr) {
      const existingGroups = acc.filter(x => x.sourceMarkets.some(sm => curr.sourceMarkets.some(y => y.id === sm.id)));

      if (existingGroups.length > 0) {
        existingGroups.forEach(group => {
          group.rates.push(createRates(curr));
        });
      } else {
        const configuration = {
          sourceMarkets: curr.sourceMarkets,
          rates: [createRates(curr)]
        };
        acc.push(configuration);
      }

      return acc;
    }, []);

    setConfigurations(ratesGroupedBySourceMarket);
  }, [currentExchangeRates]);

  const onCellValueChanged = params => {
    const row = params.data;

    const ratesToUpdate = configurations[currentTab].rates;
    const idx = ratesToUpdate.findIndex(x => x.currency === row.currency);

    const updatedConfigurations = [...configurations];
    updatedConfigurations[currentTab].rates[idx] = { ...row };
    setConfigurations(updatedConfigurations);
  };

  const handleConfirmation = () => {
    const payload = configurations.map(x => {
      return { rates: x.rates, sourceMarketIds: x.sourceMarkets.map(y => y.id) };
    });

    onSave(payload);
    setShowConfirmation(false);
  };

  const showConfirmationBox = () => {
    setShowConfirmation(true);
  };

  const handleTabClick = index => {
    setCurrentTab(index);
  };

  const handleSourceMarketMarginSplit = sourceMarketsToSplit => {
    let updatedConfigurations = [...configurations];

    let oldConfiguration = updatedConfigurations.find(x =>
      x.sourceMarkets.some(y => sourceMarketsToSplit.some(z => z.id === y.id))
    );

    if (oldConfiguration) {
      oldConfiguration.sourceMarkets = oldConfiguration.sourceMarkets.filter(
        x => !sourceMarketsToSplit.some(y => y.id === x.id)
      );
    } else {
      oldConfiguration = updatedConfigurations[0];
    }

    const newConfiguration = {
      sourceMarkets: [...sourceMarketsToSplit],
      rates: oldConfiguration.rates.map(x => createRates(x))
    };

    updatedConfigurations.push(newConfiguration);
    updatedConfigurations = updatedConfigurations.filter(x => x.sourceMarkets.length);

    setConfigurations(updatedConfigurations);
    setCurrentTab(updatedConfigurations.length - 1);
  };

  const handleSourceMarketMerge = sourceMarketsAfterMerge => {
    let updatedConfigurations = [...configurations];

    let configurationToUpdate = updatedConfigurations[currentTab];

    if (sourceMarketsAfterMerge.length > 0) {
      configurationToUpdate.sourceMarkets = [];

      sourceMarketsAfterMerge.forEach(sourceMarket => {
        const existing = updatedConfigurations.find(x => x.sourceMarkets.some(sm => sm.id === sourceMarket.id));
        if (existing) {
          existing.sourceMarkets = existing.sourceMarkets.filter(sm => sm.id !== sourceMarket.id);
        }
        configurationToUpdate.sourceMarkets.push(sourceMarket);
      });
    } else if (sourceMarketsAfterMerge.length === 0 && configurations.length > 1) {
      updatedConfigurations.splice(currentTab, 1);
      setCurrentTab(0);
    }

    updatedConfigurations = updatedConfigurations.filter(x => x.sourceMarkets.length);
    setConfigurations(updatedConfigurations);
  };

  const validSourceMarketRates = () => {
    if (configurations.some(c => c.rates.some(x => x.rate === 0))) return false;

    let isValid = true;
    sourceMarkets.forEach(sm => {
      const sourceMarketHasRates = configurations.some(x => x.sourceMarkets.some(y => y.id === sm.id));
      if (!sourceMarketHasRates) isValid = false;
    });

    return isValid;
  };

  const title = planningPeriod ? `New Exchange Rate for ${planningPeriod.value} ` : null;

  if (configurations.length === 0) return <React.Fragment />;

  return (
    <React.Fragment>
      <ModalBase show={show} onRequestClose={onClose} title={title} width="520px">
        <Flexbox justifyContent="flex-start" marginTop="8px">
          <Tabs data-testid="sourcemarket-tabs">
            {configurations.map((item, index) => (
              <Tab onClick={() => handleTabClick(index)} key={index} isSelected={index === currentTab}>
                <TabText>{item.sourceMarkets.map(x => x.name).join(', ')}</TabText>
              </Tab>
            ))}
            <Tab onClick={() => handleTabClick('splitMarket')} isSelected={currentTab === 'splitMarket'}>
              <TabText>+ Split source markets</TabText>
            </Tab>
          </Tabs>
        </Flexbox>

        {currentTab !== 'splitMarket' && configurations[currentTab] && (
          <TabContent width="100%" height="100%">
            <Flexbox height="100%" direction="column" alignItems="flex-start">
              <SourceMarketEditor
                key={`currentTab_${currentTab}_${configurations[currentTab].sourceMarkets.map(x => x.id).join('_')}`}
                tabCount={configurations.length}
                sourceMarkets={sourceMarkets}
                selectedSourceMarkets={configurations[currentTab].sourceMarkets}
                onSourceMarketChange={handleSourceMarketMerge}
                buttonText={'Merge'}
              />
              <div
                style={{
                  width: '450px',
                  height: '300px',
                  marginBottom: '10px',
                  marginTop: '10px'
                }}
                className="ag-theme-balham"
              >
                {
                  <AgGridReact
                    suppressColumnVirtualisation={true}
                    key={configurations[currentTab].sourceMarkets.map(x => x.id).join('_')}
                    rowData={configurations[currentTab].rates}
                    columnDefs={getColumnDefinition(true, baseCurrency)}
                    onCellValueChanged={onCellValueChanged}
                    getContextMenuItems={getDefaultContextMenuItems}
                    gridOptions={{
                      getRowStyle: params => {
                        return params.data.currency === params.data.baseCurrency
                          ? { 'background-color': colours.greyTableInactive }
                          : null;
                      },
                      defaultColDef: {
                        tooltipValueGetter: params => {
                          return params.data.currency === params.data.baseCurrency
                            ? 'Base currency can not be edited'
                            : null;
                        }
                      },
                      suppressPropertyNamesCheck: true
                    }}
                  />
                }
              </div>

              <Flexbox alignSelf="flex-end" marginTop="auto">
                <PrimaryButton
                  marginRight="10px"
                  disabled={!validSourceMarketRates()}
                  onClick={() => showConfirmationBox()}
                >
                  Create new version
                </PrimaryButton>
                <Button onClick={onClose}>Cancel</Button>
              </Flexbox>
            </Flexbox>
          </TabContent>
        )}
        {currentTab === 'splitMarket' && (
          <TabContent width="100%">
            <Flexbox height="300px" direction="column" alignItems="flex-start">
              <SourceMarketEditor
                key={currentTab}
                tabCount={configurations.length}
                onSourceMarketChange={handleSourceMarketMarginSplit}
                sourceMarkets={sourceMarkets}
                buttonText={'Split'}
              />
            </Flexbox>
          </TabContent>
        )}
      </ModalBase>

      <ConfirmationBox
        show={showConfirmation}
        title={title}
        onConfirmation={() => handleConfirmation()}
        onCancel={() => setShowConfirmation(false)}
      ></ConfirmationBox>
    </React.Fragment>
  );
}

const createRates = curr => {
  return { currency: curr.currency, name: curr.name, rate: curr.rate, baseCurrency: curr.baseCurrency };
};
