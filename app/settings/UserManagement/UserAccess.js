import React, { useState, useEffect } from 'react';
import useAuth from 'core/identity/useAuth';
import { AgGridReact } from 'ag-grid-react';
import DeleteRowCellRenderer from 'components/AgGrid/renderers/DeleteRowCellRenderer';
import DateTimeCellRenderer from 'components/AgGrid/renderers/DateTimeCellRenderer';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { Flexbox, AgGridToolTip } from 'components/styled/Layout';
import { InputLabel, InputBox } from 'components/styled/Input';
import InputField from 'components/FormFields/InputField';
import SearchBox from 'components/FormFields/SearchBox';
import { List, fromJS } from 'immutable';

export default function UserAccess({ users, onEditUser, onDeleteUser, selectableUserRoles }) {
  const [data, setData] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState(List());
  const [usernameFilter, setUsernameFilter] = useState('');
  const access = useAuth();

  useEffect(() => {
    const filteredUsers = users.filter(
      u =>
        u.name.toLowerCase().includes(usernameFilter.toLowerCase()) &&
        (selectedRoleIds.size === 0 || selectedRoleIds.some(r => u.userRoles.some(ur => ur.id === r)))
    );
    setData(filteredUsers);
  }, [users, selectedRoleIds, usernameFilter]);

  const readOnly = !access.settings.userroles.write;

  return (
    <div style={{ width: '100%' }}>
      <h2>User access</h2>
      <Flexbox data-testid="user-access-filter-container" childrenMarginRight="10px" marginBottom="10px">
        <InputBox width={'100px'}>
          <InputLabel>User name</InputLabel>
          <InputField width="100px" onChange={e => setUsernameFilter(e.target.value)} />
        </InputBox>
        <SearchBox
          key={'searchUserRoleIds'}
          placeholder="User role"
          items={fromJS(selectableUserRoles)}
          onChange={setSelectedRoleIds}
          selectedItemIds={selectedRoleIds}
        />
      </Flexbox>
      <div
        id="user-access-grid"
        style={{
          height: '300px'
        }}
        className="ag-theme-balham"
      >
        <AgGridToolTip width="auto" minHeight="auto" className={'tooltip-content'} />
        <AgGridReact
          key={`user-management-user-access`}
          defaultColDef={{
            resizable: true,
            sortable: true
          }}
          rowData={data}
          columnDefs={columnDefinitions({ onDeleteUser, readOnly })}
          getContextMenuItems={params => [
            {
              name: 'Assign roles to user',
              action: () => onEditUser(params.node.data),
              disabled: readOnly
            },
            'separator',
            ...getDefaultContextMenuItems(params)
          ]}
          gridOptions={{ suppressPropertyNamesCheck: true }}
        />
      </div>
    </div>
  );
}

const columnDefinitions = options => {
  const defs = [
    {
      field: 'name',
      headerName: 'User Name',
      tooltipField: 'name',
      width: 130
    },
    {
      field: 'dateAdded',
      headerName: 'Date added',
      tooltipField: 'name',
      width: 130,
      cellRendererFramework: DateTimeCellRenderer
    },
    {
      field: 'userRoles',
      headerName: 'User roles',
      width: 100,
      valueGetter: row => {
        if (row.data === null) return;

        return row.data.userRoles.map(x => x.name).join(', ');
      }
    },
    {
      field: 'userRegions',
      headerName: 'User regions',
      width: 100,
      valueGetter: row => {
        if (row.data === null) return;

        return row.data.userRegions.map(x => x.name).join(', ');
      }
    },
    // {
    //   field: 'comment',
    //   headerName: 'Comment',
    //   tooltipField: 'comment',
    //   width: 150
    // },
    {
      field: 'lastSaved',
      headerName: 'Last saved',
      tooltipField: 'lastSaved',
      width: 130,
      cellRendererFramework: DateTimeCellRenderer
    },
    {
      field: 'savedBy',
      headerName: 'Saved by',
      tooltipField: 'savedBy',
      width: 150
    }
  ];

  return options.readOnly
    ? defs
    : [
        ...defs,
        {
          width: 30,
          editable: false,
          cellRendererFramework: DeleteRowCellRenderer,
          cellRendererParams: row => {
            if (row.data === null) return;
            return {
              onClick: options.onDeleteUser
            };
          }
        }
      ];
};
