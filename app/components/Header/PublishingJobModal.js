import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Flexbox, AgGridToolTip } from '../../components/styled/Layout';
import ModalBase from '../ModalBase';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { EVALUATE_PACKAGE_TYPES } from './statusPanelColDefs';

export default function PublishingJobModal({ width, show, data, columnDefinitions, onRequestClose, jobType }) {
  let title = 'Publish Status';
  if (EVALUATE_PACKAGE_TYPES.includes(jobType)) title = 'Evaluate Status';
  return (
    <ModalBase show={show} onRequestClose={onRequestClose} width={width} title={title}>
      <Flexbox direction="column" width="100%" alignItems="flex-start">
        <div
          style={{
            width: '100%',
            height: '600px',
            marginBottom: '10px',
            marginTop: '10px',
            position: 'static'
          }}
          className="ag-theme-balham"
        >
          <AgGridToolTip width="auto" minHeight="auto" className={'tooltip-content'} />
          <AgGridReact
            suppressColumnVirtualisation={true}
            rowData={data}
            columnDefs={columnDefinitions}
            getContextMenuItems={getDefaultContextMenuItems}
            gridOptions={{ suppressPropertyNamesCheck: true }}
          />
        </div>
      </Flexbox>
    </ModalBase>
  );
}
