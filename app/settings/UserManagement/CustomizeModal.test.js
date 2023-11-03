import React from 'react';
import { render, cleanup } from 'test-utils';
import userEvent from '@testing-library/user-event';
import CustomizeModal from './CustomizeModal';

afterEach(cleanup);

let user;
describe('CustomizeModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  const mockCustomizedAccessGroup = {
    id: 1,
    headerName: 'Header',
    claimPrefix: 'prefix',
    subcategories: [
      { category: 'cat1', name: 'Subcat 1', access: 'Edit' },
      { category: 'cat2', name: 'Subcat 2', access: 'Read' }
    ]
  };

  it('Should render the modal correctly when show is true and customizedAccessGroup is provided', () => {
    const { getByText } = render(
      <CustomizeModal
        show={true}
        onClose={() => {}}
        onSave={() => {}}
        customizedAccessGroup={mockCustomizedAccessGroup}
      />
    );

    expect(getByText(`${mockCustomizedAccessGroup.headerName} - Customized Access`)).toBeInTheDocument();
    expect(getByText('Subcat 1')).toBeInTheDocument();
    expect(getByText('Subcat 2')).toBeInTheDocument();
  });

  it('Should be able to change dropdown selection', async () => {
    const screen = render(
      <CustomizeModal
        show={true}
        onClose={() => {}}
        onSave={() => {}}
        customizedAccessGroup={mockCustomizedAccessGroup}
      />
    );

    const textfield = screen.getByPlaceholderText(/edit/i);
    await user.click(textfield);
    const dropdownMenu = screen.getAllByTestId('dropdown-menu')[0];
    const firstItem = dropdownMenu.children[0];
    await user.click(firstItem);
  });

  it('Should call onSave, when "Save and return" button is clicked', async () => {
    const onSaveMock = jest.fn();

    const { getByText } = render(
      <CustomizeModal
        show={true}
        onClose={() => {}}
        onSave={onSaveMock}
        customizedAccessGroup={mockCustomizedAccessGroup}
      />
    );

    const saveButton = getByText('Save and return');
    await user.click(saveButton);

    expect(onSaveMock).toHaveBeenCalledWith(mockCustomizedAccessGroup.id, ['prefix.cat1.write', 'prefix.cat2.read']);
  });
});
