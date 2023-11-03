import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EvaluateCharterPackagePrices from './EvaluateCharterPackagePrices';
let user;
jest.mock('./api', () => ({
  getEvaluateReview: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          sourceMarketId: 123,
          roomTypes: ['Single Room', 'Double Room'],
          lastEvaluated: '2023-08-01T00:00:00Z',
          productType: ['FLY_AND_STAY', 'ACCOMMODATION_ONLY']
        }
      ]
    })
  ),
  evaluatePrice: jest.fn(() => Promise.resolve())
}));

describe('EvaluateCharterPackagePrices', () => {
  user = userEvent.setup();
  const allRows = [
    {
      id: 1,
      sourceMarketId: 123,
      accommodationName: 'Hotel ABC',
      sourceReferenceCode: 'REF123',
      sourceMarket: 'USA',
      productType: 'Gold'
    }
  ];

  it('should render the component', () => {
    render(
      <EvaluateCharterPackagePrices
        allRows={allRows}
        onClose={() => {}}
        showModal={true}
        onPublished={() => {}}
        productType=""
      />
    );
  });

  it('should fetch and set review data on mount', () => {
    render(
      <EvaluateCharterPackagePrices
        allRows={allRows}
        onClose={() => {}}
        showModal={true}
        onPublished={() => {}}
        productType=""
      />
    );

    waitFor(() => expect(screen.getByText('Hotel ABC')).toBeInTheDocument());
  });

  it('should sort accommodations alphabetically', () => {
    render(
      <EvaluateCharterPackagePrices
        allRows={allRows}
        onClose={() => {}}
        showModal={true}
        onPublished={() => {}}
        productType="Gold"
      />
    );
    waitFor(() => expect(screen.findByText('Hotel ABC')).toBeInTheDocument());
    waitFor(() => expect(screen.findByText('Hotel ABC')).toBeInTheDocument());
    waitFor(() => expect(screen.findByText('Hotel ZZZ')).toBeInTheDocument());
  });
});
