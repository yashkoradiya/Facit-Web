import React from 'react';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import LoadingIndicator from '../LoadingIndicator';
import { PageHeader } from 'components/styled/Layout';
import useStatusFetch from './../UseStatusFetch';

export default function InboxStatusGrid({ gridKey, gridHeight, title, columnDefinitions, dependencies }) {
  const { loading, dataSet } = useStatusFetch(gridKey, dependencies);

  return (
    <div data-testid="status-grid-container" style={{ position: 'relative', width: '100%' }}>
      <LoadingIndicator loading={loading} />
      <PageHeader style={{ marginTop: '16px', marginBottom: '8px' }}>
        {title} ({dataSet.data.length})
      </PageHeader>
      <AgGridInfinite
        gridHeight={gridHeight}
        agGridKey={gridKey}
        columnDefinitions={columnDefinitions}
        dataSet={dataSet}
      />
    </div>
  );
}
