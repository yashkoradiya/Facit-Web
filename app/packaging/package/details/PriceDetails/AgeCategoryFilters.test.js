import React from 'react';
import { render, screen, cleanup } from 'test-utils';
import { AgeCategoryFilters } from './AgeCategoryFilters';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

let user;
describe('AgeCategoryFilters', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  const mockOnAgeCategoryChange = jest.fn();

  const renderAgeCategoryFilters = props => {
    return render(<AgeCategoryFilters onAgeCategoryChange={mockOnAgeCategoryChange} {...props} />);
  };

  it('should render the "Adult" checkbox and be able to check', async () => {
    renderAgeCategoryFilters({ ageCategorySelections: { adult: false, child: false } });
    const adultCheckbox = screen.getByText(/adult/i);
    expect(adultCheckbox).toBeInTheDocument();
    await user.click(adultCheckbox);
  });

  it('should render the "Child" check', async () => {
    renderAgeCategoryFilters({ ageCategorySelections: { adult: false, child: false } });
    const childCheckbox = screen.getByText(/child/i);
    expect(childCheckbox).toBeInTheDocument();
    await user.click(childCheckbox);
  });
});
