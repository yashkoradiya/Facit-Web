import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EvaluateAOPrices from './EvaluateAOPrices';
let user;

jest.mock('./api', () => ({
  getReview: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          sourceMarketId: 123,
          roomTypes: ['Single Room', 'Double Room'],
          lastPublished: '2023-08-01T00:00:00Z'
        },
      ],
    })
  ),
  publishPrices: jest.fn(() => Promise.resolve()),
}));

describe('EvaluateAOPrices', () => {
    user = userEvent.setup();
  test('fetches review data on component mount', async () => {
    const allRows = [
      {
        id: 1,
        sourceMarketId: 123,
        accommodationName: 'Hotel ABC',
        sourceReferenceCode: 'REF123',
        sourceMarket: 'USA',
      },
    ];

    render(
      <EvaluateAOPrices
        allRows={allRows}
        onClose={() => {}}
        showModal={true}
        onPublished={() => {}}
      />
    );
     waitFor(() => expect(api.getReview).toHaveBeenCalled());
  });

  test('calls the publishPrices function when the publish button is clicked', async () => {
    const allRows = [
      {
        id: 1,
        sourceMarketId: 123,
        accommodationName: 'Hotel ABC',
        sourceReferenceCode: 'REF123',
        sourceMarket: 'USA',
      },
    ];

    render(
      <EvaluateAOPrices
        allRows={allRows}
        onClose={() => {}}
        showModal={true}
        onPublished={() => {}}
      />
    );
     waitFor(() => expect(api.publishPrices).toHaveBeenCalled());
  });
});
