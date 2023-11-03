import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from 'core/identity/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { getDateFormatForDateFns } from 'helpers/dateHelper';
import ModalBase from 'components/ModalBase';
import { Flexbox } from 'components/styled/Layout';
import { PrimaryButton, Button } from 'components/styled/Button';
import ButtonCellRenderer from 'components/AgGrid/renderers/ButtonCellRenderer';
import PublishStatusCellRenderer from './PublishStatusCellRenderer';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import * as inboxApi from '../api';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import PublishStatusModalFilters from './PublishStatusModalFilters';
import * as actions from 'packaging/components/PublishStatus/actions';
import LoadingIndicator from './LoadingIndicator';
import { hasRePublishAccess } from './FailedExports';

export default function PublishStatusModal({ show, onClose }) {
  const [dataSet, setDataSet] = useState({ data: [], dataSetKey: '' });
  const [filterOnUser, setFilterOnUser] = useState(false);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const packagePublishedStatus = useSelector(state => state.packagePublishStatus.packagePublishedStatus);
  const dispatch = useDispatch();
  const access = useAuth();

  useEffect(() => {
    if (!show) {
      dispatch(actions.unSubscribeToPackagePublishStatusChanged());
      return;
    }

    dispatch(actions.subscribeToPackagePublishStatusChanged());
  }, [show, dispatch]);

  useEffect(() => {
    const _data = dataSet.data;

    const changedAccommodation = _data.find(
      x => x.id === packagePublishedStatus.id && x.sourceMarketId === packagePublishedStatus.sourceMarketId
    );
    if (changedAccommodation) {
      changedAccommodation.status = packagePublishedStatus.status;
      changedAccommodation.publishedBy = packagePublishedStatus.username;
      changedAccommodation.publishedAt = packagePublishedStatus.approved;
      changedAccommodation.republishAvailable = packagePublishedStatus.republishAvailable;
      setDataSet({
        data: _data,
        dataSetKey: uuidv4()
      });
    }
  }, [packagePublishedStatus, dataSet.data]);

  useEffect(() => {
    if (!show) {
      setDataSet({ data: [], dataSetKey: '' });
      return;
    }

    const allFilters = { filterOnUser, ...filters };
    setIsLoading(true);
    inboxApi.getPublishStatus(allFilters).then(result => {
      setDataSet({
        data: result.data.map(x => {
          return { ...x, republishAvailable: hasRePublishAccess(x.packageTypeCode, x.republishAvailable, access) };
        }),
        dataSetKey: uuidv4()
      });
      setIsLoading(false);
    });
  }, [show, filters, filterOnUser, access]);

  const handleRepublishOne = row => {
    if (
      row.hasChanges &&
      !confirm('Prices have changed since last publish, do you want to continue and publish the new prices?')
    ) {
      return;
    }

    setDataSet(ds => ({
      dataSetKey: uuidv4(),
      data: ds.data.map(x => {
        if (x.id === row.id && x.sourceMarketId === row.sourceMarketId) {
          x.republishAvailable = false;
        }
        return x;
      })
    }));

    inboxApi
      .republishOfferings([{ id: row.id, sourceMarketId: row.sourceMarketId, packageType: row.packageTypeCode }])
      .then(result => {
        dispatch(
          actions.monitorPublishJob(uuidv4(), result.data[0].packageType === 'transfers' ? 'transfers' : 'offering', [{ ...row, approvalId: result.data[0].approvalId }])
        );
      });
  };

  const handleRepublishAll = () => {
    const toRepublish = dataSet.data.filter(x => x.republishAvailable);
    if (!toRepublish.length) return;

    if (
      toRepublish.some(x => x.hasChanges) &&
      !confirm('Prices have changed since last publish, do you want to continue and publish the new prices?')
    ) {
      return;
    }

    inboxApi
      .republishOfferings(
        toRepublish.map(x => ({
          id: x.id,
          sourceMarketId: x.sourceMarketId,
          packageType: x.packageTypeCode
        }))
      )
      .then(result => {
        const republished = result.data.map(d => {
          const foundItem = toRepublish.find(
            x => x.id === d.id && x.sourceMarketId === d.sourceMarket && x.packageTypeCode === d.packageType
          );
          return {
            ...foundItem,
            approvalId: d.approvalId
          };
        });
        dispatch(actions.monitorPublishJob(uuidv4(), 'offering', republished));
      });
  };

  const republishAvailableCount = dataSet.data.filter(x => x.republishAvailable).length;

  return (
    <ModalBase show={show} onRequestClose={onClose} title="Pending and failed publishing status" width="1200px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <PublishStatusModalFilters onChange={setFilters} />
        <Flexbox marginTop="20px" marginBottom="20px" justifyContent="space-between" width="100%">
          <LoadingIndicator loading={isLoading} />
          <InputCheckbox
            label={'Only show items that I have published'}
            checked={filterOnUser}
            onChange={() => {
              setFilterOnUser(!filterOnUser);
            }}
          />
          {republishAvailableCount > 0 && (
            <Button
              onClick={handleRepublishAll}
            >{`Re-publish all failed or timeouts (${republishAvailableCount})`}</Button>
          )}
        </Flexbox>
        <Flexbox justifyContent="space-between" marginBottom="20px" width="100%">
          <AgGridInfinite
            disableSelection={true}
            gridHeight="500px"
            columnDefinitions={getColDefs({ onRepublish: handleRepublishOne })}
            dataSet={dataSet}
            agGridKey={'package_publish_status'}
          ></AgGridInfinite>
        </Flexbox>
        <Flexbox alignSelf="flex-end" marginTop="auto" childrenMarginRight="20px">
          <p style={{ color: 'gray' }}>*If items have not reached @Com within 120 hours it is considered a time-out</p>
          <PrimaryButton onClick={onClose}>Close</PrimaryButton>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}

const getColDefs = options => [
  {
    field: 'accommodation',
    headerName: 'Accommodation',
    width: 150
  },
  {
    field: 'accommodationContractCode',
    headerName: 'Acc. contract code',
    width: 135
  },
  {
    field: 'roomCount',
    headerName: 'Rooms',
    width: 70,
    type: 'numericColumn'
  },
  {
    field: 'sourceMarketName',
    headerName: 'SM',
    width: 70
  },
  {
    field: 'packageType',
    headerName: 'Product Type',
    width: 130
  },
  {
    field: 'publishedAt',
    headerName: 'Published in Facit NG',
    cellRenderer: props => {
      if (!props.data) return null;
      const date = new Date(props.data.publishedAt);
      const formattedDate = format(date, getDateFormatForDateFns(3));
      return `${formattedDate || '-'} ${props.data.publishedBy}`;
    },
    width: 200
  },
  {
    field: 'status',
    headerName: 'Facit NG',
    width: 116,
    cellRenderer: PublishStatusCellRenderer,
    cellRendererParams: {
      getStatus: value => mapStatusToFacitStatus(value)
    }
  },
  {
    field: 'status',
    headerName: 'Sent to @Com*',
    width: 116,
    cellRenderer: PublishStatusCellRenderer,
    cellRendererParams: {
      getStatus: value => mapStatusToAdapterStatus(value)
    }
  },
  {
    field: 'republishAvailable',
    headerName: '',
    cellRenderer: ButtonCellRenderer,
    cellRendererParams: { title: 'Re-publish', onClick: options.onRepublish },
    width: 116
  }
];

const mapStatusToFacitStatus = status => {
  switch (status) {
    case 'FacitPending':
      return {
        icon: 'cached',
        text: 'Pending',
        color: 'orange'
      };
    case 'FacitFailed':
      return {
        icon: 'error_outline',
        text: 'Failed',
        color: 'red'
      };
    case 'FacitPublished':
    case 'AdapterAcknowledged':
    case 'AdapterTimedOut':
      return {
        icon: 'done',
        text: 'Published',
        color: 'green'
      };
    default:
      return {};
  }
};

const mapStatusToAdapterStatus = status => {
  switch (status) {
    case 'FacitPending':
    case 'FacitFailed':
      return {
        icon: '',
        text: '-'
      };
    case 'FacitPublished':
      return {
        icon: 'cached',
        text: 'Pending',
        color: 'orange'
      };
    case 'AdapterAcknowledged':
      return {
        icon: 'done',
        text: 'Published',
        color: 'green'
      };
    case 'AdapterTimedOut':
      return {
        icon: 'av_timer',
        text: 'Time-out',
        color: 'red'
      };
    default:
      return {};
  }
};
