import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CostPhasingModal } from './CostPhasingModal';

afterEach(cleanup);

let user;
describe('CostPhasingModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const renderCostPhasingModal = props => {
    return render(
      <CostPhasingModal
        show
        onSave={mockOnSave}
        onClose={mockOnClose}
        commitmentLevel={0.75}
        phasingReferenceName="Reference Curve"
        {...props}
      />
    );
  };

  it('renders the modal title', () => {
    const { getByText } = renderCostPhasingModal();
    const modalTitle = getByText('Cost phasing');
    expect(modalTitle).toBeInTheDocument();
  });

  it('should get and check "Use automatic phasing" radio button', async () => {
    renderCostPhasingModal({ phasingOverrideSetting: 1 });
    const radioButton = screen.getByLabelText('Use automatic phasing');
    expect(radioButton).toBeInTheDocument();
    await user.click(radioButton);
    expect(radioButton).toBeChecked();
  });

  it('should get and check "Always phase guaranteed costs" radio button', async () => {
    renderCostPhasingModal({ phasingOverrideSetting: 0 });
    const radioButton = screen.getByRole('radio', {
      name: /always phase guaranteed costs \(current phasing curve: reference curve\)/i
    });
    expect(radioButton).toBeInTheDocument();
    await user.click(radioButton);
    expect(radioButton).toBeChecked();
  });

  it('should get and check "Never phase costs" radio button', async () => {
    const { getByLabelText } = renderCostPhasingModal({ phasingOverrideSetting: 0 });
    const radioButton = getByLabelText('Never phase costs');
    await user.click(radioButton);
    expect(radioButton).toBeChecked();
  });

  it('triggers the onSave event when "Update cost phasing settings" button is clicked', async () => {
    const { getByText } = renderCostPhasingModal({ phasingOverrideSetting: 0 });
    const updateButton = getByText('Update cost phasing settings');
    await user.click(updateButton);
    expect(mockOnSave).toHaveBeenCalledWith(0);
  });
});
