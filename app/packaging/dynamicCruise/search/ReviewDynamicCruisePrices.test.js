import React from 'react';
import { render, screen } from 'test-utils';
import ReviewDynamicCruisePrices from './ReviewDynamicCruisePrices';

describe('ReviewDynamicCruisePrices Component', () => {
  const mockAllRows = [
    {
      id: 1,
      sourceMarketId: 101,
      sourceMarketName: 'Market A',
      cruiseName: 'Cruise 1',
      shipName: 'Ship X'
    },
    {
      id: 2,
      sourceMarketId: 102,
      sourceMarketName: 'Market B',
      cruiseName: 'Cruise 2',
      shipName: 'Ship Y'
    }
  ];

  it('renders the component with review data', () => {
    const props = {
      allRows: mockAllRows,
      showModal: true,
      onClose: jest.fn(),
      onPublished: jest.fn()
    };
    render(<ReviewDynamicCruisePrices {...props} />);

    expect(screen.getByText('Review and publish')).toBeInTheDocument();
    expect(screen.getByText('Cruise 1')).toBeInTheDocument();
    expect(screen.getByText('Cruise 2')).toBeInTheDocument();
  });
});
