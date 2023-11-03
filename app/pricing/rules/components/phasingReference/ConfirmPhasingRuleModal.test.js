import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfirmPhasingRuleModal from './ConfirmPhasingRuleModal';

describe('ConfirmPhasingRuleModal Component', () => {
  const mockData = [
    { id: 1, accommodationName: 'Hotel A', country: 'Country X', destination: 'Destination A', commitmentLevel: 0.75 }
  ];

  it('renders correctly with create message', () => {
    const props = {
      show: true,
      data: mockData,
      isEdit: false,
      loading: false,
      onRequestClose: jest.fn(),
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };
    render(<ConfirmPhasingRuleModal {...props} />);

    expect(screen.getByText('Create phasing curve')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Creating the phasing curve will cause a re-phasing of costs for the following ${mockData.length} contracts.`
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Yes, create phasing curve')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
