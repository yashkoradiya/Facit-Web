import React from 'react';
import { LicenseManager } from 'ag-grid-enterprise';
import { queries, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { agGridQueries } from './ag-grid-helpers';
import configureStore from '../reduxSetup/configure-store';
import agGridLicense from 'ag-grid-license';
LicenseManager.setLicenseKey(agGridLicense);

const customRender = (ui, initialState, options) => {
  const store = configureStore(initialState);

  return {
    ...render(
      <BrowserRouter>
        <Provider store={store}>{ui}</Provider>
      </BrowserRouter>,
      {
        ...options,
        queries: {
          ...queries,
          ...agGridQueries
        }
      }
    ),
    store
  };
};

export * from '@testing-library/react';
export { customRender as render, user };
