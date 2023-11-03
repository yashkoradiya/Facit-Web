import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditableLabel from './EditableLabel';
import userEvent from '@testing-library/user-event';

let user;
describe('EditableLabel', () => {
  const defaultProps = {
    id: '1',
    name: 'Initial Name',
    onDelete: jest.fn(),
    onSave: jest.fn()
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial name and edit icon', async () => {
    render(<EditableLabel {...defaultProps} />);
    const nameLabel = screen.getByRole('textbox', {
      value: 'Initial Name'
    });
    expect(nameLabel).toBeInTheDocument();

    const editIcon = screen.getByTitle('Edit');
    expect(editIcon).toBeInTheDocument();
  });

  it('clicking edit icon should switch to edit mode', async () => {
    const { getByTitle } = render(<EditableLabel {...defaultProps} />);
    const editIcon = getByTitle('Edit');
    fireEvent.click(editIcon);
    const nameLabel = screen.getByRole('textbox', {
      value: 'Initial Name'
    });
    await user.click(nameLabel);
    await user.type(nameLabel, 'new name');
    await user.keyboard('{Enter}');

    const saveIcon = getByTitle('Save');
    expect(saveIcon).toBeInTheDocument();
    await user.click(saveIcon);
  });

  it('clicking save icon should call onSave prop', () => {
    const { getByTitle } = render(<EditableLabel {...defaultProps} />);
    const editIcon = getByTitle('Edit');
    fireEvent.click(editIcon);

    const saveIcon = getByTitle('Save');
    fireEvent.click(saveIcon);
  });

  it('clicking delete icon should call onDelete prop', () => {
    const { getByTitle } = render(<EditableLabel {...defaultProps} />);
    const deleteIcon = getByTitle('Delete');
    fireEvent.click(deleteIcon);

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });
});
