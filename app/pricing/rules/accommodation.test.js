import { render } from 'test-utils';
import React from 'react';
import Accommodation from './accommodation';
import {
  initialState,
  dataTD,
  searchBoxDataTD,
  selectedRuleTypesTD,
  selectedSecondaryFiltersTD,
  selectedSourceMarketsTD
} from './test-data';

const onFilterChange = jest.fn();

describe('accommodation template', () => {
  it('Should render the accommodation wrapper', async () => {
    const screen = render(
      <Accommodation
        data={dataTD}
        searchBoxData={searchBoxDataTD}
        filteredSearchBoxData={searchBoxDataTD}
        selectedSecondaryFilters={selectedSecondaryFiltersTD}
        selectedRuleTypes={selectedRuleTypesTD}
        initialData={dataTD}
        onFilterChanged={onFilterChange}
        selectedSourceMarkets={selectedSourceMarketsTD}
      />,
      initialState
    );

    expect(screen.getByPlaceholderText(/classification/i)).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', {
        name: /template name/i
      })
    ).toBeInTheDocument();

    // TODO: Unable to verify the AGGrid columns data, it doesn't seems to be rendered during test
    // const rowGroup = await screen.findAllByRole('rowgroup');
    // console.log(rowGroup[1].children.length);
  });
});
