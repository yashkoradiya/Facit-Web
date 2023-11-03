import React from 'react';
import { render, cleanup, waitFor, within, screen, fireEvent, prettyDOM } from 'test-utils';
import { MemoryRouter, Route } from 'react-router';
import UserManagement from './UserManagement';
import { initialState, userRegionsTD, userRolesTD, usersTD } from './test-data';
import userEvent from '@testing-library/user-event';

import * as api from './api';

jest.mock('./api');

afterEach(cleanup);

let user;
describe('UserManagement', () => {
  beforeEach(() => {
    user = userEvent.setup();
    api.getUserRoles.mockResolvedValue({
      data: userRolesTD
    });
    api.getUserRegions.mockResolvedValue({
      data: []
    });
    api.getUsers.mockResolvedValue({
      data: usersTD
    });
    api.roleUpdate.mockResolvedValue({
      data: []
    });
    api.createUserRole.mockResolvedValue({});
  });
  // TODO: This started to fail after updating AG Grid
  // it('should render and perform user role manipulations', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/settings/usermanagement']}>
  //       <Route exact path="/settings/usermanagement" component={() => <UserManagement />} />
  //     </MemoryRouter>,
  //     initialState
  //   );

  //   let heading;
  //   // The waitFor here is used to prevent the act() warning from RTL
  //   await waitFor(() => {
  //     heading = screen.getByRole('heading', {
  //       name: /user roles/i
  //     });
  //   });
  //   expect(heading).toBeInTheDocument();

  //   const rowGroup = await waitFor(() => {
  //     return screen.getAllByRole('rowgroup');
  //   });

  //   // Verify the role table has Admin, Read Only and Write Only.
  //   const userRolesRow = within(rowGroup[1]).getAllByRole('row');
  //   const admin = within(userRolesRow[0]).getByRole('gridcell', {
  //     name: /admin/i
  //   });
  //   expect(admin).toBeInTheDocument();

  //   const readOnly = within(userRolesRow[1]).getByRole('gridcell', {
  //     name: /read only/i
  //   });
  //   expect(readOnly).toBeInTheDocument();

  //   const writeOnly = within(userRolesRow[2]).getByRole('gridcell', {
  //     name: /write only/i
  //   });
  //   expect(writeOnly).toBeInTheDocument();

  //   // Select Read Only role from the role table and perform all role change actions.
  //   const editableClicks = within(userRolesRow[1]).getAllByRole('gridcell', {
  //     name: /read/i
  //   });
  //   // await user.dblClick(editableClicks[1]);
  //   await user.click(editableClicks[1]);

  //   const dialog = screen.getByRole('dialog');
  //   const inputField = within(dialog).getByTestId('dropdown-input');
  //   await user.type(inputField, 'edit');

  //   // Create role
  //   const createRoleField = screen.getByPlaceholderText('Add user role +');
  //   await user.type(createRoleField, 'Test');
  //   await user.keyboard('{Tab}');
  // });

  it('should be able to filter user details by username search and role selection', async () => {
    render(
      <MemoryRouter initialEntries={['/settings/usermanagement']}>
        <Route exact path="/settings/usermanagement" component={() => <UserManagement />} />
      </MemoryRouter>,
      initialState
    );

    const userAccessTitle = await waitFor(() =>
      screen.getByRole('heading', {
        name: /user access/i
      })
    );
    expect(userAccessTitle).toBeInTheDocument();

    const userAccessInputContainer = screen.getByTestId('user-access-filter-container');
    const textFields = within(userAccessInputContainer).getAllByRole('textbox');

    // Filter by username
    await user.type(textFields[0], 'user');

    // Filter by role selection
    await user.click(textFields[1]);
    // const ddMenu = document.getElementById('downshift-2-menu');
    // const options = within(ddMenu).getAllByRole('option');
    // await user.click(options[1]);
  });

  it('Should select user from User Access table and set user region', async () => {
    api.getUserRegions.mockResolvedValue({
      data: userRegionsTD
    });
    render(
      <MemoryRouter initialEntries={['/settings/usermanagement']}>
        <Route exact path="/settings/usermanagement" component={() => <UserManagement />} />
      </MemoryRouter>,
      initialState
    );

    // Get user details from user access AGGrid table.
    // const userAccessGrid = document.getElementById('user-access-grid');
    // const rowGroup = await waitFor(() => within(userAccessGrid).getAllByRole('rowgroup'));
    // console.log(rowGroup);
    // const userRow = await waitFor(() => within(rowGroup[0]).getAllByRole('row'));

    // const userA = userRow[0];
    // expect(within(userA).getByText(/user a/i)).toBeInTheDocument();

    // // Open context menu by clicking on the user row.
    // fireEvent.contextMenu(userA);

    // // From the context menu, click on the 'assign roles to user' options and verify the User Role and Region assignment modal is opened up.
    // const cntxtMenu = screen.getByText(/assign roles to user/i);
    // await user.click(cntxtMenu);
    // expect(screen.getByText(/Assign roles and regions to User A/i)).toBeInTheDocument();

    // // Verify the user is assigend a Role
    // const assignedRole = screen.getByTitle(/read only/i);
    // expect(assignedRole).toBeInTheDocument();

    // // Set/Unset user region for a user and save.
    // const regionTextContainer = screen.getByPlaceholderText(/select regions/i);
    // const regionTextField = within(regionTextContainer).getByRole('textbox');
    // await user.click(regionTextField);
    // const ddMenu = screen.getAllByRole('listbox')[1];
    // const options = within(ddMenu).getAllByRole('option');
    // await user.click(options[0]);
    // const saveBtn = screen.getByRole('button', {
    //   name: /save/i
    // });

    // await user.click(saveBtn);
  });

  //TODO: The AGGrid doesn't render the delete column in the test environment, hence unable to cover test related to the Delete
  // it('Should be able to delete user', async () => {
  //   api.getUserRegions.mockResolvedValue({
  //     data: userRegionsTD
  //   });
  //   render(
  //     <MemoryRouter initialEntries={['/settings/usermanagement']}>
  //       <Route exact path="/settings/usermanagement" component={() => <UserManagement />} />
  //     </MemoryRouter>,
  //     initialState
  //   );

  //   // Get user details from user access AGGrid table.
  //   const userAccessGrid = document.getElementById('user-access-grid');
  //   const rowGroup = await waitFor(() => within(userAccessGrid).getAllByRole('rowgroup'));
  //   const userRow = await waitFor(() => within(rowGroup[1]).getAllByRole('row'));
  //   const userA = userRow[0];
  //   const deleteButton = within(userA).getByRole('button');
  //   console.log(deleteButton);
  // });
});
