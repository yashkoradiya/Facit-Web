import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router';
import * as rulesApi from '../../../../apis/rulesApi';
import CreateDistributionCost from './CreateDistributionCost';
import { createStore } from 'redux';
import { dynamicAccomTD, dynamicResortTD, ruleDefinitionsTD, selectableItemsTD } from './test-data';
import rootReducer from 'reduxSetup/rootReducer';
import { Provider } from 'react-redux';
import { getPaginatedResorts, getDynamicAccom } from '../../../../components/GeographySearch/api';
import * as matchingCriteriasApi from '../../../../apis/matchingCriteriasApi';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';

jest.mock('../../../../apis/rulesApi');
jest.mock('../../../../apis/matchingCriteriasApi');
jest.mock('../../../../components/GeographySearch/api');
jest.mock('settings/PreDefinedRules/api');

const store = createStore(rootReducer, {});

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Distribution Cost Template', () => {
  beforeEach(() => {
    rulesApi.getRuleDefinitions.mockResolvedValue({ data: ruleDefinitionsTD });
    rulesApi.getSelectableItems.mockResolvedValue({ data: selectableItemsTD });
    matchingCriteriasApi.get.mockResolvedValue({
      data: []
    });
    getPaginatedResorts.mockResolvedValue({ data: dynamicResortTD });
    getDynamicAccom.mockResolvedValue({ data: dynamicAccomTD });

    preDefinedRulesApi.getDateBands.mockResolvedValue({ data: [] });
  });

  it('Should render the page title and container', async () => {
    const { findByRole } = render(
      <MemoryRouter initialEntries={['/pricing/rules/templates/create/distribution-cost']}>
        <Route exact path="/pricing/rules/templates/create/distribution-cost" component={CreateDistributionCost} />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    const heading = await findByRole('heading', {
      name: /distribution cost margin template/i
    });

    expect(heading).toBeInTheDocument();
  });
});
