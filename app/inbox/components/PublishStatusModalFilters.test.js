import React from 'react';
import { render, cleanup, waitFor, within } from 'test-utils';
import * as matchingCriteriaAPI from 'apis/matchingCriteriasApi';
import * as sourceMarketAPI from 'apis/sourceMarketsApi';
import PublishStatusModalFilters from './PublishStatusModalFilters';
import { Record, Map } from 'immutable';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');

const initialState = {
  appState: new (Record({
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

const onChange = jest.fn();
describe('Publish Status Modal Filters', () => {
  beforeEach(() => {
    matchingCriteriaAPI.get.mockResolvedValue({ data: matchingCriteriaData });
    sourceMarketAPI.getSourceMarkets.mockResolvedValue({ data: sourceMarketData });
  });

  it('Should render the component with 5 filter criterias', async () => {
    const { getByTestId, findByTestId } = render(<PublishStatusModalFilters onChange={onChange} />, initialState);

    // Wait for the component to resolve api calls and render status modal container
    await waitFor(() => getByTestId('status-modal-filters'));
    const container = await findByTestId('status-modal-filters');
    expect(container.childElementCount).toBe(5);
  });

  it('Should be able to select an item', async () => {
    const user = userEvent.setup();
    const { getAllByRole, getByTestId, findByTestId } = render(
      <PublishStatusModalFilters onChange={onChange} />,
      initialState
    );

    // Wait for the component to resolve api calls and render status modal container
    await waitFor(() => getByTestId('status-modal-filters'));
    const container = await findByTestId('status-modal-filters');

    const searchField = within(container.firstChild).getByRole('textbox');
    await user.click(searchField);

    // Once the textfield is in focus, access the suggestions list
    const selectableItems = getAllByRole('listbox').find(item => item.localName === 'ul');
    const planningPeriodItem = selectableItems.firstChild;

    await user.click(planningPeriodItem);

    expect(onChange).toHaveBeenCalled();
  });
});

const matchingCriteriaData = [
  {
    key: 'season',
    values: [
      {
        id: 'W22',
        name: 'Winter 2223',
        code: 'W22',
        node: 'season',
        parent: null
      }
    ]
  },
  {
    key: 'destination',
    values: [
      {
        id: '19cfed27-ac78-5c19-870d-db250c9809a9',
        name: 'Aargau',
        code: '19cfed27-ac78-5c19-870d-db250c9809a9',
        parentId: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
        node: 'destination',
        parent: {
          id: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
          name: 'Switzerland',
          code: 'CH',
          node: 'country',
          parent: null
        }
      }
    ]
  },
  {
    key: 'accommodationcode',
    values: [
      {
        id: 'A00000TESTLocalFinal',
        name: 'A00000TESTLocalFinal TestLocal Final',
        code: 'A00000TESTLocalFinal',
        parentId: '469a7b76-6d97-5048-9247-478336598453',
        node: 'accommodationcode',
        parent: {
          id: '469a7b76-6d97-5048-9247-478336598453',
          name: 'La Caleta',
          code: '469a7b76-6d97-5048-9247-478336598453',
          node: 'resort',
          parent: null
        }
      }
    ]
  }
];

const sourceMarketData = [
  {
    id: 'TUI_BE',
    name: 'TUI Belgium'
  }
];
