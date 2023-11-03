import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from 'core/identity/useAuth';
import { v4 as uuidv4 } from 'uuid';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import LoadingIndicator from './LoadingIndicator';
import * as inboxApi from '../api';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import { TextButton } from 'components/styled/Button';
import PublishStatusModal from './PublishStatusModal';
import ButtonCellRenderer from 'components/AgGrid/renderers/ButtonCellRenderer';
import * as actions from 'packaging/components/PublishStatus/actions';
import { format } from 'date-fns';
import { getDateFormatForDateFns } from 'helpers/dateHelper';
let counter = 0;

export default function FailedExports({ dependencies }) {
  const [loading, setLoading] = useState(false);
  const [publishStatusModalOpen, setPublishStatusModalOpen] = useState(false);
  const [dataSet, setDataSet] = useState({ data: [] });
  const [pending, setPending] = useState({});
  const [durations] = useState([0, 7, 14, 21, 28]);
  const dispatch = useDispatch();
  const access = useAuth();

  useEffect(() => {
    if (pending.number === counter) {
      setDataSet({
        data: pending.data.map(x => {
          return { ...x, republishAvailable: hasRePublishAccess(x.packageTypeCode, x.republishAvailable, access) };
        }),
        dataSetKey: uuidv4()
      });
      setLoading(false);
    }
  }, [pending, access]);

  useEffect(() => {
    setLoading(true);

    counter++;
    const currentNumber = counter;

    inboxApi.getFailedExports(dependencies).then(response => {
      setPending({ data: response.data, number: currentNumber });
    });
  }, [dependencies]);

  const handleReevaluation = row => {
    if (
      row.hasChanges &&
      !confirm('Prices have changed since last evaluate, do you want to continue and evaluate the new prices?')
    ) {
      return;
    }
    const payload = {
      id: row.id,
      sourceMarketId: row.sourceMarketId,
      packageType: row.packageTypeCode,
      durations: durations
    };

    setDataSet(ds => ({
      dataSetKey: uuidv4(),
      data: ds.data.map(x => {
        if (x.id === row.id && x.sourceMarketId === row.sourceMarketId) x.reevaluateAvailable = false;
        return x;
      })
    }));
    inboxApi.reevaluate([payload]).then(response => {
      const publishData = getColumnDataForEvaluatePublishStatus(row, response.data);

      dispatch(actions.monitorPublishJob(uuidv4(), `evaluate_${row.packageTypeCode}`, [publishData]));
    });
  };

  const handleRepublish = row => {
    if (
      row.hasChanges &&
      !confirm('Prices have changed since last publish, do you want to continue and publish the new prices?')
    ) {
      return;
    }

    setDataSet(ds => ({
      dataSetKey: uuidv4(),
      data: ds.data.map(x => {
        if (x.id === row.id && x.sourceMarketId === row.sourceMarketId) x.republishAvailable = false;
        return x;
      })
    }));

    inboxApi
      .republishOfferings([
        { id: row.id, sourceMarketId: row.sourceMarketId, packageType: row.packageTypeCode, durations: durations }
      ])
      .then(result => {
        const payloadType =
          result.data[0].packageType === 'transfers'
            ? 'transfers'
            : result.data[0].packageType === 'charter_flight_supplement'
            ? 'charter_flight_supplement'
            : 'offering';
        const payload =
          payloadType === 'transfers'
            ? {
                saleableUnitId: row.saleableUnitId,
                sourceMarketId: row.sourceMarketId,
                planningPeriod: row.season,
                approvalId: result.data[0].approvalId
              }
            : payloadType === 'charter_flight_supplement'
            ? {
                flightid: row.id,
                flight: row.description,
                sourceMarketName: row.sourceMarket,
                packageType: row.packageType,
                approvalId: result.data[0].approvalId
              }
            : {
                sourceMarketName: row.sourceMarket,
                accommodation: row.description,
                packageType: row.packageType,
                roomCount: row.roomCount,
                approvalId: result.data[0].approvalId
              };
        dispatch(actions.monitorPublishJob(uuidv4(), payloadType, [payload]));
      });
  };

  const getColumnDataForEvaluatePublishStatus = (row, data) => {
    switch (row.packageTypeCode) {
      case 'accommodation_only':
      case 'charter_package':
        return {
          sourceMarketName: row.sourceMarket,
          accommodationName: row.description,
          roomCount: row.roomCount,
          packageType: row.packageType,
          approvalId: data[0].approvalId,
          roomTypes: []
        };
      case 'charter_flight_supplement':
        return {
          flightid: row.id,
          flight: row.description,
          sourceMarketName: row.sourceMarket,
          packageType: row.packageType,
          approvalId: data[0].approvalId
        };
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <LoadingIndicator loading={loading} />
      <Flexbox justifyContent="space-between" alignItems="flex-end">
        <PageHeader style={{ marginTop: '16px', marginBottom: '8px' }}>
          Failed Exports ({dataSet.data.length})
        </PageHeader>
        <TextButton onClick={() => setPublishStatusModalOpen(true)}>
          <i className="material-icons">launch</i>
          <span>View pending and failed package publishing status</span>
        </TextButton>
      </Flexbox>
      <AgGridInfinite
        gridHeight="30vh"
        agGridKey="inbox-failed-exports"
        columnDefinitions={getColDefs({ onRepublish: handleRepublish, onReevaluate: handleReevaluation })}
        dataSet={dataSet}
      />
      <PublishStatusModal show={publishStatusModalOpen} onClose={() => setPublishStatusModalOpen(false)} />
    </div>
  );
}
const getColDefs = options => [
  {
    field: 'publishedBy',
    headerName: 'Date & Time',
    width: 130,
    cellRenderer: props => {
      if (!props.data) return null;
      const date = new Date(props.data.timestamp);
      const formattedDate = format(date, getDateFormatForDateFns(3));
      return `${formattedDate || '-'} ${props.data.publishedBy}`;
    }
  },
  {
    field: 'id',
    headerName: 'Id',
    tooltipField: 'id',
    width: 100
  },
  {
    field: 'description',
    headerName: 'Name',
    tooltipField: 'Name',
    width: 100
  },
  {
    field: 'sourceMarket',
    headerName: 'SM',
    tooltipField: 'sourceMarket',
    width: 100
  },
  {
    field: 'reason',
    headerName: 'Reason for failure',
    tooltipField: 'reason',
    width: 130
  },
  {
    field: 'packageType',
    tooltipField: 'packageType',
    headerName: 'Product Type',
    width: 130
  },
  {
    field: 'exportType',
    tooltipField: 'exportType',
    headerName: 'Export Type',
    width: 130
  },
  {
    cellRenderer: ButtonCellRenderer,
    cellRendererParams: row => {
      try {
        if (row.data.exportType === 'Publish') {
          return { title: 'Re-Publish', onClick: options.onRepublish };
        } else {
          return { title: 'Re-Evaluate', onClick: options.onReevaluate };
        }
      } catch (e) {
        console.log('Error: ', e.message);
        console.log('Corresponding Record', row);
      }
    },
    width: 116,
    valueGetter: row => {
      if (!row.data) {
        return null;
      }
      if (row.data.exportType === 'Publish') {
        return row.data.republishAvailable;
      } else {
        return row.data.reevaluateAvailable;
      }
    }
  }
];

export function hasRePublishAccess(packageType, defaultValue, access) {
  let canPublish = true;

  switch (packageType) {
    case 'charter_package':
      canPublish = access.publishpackages.charterpackage.write;
      break;
    case 'accommodation_only':
      canPublish = access.publishpackages.charterpackage.write;
      break;
    case 'charter_flight_supplement':
      canPublish = access.publishcomponents.flightsupplements.write;
      break;
  }

  return canPublish && defaultValue;
}
