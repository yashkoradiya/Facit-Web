import React from 'react';
import { render, screen } from '@testing-library/react';
import PhasedAccommodationsModal from './PhasedAccommodationsModal';

describe('PhasedAccommodationsModal Component', () => {
  test('Should render modal with correct title', () => {
    const phasedAccommodations = [
      {
        code: 'ACC1',
        destination: 'Destination 1',
        resort: 'Resort 1',
        accommodationName: 'Accommodation 1',
        commitmentLevel: 0.75
      },
      {
        code: 'ACC2',
        destination: 'Destination 2',
        resort: 'Resort 2',
        accommodationName: 'Accommodation 2',
        commitmentLevel: 0.9
      }
    ];
    render(
      <PhasedAccommodationsModal phasedAccommodations={phasedAccommodations} show={true} onRequestClose={jest.fn()} />
    );

    const modalTitle = screen.getByText('Phased accommodations');
    expect(modalTitle).toBeInTheDocument();
  });
});
