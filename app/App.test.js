import React from 'react';
import { render } from '@testing-library/react';
import App from 'App';
import configureStore from 'reduxSetup/configure-store';

describe('App', () => {
  it('Should render authentication page', async () => {
    const store = configureStore({});
    const { getByText } = render(<App store={store} />);
    expect(getByText(/authenticating/i)).toBeInTheDocument();
  });

  // TODO: Move this test case to Main App.test
  // it('Should not render main app container, if user is not assigned source markets', () => {
  //   const userSession = {
  //     idToken: {
  //       jwtToken:
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzZXIgQSIsImV4cCI6MTY2OTYzMTM4MywiaWF0IjoxNjY5NjMxMDgzLCJjb2duaXRvOmdyb3VwcyI6WyJjb21wb25lbnR0ZW1wbGF0ZXMuZHluYW1pY2NydWlzZS53cml0ZSJdfQ.1iYOLRVZJDt7Vc7Kug93DfdbVVYZW6wu24qk6GzEkHw'
  //     }
  //   };
  //   const store = configureStore({});
  //   const screen = render(<App store={store} userSession={userSession} />);
  //   expect(
  //     screen.getByRole('heading', {
  //       name: /there was an error while authenticating, please try again\./i
  //     })
  //   ).toBeInTheDocument();
  // });

  it('Should render main app container', async () => {
    const userSession = {
      idToken: {
        jwtToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzZXIgQSIsImV4cCI6MTY2OTYzMTM4MywiaWF0IjoxNjY5NjMxMDgzLCJjdXN0b206c291cmNlbWFya2V0cyI6IlRVSV9GSSxUVUlfREssVFVJX1NFLFRVSV9OTyxUVUlfTkwiLCJjb2duaXRvOmdyb3VwcyI6WyJjb21wb25lbnR0ZW1wbGF0ZXMuZHluYW1pY2NydWlzZS53cml0ZSJdfQ.UzDpaw1fTbvr-dxz1VecpKl81v2_04PFHozz5mldn1E'
      }
    };
    const store = configureStore({});
    const { findByTestId } = render(<App store={store} userSession={userSession} />);
    expect(await findByTestId('container')).toBeInTheDocument();
  });
});
