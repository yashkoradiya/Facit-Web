import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ModalBase from '../../../../components/ModalBase';
import { Flexbox } from '../../../../components/styled/Layout';
import { PrimaryButton, Button } from '../../../../components/styled/Button';
import AgGridInfinite from '../../../../components/AgGrid/AgGridInfinite';
import PercentageCellRenderer from '../../../../components/AgGrid/renderers/PercentageCellRenderer';

export default function ConfirmPhasingRuleModal({ show, data, onRequestClose, onConfirm, onCancel, isEdit, loading }) {
  const [gridApi, setGridApi] = useState(null);

  const handleGridReady = params => {
    params.api.showLoadingOverlay();

    setGridApi(params.api);
  };

  useEffect(() => {
    if (!loading) gridApi && gridApi.hideOverlay();
  }, [loading, gridApi]);

  return (
    <ModalBase
      show={show}
      width={'800px'}
      title={isEdit ? 'Update phasing curve' : 'Create phasing curve'}
      marginTop={'50px'}
      onRequestClose={onRequestClose}
    >
      {isEdit ? (
        <React.Fragment>
          <p>Updating the phasing curve will cause a re-phasing of costs for the following {data.length} contracts.</p>
          <p>Are you sure you want to update the phasing curve?</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>Creating the phasing curve will cause a re-phasing of costs for the following {data.length} contracts.</p>
          <p>Are you sure you want to create the phasing curve?</p>
        </React.Fragment>
      )}
      <Flexbox direction="column" width="100%" alignItems="flex-end">
        <AgGridInfinite
          gridHeight={'600px'}
          columnDefinitions={columnDefinitions}
          dataSet={{
            data: data,
            dataSetKey: uuidv4()
          }}
          agGridKey={'confirm-phasing-rule-modal'}
          hideSideBar={true}
          onGridReady={handleGridReady}
          overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading...</span>'}
        />
        <Flexbox marginTop="16px">
          <PrimaryButton marginRight="15px" disabled={loading} onClick={onConfirm}>
            {isEdit ? 'Yes, update phasing curve' : 'Yes, create phasing curve'}
          </PrimaryButton>
          <Button onClick={onCancel}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}

const columnDefinitions = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'accommodationName', headerName: 'Accommodation', width: 145 },
  { field: 'country', headerName: 'Country', width: 110 },
  { field: 'destination', headerName: 'Destination', width: 110 },
  { field: 'commitmentLevel', headerName: 'Commitment', width: 100, cellRendererFramework: PercentageCellRenderer }
];
