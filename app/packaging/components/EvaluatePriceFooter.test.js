import React from 'react';
import { render, screen } from '@testing-library/react';
import EvaluatePriceFooter from './EvaluatePriceFooter';

describe('EvaluatePriceFooter', () => {
  it('renders without errors', () => {
    render(<EvaluatePriceFooter />);
  });

  it('shows "Evaluating prices..." when `publishing` is true', () => {
    render(<EvaluatePriceFooter publishing={true} />);
    expect(screen.getByText('Evaluating prices...')).toBeInTheDocument();
  });

  it('shows "Evaluate completed" when `saveSuccess` is true and there are no errors', () => {
    render(<EvaluatePriceFooter saveSuccess={true} errors={0} />);
    expect(screen.getByText('Evaluate completed')).toBeInTheDocument();
  });

  it('shows "Evaluate completed with {errors} errors" when `saveSuccess` is true and there are errors', () => {
    render(<EvaluatePriceFooter saveSuccess={true} errors={3} />);
    expect(screen.getByText('Evaluate completed with 3 errors')).toBeInTheDocument();
  });

  it('disables "Evaluate selected prices" button during publishing and after successful evaluation', () => {
    render(<EvaluatePriceFooter publishing={true} />);
    expect(screen.getByText('Evaluate selected prices')).toBeDisabled();
  });

  it('enables "Evaluate selected prices" button when not publishing or evaluated successfully', () => {
    render(<EvaluatePriceFooter publishing={false} />);
    expect(screen.getByText('Evaluate selected prices')).not.toBeDisabled();
  });

  it('disables "Cancel" button during publishing and after successful evaluation', () => {
    render(<EvaluatePriceFooter publishing={true} saveSuccess={true} />);
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('enables "Cancel" button when not publishing or evaluated successfully', () => {
    render(<EvaluatePriceFooter publishing={false} />);
    expect(screen.getByText('Cancel')).not.toBeDisabled();
  });
});
