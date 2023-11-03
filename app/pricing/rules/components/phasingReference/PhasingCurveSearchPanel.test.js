import React from 'react';
import { render, screen, cleanup } from 'test-utils';
import PhasingCurveSearchPanel from './PhasingCurveSearchPanel';
import userEvent from '@testing-library/user-event';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import { criteriasTD } from 'test-utils/test-data';
import { Record, Map } from 'immutable';

const initialState = {
  appState: new (Record({
    resortsList: [
      {
        id: 'c33fc544-4de9-5145-80ed-b589669cf78a',
        name: 'Abenden',
        code: 'c33fc544-4de9-5145-80ed-b589669cf78a',
        parentIds: '2440a828-6c90-5538-9d37-293e56b2e4ec'
      }
    ],
    dynamicAccommodation: Map()
  }))()
};
jest.mock('components/GeographySearch/api');
getPaginatedResorts.mockImplementation(() => Promise.resolve({ data: { totalRowCount: 0, geographyViewModel: [] } }));

afterEach(cleanup);
let user;
const onChangeMock = jest.fn();
let selectedFiltersMock = {};
describe('PhasingCurveSearchPanel Component', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('Should render PhasingCurveSearchPanel component with criterias', async () => {
    render(
      <PhasingCurveSearchPanel
        criterias={criteriasTD}
        errorMessages={{}}
        onChange={onChangeMock}
        selectedFilters={selectedFiltersMock}
        disabled={false}
      />,
      initialState
    );

    const filteredSearchBoxes = screen.getAllByRole('textbox');
    expect(filteredSearchBoxes).toHaveLength(9);
    const maxCommitmentPercentageInput = screen.getByPlaceholderText(/% and lower/i);
    expect(maxCommitmentPercentageInput).toBeInTheDocument();
    await user.type(maxCommitmentPercentageInput, '10');
  });

  it('Should call onChange when a filter is selected in FilteredSearchBoxes', async () => {
    selectedFiltersMock = {
      selectedMaxCommitmentPercentage: null
    };
    render(
      <PhasingCurveSearchPanel
        criterias={criteriasTD}
        errorMessages={{}}
        onChange={onChangeMock}
        selectedFilters={selectedFiltersMock}
        disabled={false}
      />,
      initialState
    );

    const filteredSearchBoxes = screen.getAllByRole('textbox');
    const planningPeriodTB = filteredSearchBoxes[0];

    await user.click(planningPeriodTB);
    let lists = screen.getAllByRole('listbox');

    let ul = lists.find(item => item.localName === 'ul');
    const firstItem = ul.children[0];
    await user.click(firstItem);
    expect(onChangeMock).toHaveBeenCalled();
  });

  //   test('Should call onChange when max commitment percentage input is changed', () => {
  //     const onChangeMock = jest.fn();
  //     const selectedFiltersMock = {
  //       destination: ['Destination A'],
  //       resort: ['Resort B', 'Resort C']
  //     };

  //     render(
  //       <PhasingCurveSearchPanel
  //         criterias={criteriasMock}
  //         errorMessages={{}}
  //         onChange={onChangeMock}
  //         selectedFilters={selectedFiltersMock}
  //         disabled={false}
  //       />
  //     );

  //     // Get the max commitment percentage input and trigger the input change
  //     const maxCommitmentPercentageInput = screen.getByLabelText('Max commitment percentage');
  //     fireEvent.change(maxCommitmentPercentageInput, { target: { value: '90' } });

  //     // Check if onChange is called with the correct data when max commitment percentage input is changed
  //     expect(onChangeMock).toHaveBeenCalledWith({ selectedMaxCommitmentPercentage: '90' });
  //   });
});
