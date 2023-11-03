import React, { useEffect, useState } from 'react';
import useAuth from 'core/identity/useAuth';
import { AgGridReact } from 'ag-grid-react';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';
import { AgGridToolTip } from 'components/styled/Layout';
import SingleSelectCellEditor from 'components/AgGrid/editors/SingleSelectCellEditor';
import DeleteRowCellRenderer from 'components/AgGrid/renderers/DeleteRowCellRenderer';
import DateTimeCellRenderer from 'components/AgGrid/renderers/DateTimeCellRenderer';
import SaveIndicator from 'components/SaveIndicator';
import { Flexbox } from 'components/styled/Layout';
import { isEnterKey } from 'helpers/keyChecker';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';

export default function UserRoles({ userRoles, onRoleDelete, onRoleUpdated, onAddUserRole, onModalOpen, saving }) {
  const [data, setData] = useState([]);
  const access = useAuth();
  const readOnly = !access.settings.userroles.write;

  useEffect(() => {
    setData(userRoles);
  }, [userRoles]);

  function areEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  const cellValueChanged = props => {
    if (props && props.newValue === 'Customized') {
      const fieldName = props.colDef.field;
      const category = props.data.categories.find(x => fieldName.toUpperCase().includes(x.category.toUpperCase()));
      onModalOpen(props.data.id, category, props.colDef.headerName);
      return;
    }

    if (areEqual(props.oldValue, props.newValue)) return;

    if (props.value !== 'Customized') {
      const claimPrefix = props.colDef.field.replace('Access', '').toLowerCase();
      const userRole = data.find(x => props.data.id === x.id);
      const category = userRole.categories.find(x => x.category === claimPrefix);

      const claimsToUpdate = category.subcategories.map(
        subcategory => `${claimPrefix}.${subcategory.category}.${getClaimAccess(props.value)}`
      );

      onRoleUpdated(props.data.id, claimsToUpdate);
    }
  };

  const handleAddUserRole = e => {
    onAddUserRole(e.target.value);
    e.target.value = '';
  };

  const handleOnKeyUp = e => {
    if (isEnterKey(e.which)) handleAddUserRole(e);
  };

  const isEditable = row => {
    const serviceRoles = ['Admin', 'Read only', 'No access'];
    if (row.data === null) return false;
    return !(readOnly || serviceRoles.find(x => x === row.data.name));
  };

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <h2>User Roles</h2>
      <Flexbox justifyContent="flex-end">
        <SaveIndicator saving={saving} />
      </Flexbox>
      <div
        id="user-roles-grid"
        style={{
          height: '300px'
        }}
        className="ag-theme-balham"
      >
        <AgGridToolTip width="auto" minHeight="auto" className={'tooltip-content'} />
        <AgGridReact
          key={`user-management-user-roles`}
          defaultColDef={{
            resizable: true,
            sortable: true
          }}
          singleClickEdit={true}
          rowData={data}
          columnDefs={columnDefinitions(onRoleDelete, isEditable)}
          onCellValueChanged={cellValueChanged}
          stopEditingWhenGridLosesFocus={true}
          gridOptions={{ popupParent: document.querySelector('body'), suppressPropertyNamesCheck: true }}
          getContextMenuItems={getDefaultContextMenuItems}
        />

        {!readOnly && (
          <input
            style={{ width: '100%', borderTop: '0px' }}
            onBlur={handleAddUserRole}
            onKeyUp={handleOnKeyUp}
            placeholder="Add user role +"
          ></input>
        )}
      </div>
    </div>
  );
}

const columnDefinitions = (onRoleDelete, isEditable) => [
  {
    field: 'name',
    headerName: 'User role',
    tooltipField: 'name',
    width: 130
  },
  {
    field: 'settingsAccess',
    headerName: 'Settings',
    tooltipField: 'settingsAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'componentTemplatesAccess',
    headerName: 'Component templates',
    tooltipField: 'componentTemplatesAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'packageTemplatesAccess',
    headerName: 'Package templates',
    tooltipField: 'packageTemplatesAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'publishComponentsAccess',
    headerName: 'Publish component',
    tooltipField: 'publishComponentsAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'publishPackagesAccess',
    headerName: 'Publish packages',
    tooltipField: 'publishPackagesAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'contractsAccess',
    headerName: 'Contracts',
    tooltipField: 'contractsAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'phasingTemplatesAccess',
    headerName: 'Phasing templates',
    tooltipField: 'phasingTemplatesAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'referenceFlightsAccess',
    headerName: 'Reference flights',
    tooltipField: 'referenceFlightsAccess',
    editable: row => isEditable(row),
    cellEditorPopup: true,
    cellEditor: SingleSelectCellEditor,
    cellEditorParams: {
      getDropdownValues: getUserRoleDropdownValues
    }
  },
  {
    field: 'users',
    headerName: 'Users',
    width: 70,
    cellRenderer: ToolTipRenderer,
    cellRendererParams: {
      displayValueGetter: params => params.data.users.length,
      tooltipValueGetter: params => params.data.users.map(u => u.name).join('<br/>'),
      showTooltip: params => params.data.users.length > 0,
      displayAsAnchor: true
    }
  },
  {
    field: 'lastSaved',
    headerName: 'Last saved',
    width: 120,
    cellRenderer: DateTimeCellRenderer
  },
  {
    field: 'savedBy',
    headerName: 'Saved by',
    width: 120
  },
  {
    width: 30,
    editable: false,
    cellRenderer: DeleteRowCellRenderer,
    cellRendererParams: row => {
      const editable = isEditable(row);
      if (!editable) {
        return {
          disable: true
        };
      }
      return {
        onClick: params => onRoleDelete(params.id)
      };
    }
  }
];

export function getClaimAccess(value) {
  switch (value) {
    case 'Edit':
      return 'write';
    case 'Read':
      return 'read';
    case 'NoAccess':
      return 'noaccess';
    case 'Customized':
      return 'customized';
    default:
      return value;
  }
}

function getUserRoleDropdownValues() {
  return [
    {
      key: 'Edit',
      value: 'Edit'
    },
    {
      key: 'Read',
      value: 'Read'
    },
    {
      key: 'NoAccess',
      value: 'NoAccess'
    },
    {
      key: 'Customized',
      value: 'Customized'
    }
  ];
}
