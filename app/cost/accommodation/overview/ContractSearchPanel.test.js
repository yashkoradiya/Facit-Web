import React from 'react';
import { render, cleanup, within, act } from 'test-utils';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as api from './api';
import * as sourceMarketApi from '../../../apis/sourceMarketsApi';

import { matchingCriteriaApiTD, sourceMarketTD, initialState, resortTD, commissionMarkerTD } from './test-data';
import ContractSearchPanel from './ContractSearchPanel';
import userEvent from '@testing-library/user-event';
import * as geographyApi from 'components/GeographySearch/api';

jest.mock('apis/matchingCriteriasApi');
jest.mock('./api');
jest.mock('../../../apis/sourceMarketsApi');
jest.mock('components/GeographySearch/api');

afterEach(cleanup);

const handleSearch = jest.fn();
const handleSearchPreview = jest.fn();

let user;
describe('Contract Search Panel', () => {
  beforeEach(() => {
    user = userEvent.setup();

    matchingCriteriasApi.get.mockResolvedValue({ data: matchingCriteriaApiTD });
    matchingCriteriasApi.getCommissionMarker.mockResolvedValue({ data: commissionMarkerTD });
    api.getContractStatus.mockResolvedValue({
      data: [
        {
          id: 'Signed',
          name: 'Signed',
          category: 'contractstatus'
        }
      ]
    });
    sourceMarketApi.getSourceMarkets.mockResolvedValue({ data: sourceMarketTD });
    geographyApi.getPaginatedResorts.mockResolvedValue({
      data: resortTD
    });
  });

  it('Should be able to set dates and commitment values and commission marker field', async () => {
    const screen = render(
      <ContractSearchPanel onSearch={handleSearch} onSearchPreview={handleSearchPreview} searchPreview={1} />,
      initialState
    );

    const fromDateContainer = screen.getByTestId('from-date-container');
    const toDateContainer = screen.getByTestId('to-date-container');
    const fromDateField = within(fromDateContainer).getByRole('textbox');
    const toDateField = within(toDateContainer).getByRole('textbox');

    await act(async () => {
      await user.type(fromDateField, '01-01-2023');
      await user.type(toDateField, '31-01-2023');
    });

    expect(handleSearchPreview).toHaveBeenCalled();

    const minCommitmentContainer = screen.getByTestId('min-commitment-field');
    const minCommitmentField = within(minCommitmentContainer).getByRole('spinbutton');
    await user.type(minCommitmentField, '0');

    const maxCommitmentContainer = screen.getByTestId('max-commitment-field');
    const maxCommitmentField = within(maxCommitmentContainer).getByRole('spinbutton');
    await user.type(maxCommitmentField, '1');

    await screen.findByTestId('filters-container');
    const commissionMarkerField = screen.getByPlaceholderText(/commission marker/i);
    const input = within(commissionMarkerField).getByRole('textbox');
    await user.click(input);
    const listbox = screen.getAllByRole('listbox');
    const ul = listbox.find(item => item.localName === 'ul');
    await user.click(ul.children[0]);

    const clearButton = screen.getByText(/clear filters/i);
    await user.click(clearButton);
  });
});
