import React from 'react';
import { render, cleanup, prettyDOM } from '@testing-library/react';
import EditRule from './editRule';
import { testData, userState } from './test-data';
import DefaultConfigurationsEditor from '../DefaultConfigurationsEditor/DefaultConfigurationsEditor';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from 'reduxSetup/rootReducer';
import { Provider } from 'react-redux';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api'

jest.mock('settings/PreDefinedRules/api');
preDefinedRulesApi.getDateBands.mockResolvedValue({ data: [] });

const onSaveHandle = jest.fn();
const validationFunc = jest.fn();
const handleSaveAndReturnToOverview = jest.fn();
const returnToOverview = jest.fn();
const configurationsAdditionalComponentFactory = jest.fn();

const store = createStore(rootReducer, userState);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

afterEach(cleanup);

describe('Edit Rule', () => {
  it('Should render the edit rule container', () => {
    const {  getByTestId } = render(
      <BrowserRouter>
        <EditRule
          key={`create_definitionId_${testData.ruleDefinitionId}`}
          ruleDefinitionId={testData.ruleDefinitionId}
          rule={testData.rule}
          selectableSourceMarkets={testData.selectableSourceMarkets}
          selectableProperties={testData.selectableProperties}
          selectableAssociatedProducts={testData.selectableAssociatedProducts}
          applicability={testData.applicability}
          onSave={onSaveHandle}
          validationFunc={validationFunc}
          onSaveAndReturn={handleSaveAndReturnToOverview}
          onCancel={returnToOverview}
          showCurrency={testData.selectedRuleDefinition.showCurrency}
          configurationsAdditionalComponentFactory={configurationsAdditionalComponentFactory}
          ConfigurationsEditorComponent={DefaultConfigurationsEditor}
          ruleType={testData.selectedRuleDefinition.type.ruleType}
          ruleDefinitions={testData.ruleDefinitions}
          templateMargins={testData.templateMargins}
          selectedRuleDefinition={testData.selectedRuleDefinition}
          filteredDefinitions={testData.filteredDefinitions}
        />
      </BrowserRouter>,
      { wrapper: Wrapper }
    );

    expect(getByTestId('edit-rule-container')).toBeInTheDocument();
  });
});
