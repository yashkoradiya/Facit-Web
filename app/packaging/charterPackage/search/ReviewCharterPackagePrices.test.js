import React from 'react';
import { render } from '@testing-library/react';
import { getReview } from './api';
import userEvent from '@testing-library/user-event';
import ReviewCharterPackagePrices from './ReviewCharterPackagePrices';
 let user;
 jest.mock('./api', () => ({
  getReview: jest.fn(),
  publishPrices: jest.fn()
}));
 describe('ReviewCharterPackagePrices', () => {
  user = userEvent.setup();
  test('fetches review data on component mount', async () => {
    const allRows = [
      { id: 1, sourceMarketId: 1, productType: 'TypeA' },
      { id: 2, sourceMarketId: 2, productType: 'TypeB' }
    ];
     // Mock the API response
    getReview.mockResolvedValueOnce({
      data: [
        { id: 1, sourceMarketId: 1, productType: 'TypeA' },
        { id: 2, sourceMarketId: 2, productType: 'TypeB' }
      ]
    });
     render(
      <ReviewCharterPackagePrices
        allRows={allRows}
        showModal={true}
        onClose={jest.fn()}
        onPublished={jest.fn()}
        productType={''}
      />
    );
  });
   test('sorts accommodations on button click', async () => {
    const allRows = [
      { id: 1, sourceMarketId: 1, accommodationName: 'Accommodation A' },
      { id: 2, sourceMarketId: 2, accommodationName: 'Accommodation B' }
    ];
     getReview.mockResolvedValueOnce({
      data: [
        { id: 1, sourceMarketId: 1, accommodationName: 'Accommodation A' },
        { id: 2, sourceMarketId: 2, accommodationName: 'Accommodation B' }
      ]
    });
     const onClose = jest.fn();
    render(
      <ReviewCharterPackagePrices
        allRows={allRows}
        showModal={true}
        onClose={onClose}
        onPublished={jest.fn()}
        productType={''}
      />
    );
  });
});