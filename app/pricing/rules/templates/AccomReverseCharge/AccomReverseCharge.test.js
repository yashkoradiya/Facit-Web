import React from 'react';
import rootReducer from 'reduxSetup/rootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router';
import AccomReverseCharge from './AccomReverseCharge';
import * as rulesApi from '../../../../apis/rulesApi';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
import * as matchingCriteriasApi from '../../../../apis/matchingCriteriasApi';
import { matchingCriteriaDefTD, ruleDefinitionsTD, sourceMarketTD } from './test-data';

jest.mock('../../../../apis/rulesApi');
jest.mock('../../../../apis/matchingCriteriasApi');
jest.mock('settings/PreDefinedRules/api');

const store = createStore(rootReducer, {});

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Accom Reverse Charge', () => {
  beforeEach(() => {
    rulesApi.getRuleDefinitions.mockResolvedValue({ data: ruleDefinitionsTD });
    rulesApi.getSelectableItems.mockResolvedValue({ data: sourceMarketTD });
    matchingCriteriasApi.get.mockResolvedValue({
      data: matchingCriteriaDefTD
    });
    preDefinedRulesApi.getDateBands.mockResolvedValue({ data: [] });
  });

  it('Should render the page and title and criterias', async () => {
    const { findByRole, getByTestId } = render(
      <MemoryRouter initialEntries={['/pricing/rules/templates/create/reverse-charge']}>
        <Route exact path="/pricing/rules/templates/create/reverse-charge" component={AccomReverseCharge} />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    const heading = await findByRole('heading', {
      name: /accom reverse charge template/i
    });

    expect(heading).toBeInTheDocument();

    const applicabilityContainer = getByTestId('applicability-container');

    //Expect three criterias
    expect(applicabilityContainer.childElementCount).toBe(3);
  });
});
