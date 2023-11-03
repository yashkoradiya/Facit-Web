import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AccommodationCostSummary from '../AccommodationCostSummary';
import { accomCostSummaryTD } from './test-data';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from 'reduxSetup/rootReducer';

const onChangeAverageUnderOccupancyCB = jest.fn();
const onChangePhasingReferenceCB = jest.fn();
const onChangeCalculationMethodCB = jest.fn();
const onDisplayCurrencyChangedCB = jest.fn();

afterEach(cleanup);

const store = createStore(rootReducer, {});

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('AccommodationCostSummary', () => {
  it('Should render AccommodationCostSummary', () => {
    const screen = render(
      <AccommodationCostSummary
        id="57178FD6-5A3C-4EF7-AB20-98784A93765C_W22_NETHERLANDS"
        readOnly={false}
        isLatestVersion={true}
        data={accomCostSummaryTD}
        selectedCurrency="EUR"
        displayCurrency="EUR"
        onChangeAverageUnderOccupancy={onChangeAverageUnderOccupancyCB}
        onChangePhasingReference={onChangePhasingReferenceCB}
        onChangeCalculationMethod={onChangeCalculationMethodCB}
        onDisplayCurrencyChanged={onDisplayCurrencyChangedCB}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/commitment level/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.0%/i)).toBeInTheDocument();

    expect(screen.getByText(/contract period/i)).toBeInTheDocument();
    expect(screen.getByText(/01-11-2022 - 30-04-2023/i)).toBeInTheDocument();

    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/signed/i)).toBeInTheDocument();

    expect(screen.getByText(/average bed night rate/i)).toBeInTheDocument();
    expect(screen.getByText(/74\.77 eur/i)).toBeInTheDocument();

    expect(screen.getByText(/latest version/i)).toBeInTheDocument();
    expect(screen.getByText(/\(1\) 03\-01\-2023/i)).toBeInTheDocument();

    expect(screen.getByText(/prod. config. id/i)).toBeInTheDocument();
    expect(screen.getByText(/57178fd6-5a3c-4ef7-ab20-98784a93765c_w22_netherlands/i)).toBeInTheDocument();

    expect(screen.getByText(/contract id/i)).toBeInTheDocument();
    expect(screen.getByText(/contract-k8zoaqmop5bd/i)).toBeInTheDocument();

    expect(screen.getByText(/key accom/i)).toBeInTheDocument();
    expect(screen.getByText(/false/i)).toBeInTheDocument();

    expect(screen.getByText(/Key Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21/i)).toBeInTheDocument();
  });
});
