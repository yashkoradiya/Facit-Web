import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import SourceMarketEditor from '../SourceMarketEditor';
import { Tabs, Tab, TabText, TabContent } from '../../../../components/styled/Tabs';
import { ErrorBox, SubHeader, Flexbox } from '../../../../components/styled/Layout';
import MarginBandsGraph from '../../../components/MarginBandsGraph';
import DateBandsEditor from '../dateBandEditor/DateBandsEditor';
import DefaultEditRuleButtons from '../DefaultEditRuleButtons';
import flattenDateBands from '../dateBandEditor/utils/flattenDateBands';
import * as dateBandValidator from '../dateBandEditor/dateBandValidator';
import PreDefinedDateBandsPicker from '../PreDefinedDateBandsPicker';
import { List } from 'immutable';

class DefaultConfigurationsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      dateBandEditorHasFocus: false,
      validationMessages: {},
      dateBandsEditorKey: uuidv4()
    };
  }

  handleTabClick = tabIndex => {
    this.setState({ currentTab: tabIndex });
  };

  handleDateBandsChanged = (dateBands, validationMessages) => {
    const configurations = [...this.props.configurations];
    configurations[this.state.currentTab].dateBands = dateBands;
    this.props.onChange(configurations, Object.keys(validationMessages).length > 0);
    this.setState({ validationMessages });
  };

  handlePreDefinedDateBandsChanged = preDefinedDateBands => {
    const dateBands = preDefinedDateBands.map(db => ({
      from: moment(db.from),
      to: moment(db.to),
      key: uuidv4(),
      values: this.props.valueDefinitions.flatMap(vd => {
        return this.props.durationGroups.map(dg => ({
          valueDefinitionId: vd.get('id'),
          value: null,
          durationGroup: dg
        }));
      })
    }));

    this.setState({ dateBandsEditorKey: uuidv4() });
    const configurations = [...this.props.configurations];

    const hasExistingData = configurations[this.state.currentTab].dateBands.length > 0;
    if (hasExistingData && !confirm('Are you sure you want to replace existing date bands?')) {
      return;
    }

    this.handleDateBandsChanged(dateBands, {});
  };

  handleSourceMarketMarginSplit = sourceMarkets => {
    const configurations = [...this.props.configurations];

    let oldConfiguration = configurations.find(x => x.sourceMarkets.some(y => sourceMarkets.some(z => z.id === y.id)));
    if (oldConfiguration) {
      oldConfiguration.sourceMarkets = oldConfiguration.sourceMarkets.filter(
        x => !sourceMarkets.some(y => y.id === x.id)
      );
    } else {
      oldConfiguration = { ...configurations[0], sourceMarkets };
    }

    const newConfiguration = {
      ...oldConfiguration,
      dateBands: oldConfiguration.dateBands.map(db => {
        return {
          from: moment(db.from),
          to: moment(db.to),
          key: uuidv4(),
          values: db.values.map(v => {
            return {
              ageCategoryIndex: v.ageCategoryIndex,
              ageCategoryType: v.ageCategoryType,
              durationGroup: v.durationGroup ? { ...v.durationGroup } : null,
              id: v.id,
              sortOrder: v.sortOrder,
              title: v.title,
              type: v.type,
              value: v.value,
              valueDefinitionId: v.valueDefinitionId
            };
          })
        };
      }),
      sourceMarkets
    };

    configurations.push(newConfiguration);
    const validConfigurations = configurations.filter(x => x.sourceMarkets.length);
    this.props.onChange(validConfigurations);
    this.setState({ currentTab: validConfigurations.length - 1 });
  };

  handleSourceMarketMarginMerge = sourceMarkets => {
    const configurations = [...this.props.configurations];
    sourceMarkets.forEach(x => {
      const oldConfiguration = configurations.find(y => y.sourceMarkets.some(z => z.id === x.id));
      if (oldConfiguration) {
        oldConfiguration.sourceMarkets = oldConfiguration.sourceMarkets.filter(z => z.id !== x.id);
      }
    });

    const previousSourceMarkets = [...configurations[this.state.currentTab].sourceMarkets];

    configurations[this.state.currentTab].sourceMarkets = sourceMarkets;
    const validConfigurations = configurations.filter(x => x.sourceMarkets.length);

    if (validConfigurations.length === 0) {
      validConfigurations.push({ ...configurations[this.state.currentTab], sourceMarkets: previousSourceMarkets });
    }

    if (sourceMarkets.length === 0) {
      const previousTabIndex = this.state.currentTab === 0 ? 0 : this.state.currentTab - 1;
      this.setState({ currentTab: previousTabIndex }, () => this.props.onChange(validConfigurations));
    } else {
      const currentConfiguration = validConfigurations.find(y =>
        y.sourceMarkets.some(z => z.id === sourceMarkets[0].id)
      );
      this.setState({ currentTab: validConfigurations.indexOf(currentConfiguration) });
      this.props.onChange(validConfigurations);
    }
  };

  handleSave = onSave => {
    const validationMessages = this.props.configurations.reduce((validationMsgs, configuration) => {
      const flatDateBands = flattenDateBands(configuration.dateBands);
      return dateBandValidator.validateEverything(flatDateBands, validationMsgs, this.props.valueDefinitions.toJS());
    }, {});

    this.setState({ validationMessages });

    if (Object.values(validationMessages).length > 0) {
      this.props.onChange(this.props.configurations, true);
      return;
    }

    onSave();
  };

  render() {
    const {
      valueDefinitions,
      configurations,
      sourceMarkets,
      errorMessage,
      currency,
      disabled,
      selectedApplicability,
      ruleType
    } = this.props;
    const { currentTab, validationMessages } = this.state;
    const currentConfiguration = configurations[currentTab];
    const selectedSourceMarketIds = configurations.filter((x, i) => i === currentTab).flatMap(x => x.sourceMarkets);
    const errorMessageValues = validationMessages && Object.values(validationMessages);
    const dateBandErrorMessage = validationMessages && errorMessageValues.length > 0 && errorMessageValues[0];

    return (
      <Flexbox direction="column" alignItems="flex-start" width="100%" marginBottom="15px">
        <SubHeader>Date Bands</SubHeader>
        <Flexbox justifyContent="flex-start" marginTop="8px">
          <Tabs>
            {configurations.map((item, index) => (
              <Tab onClick={() => this.handleTabClick(index)} key={index} isSelected={index === currentTab}>
                <TabText>{item.sourceMarkets.map(x => x.name).join(', ')}</TabText>
              </Tab>
            ))}
            {!disabled && (
              <Tab onClick={() => this.handleTabClick('splitMarket')} isSelected={currentTab === 'splitMarket'}>
                <TabText>+ Split source markets</TabText>
              </Tab>
            )}
          </Tabs>
        </Flexbox>

        {currentTab !== 'splitMarket' && (
          <TabContent width="100%">
            <Flexbox marginBottom="10px" width="100%">
              <SourceMarketEditor
                disabled={disabled}
                key={`currentTab_${currentTab}`}
                tabCount={configurations.length}
                sourceMarkets={sourceMarkets}
                selectedSourceMarkets={selectedSourceMarketIds}
                onSourceMarketChange={this.handleSourceMarketMarginMerge}
                buttonText={'Merge'}
              />
              {dateBandErrorMessage && (
                <ErrorBox>
                  <i
                    className="material-icons"
                    style={{ marginRight: '4px', fontSize: '16px', float: 'left', color: 'rgba(255, 0, 0, 0.6)' }}
                  >
                    error
                  </i>
                  {dateBandErrorMessage}
                </ErrorBox>
              )}
              {!disabled && (
                <PreDefinedDateBandsPicker
                  style={{ marginLeft: 'auto' }}
                  onClick={this.handlePreDefinedDateBandsChanged}
                  selectedSeasonIds={selectedApplicability.find(x => x.get('criteriaKey') === 'season')?.get('values')}
                ></PreDefinedDateBandsPicker>
              )}
            </Flexbox>
            <DateBandsEditor
              disabled={disabled}
              key={this.state.dateBandsEditorKey + selectedSourceMarketIds.map(x => x.id).join('_')}
              dateBands={currentConfiguration.dateBands}
              durationGroups={currentConfiguration.durationGroups}
              valueDefinitions={valueDefinitions.toJS()}
              ruleType={ruleType}
              onChange={this.handleDateBandsChanged}
              currency={currency}
              validationMessages={validationMessages}
            />

            {currentConfiguration.dateBands.length > 0 && (
              <Flexbox marginBottom="15px" width={'800px'}>
                <MarginBandsGraph
                  key={`margin_bands_graph_${selectedSourceMarketIds.map(x => x.id).join('_')}`}
                  marginBands={currentConfiguration.dateBands}
                  valueDefinitions={valueDefinitions.toJS()}
                  selectedCurrency={currency}
                  errorMessage={!!errorMessage || !!dateBandErrorMessage}
                />
              </Flexbox>
            )}
            {this.props.additionalComponent &&
              React.cloneElement(this.props.additionalComponent, {
                selectedSourceMarketIds: selectedSourceMarketIds.map(x => x.id)
              })}
          </TabContent>
        )}

        {currentTab === 'splitMarket' && (
          <TabContent width="100%">
            <SourceMarketEditor
              key={currentTab}
              tabCount={configurations.length}
              onSourceMarketChange={this.handleSourceMarketMarginSplit}
              sourceMarkets={sourceMarkets}
              buttonText={'Split'}
            />
          </TabContent>
        )}
        <div style={{ width: '100%', marginTop: '15px' }}>
          <DefaultEditRuleButtons
            deleteButton={this.props.deleteButton}
            onSave={() => this.handleSave(this.props.onSave)}
            onSaveAndReturn={() => this.handleSave(this.props.onSaveAndReturn)}
            dirty={this.props.editButtonsDisabled}
            disabled={disabled}
            onCancel={this.props.onCancel}
            saveSuccess={this.props.saveSuccess}
          />
        </div>
      </Flexbox>
    );
  }
}

DefaultConfigurationsEditor.propTypes = {
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  configurations: PropTypes.array.isRequired,
  valueDefinitions: PropTypes.object.isRequired,
  selectedApplicability: PropTypes.instanceOf(List),
  ruleID: PropTypes.number,
  durationGroups: PropTypes.array,
  ruleDefinitionId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  deleteButton: PropTypes.element,
  onSave: PropTypes.func.isRequired,
  onSaveAndReturn: PropTypes.func.isRequired,
  editButtonsDisabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  saveSuccess: PropTypes.bool,
  sourceMarkets: PropTypes.array.isRequired,
  currency: PropTypes.string,
  additionalComponent: PropTypes.element,
  updateProperties: PropTypes.func,
  properties: PropTypes.array
};

export default DefaultConfigurationsEditor;
