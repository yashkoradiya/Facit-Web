import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { v4 as uuidv4 } from 'uuid';
import { getNumber } from '../../../../helpers/numberHelper';
import DeleteDurationGroupCellRenderer from './cells/DeleteDurationGroupCellRenderer';
import { ErrorBox } from 'components/styled/Layout';
import { getData, validateRow, validateAllDurationGroups } from './utils';

const defaultValidationFunc = () => {};
export default function DurationGroupsEditor({
  durationGroups,
  onChange,
  disabled,
  onValidation = defaultValidationFunc
}) {
  const [durations, setDurations] = useState(durationGroups);
  const [newDurationGroup, setNewDurationGroup] = useState(newDurationGroupRow());
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setDurations([...durationGroups]);
    const valid = validateAllDurationGroups(durationGroups);
    setIsValid(valid);
    onValidation(valid);
  }, [durationGroups, onValidation]);

  const onCellValueChanged = params => {
    const row = params.data;

    const idx = durations.findIndex(x => x.key === row.key);
    if (idx === -1) {
      if (row.from && row.to) {
        const newDuration = { ...row };
        const updatedDurations = [...durations, newDuration];

        const valid = row.valid && validateAllDurationGroups(updatedDurations);

        setIsValid(valid);
        if (valid) {
          delete newDuration.isNew;
          setNewDurationGroup(newDurationGroupRow());
          onChange(updatedDurations);
        }

        onValidation(valid);
      } else {
        setNewDurationGroup({ ...row });
      }
    } else {
      const updatedDurations = [...durations];
      updatedDurations[idx] = { ...row };

      const valid = row.valid && validateAllDurationGroups(updatedDurations);
      setIsValid(valid);

      if (valid) {
        onChange(updatedDurations);
      } else {
        setDurations(updatedDurations);
      }

      onValidation(valid);
    }
  };

  const onDelete = key => {
    const updated = durations.filter(x => x.key !== key);
    if (updated.length === 0) return;
    const valid = validateAllDurationGroups(updated);

    setIsValid(valid);

    if (valid) onChange(updated);
  };

  return (
    <div style={{ width: '283px' }} data-testid="test-duration-groups-editor">
      {!isValid && <ErrorBox style={{ marginBottom: '1rem' }}>Invalid duration groups</ErrorBox>}
      <div
        id="duration-groups-grid"
        style={{
          width: '100%'
        }}
        className="ag-theme-balham"
      >
        <AgGridReact
          defaultColDef={{
            suppressMovable: true,
            suppressMenu: true,
            cellStyle: {
              height: '100%'
            },
            editable: !disabled
          }}
          domLayout="autoHeight"
          suppressRowTransform={true}
          suppressColumnVirtualisation={true}
          suppressContextMenu={true}
          gridOptions={{
            singleClickEdit: true,
            enterNavigatesVerticallyAfterEdit: true,
            rowStyle: { border: 'none' },
            context: {
              disabled: disabled
            }
          }}
          deltaRowDataMode={true}
          getRowNodeId={data => data.key}
          stopEditingWhenGridLosesFocus={true}
          rowData={getData(durations, newDurationGroup)}
          rowDataChangeDetectionStrategy="IdentityCheck"
          columnDefs={getColumnDefs(onDelete)}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}

const newDurationGroupRow = () => ({
  from: null,
  to: null,
  key: uuidv4(),
  isNew: true
});

const getColumnDefs = onDelete => {
  return [
    {
      field: 'from',
      headerName: 'From (No. of nights)',
      width: 125,
      valueParser: valueParser,
      //Expected subtree parent to be a mounted class component. <-- Kolla upp
      //eslint-disable-next-line  react/display-name
      cellRenderer: props => {
        if (props.data.isNew && props.data.from === null) {
          return <span style={{ fontSize: 9, color: 'grey', fontStyle: 'italic' }}>Add duration +</span>;
        }

        return <span>{props.data.from}</span>;
      }
    },
    {
      field: 'to',
      headerName: 'To (No. of nights)',
      width: 125,
      valueParser: valueParser
    },
    {
      width: 30,
      editable: false,
      cellRenderer: DeleteDurationGroupCellRenderer,
      cellRendererParams: {
        onClick: onDelete
      }
    }
  ];
};

const valueParser = params => {
  const updatedRow = {
    ...params.data,
    [params.colDef.field]: params.newValue
  };
  params.data.valid = validateRow(updatedRow);
  return getNumber(params.newValue);
};
