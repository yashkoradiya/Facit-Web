import React from 'react';
import rootReducer from 'reduxSetup/rootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router';
import userEvent from '@testing-library/user-event';
import * as rulesApi from '../../../../apis/rulesApi';
import AccommodationComponent from './AccommodationComponent';

import { matchingCriteriaDefTD, resortTD, ruleDefinitionsTD, sourceMarketsTD } from './test-data';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import * as matchingCriteriasApi from '../../../../apis/matchingCriteriasApi';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';

jest.mock('../../../../apis/rulesApi');
jest.mock('../../../../apis/matchingCriteriasApi');
jest.mock('components/GeographySearch/api');
jest.mock('settings/PreDefinedRules/api');

const store = createStore(rootReducer, {});

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Accommodation Component', () => {
  beforeEach(() => {
    rulesApi.getRuleDefinitions.mockResolvedValue({ data: ruleDefinitionsTD });
    rulesApi.getSelectableItems.mockResolvedValue({ data: sourceMarketsTD });
    matchingCriteriasApi.get.mockResolvedValue({
      data: matchingCriteriaDefTD
    });
    getPaginatedResorts.mockResolvedValue({
      data: resortTD
    });
    preDefinedRulesApi.getDateBands.mockResolvedValue({ data: [] });
  });

  it('Should render the page and title and navigate back', async () => {
    const user = userEvent.setup();
    const { findByRole, getByText, queryByRole } = render(
      <MemoryRouter initialEntries={['/pricing/rules/templates/create/accommodation-component']}>
        <Route
          exact
          path="/pricing/rules/templates/create/accommodation-component"
          component={AccommodationComponent}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    let heading = await findByRole('heading', {
      name: /accommodation component margin template/i
    });
    expect(heading).toBeInTheDocument();

    const backBtn = getByText(/navigate_before/i);

    await user.click(backBtn);

    heading = queryByRole('heading', {
      name: /accommodation component margin template/i
    });
    expect(heading).not.toBeInTheDocument();
  });

  it('Should be able change template type', async () => {
    const user = userEvent.setup();
    const { findByTestId, getAllByRole } = render(
      <MemoryRouter initialEntries={['/pricing/rules/templates/create/accommodation-component']}>
        <Route
          exact
          path="/pricing/rules/templates/create/accommodation-component"
          component={AccommodationComponent}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    const templateContainer = await findByTestId('template-container');

    const label = within(templateContainer).getByText(/select template/i);
    expect(label).toBeInTheDocument();

    const templateField = within(templateContainer).getByRole('textbox');
    await user.click(templateField);

    const options = getAllByRole('option');

    // Should contain 2 options
    expect(options).toHaveLength(2);

    userEvent.click(options[1]);
  });
});
