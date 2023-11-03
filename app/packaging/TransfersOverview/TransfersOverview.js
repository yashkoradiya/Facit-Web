import React, { useEffect, useReducer, useRef } from 'react';
import { useSelector } from 'react-redux';
import { fromJS, List } from 'immutable';
import * as matchingCriteriaApi from '../../apis/matchingCriteriasApi';
import * as sourceMarketApi from '../../apis/sourceMarketsApi';
import { Flexbox } from 'components/styled/Layout';
import { PrimaryButtonWithIcon } from 'components/styled/Button';
import CollapsableContainer from 'components/CollapsableContainer';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import TransfersSearchPanel from './TransferSearchPanel/TransfersSearchPanel';
import TransferPublishModal from './TransferPublisModal/TransferPublisModal';
import TransferEvaluateModal from './TransferEvaluateModal/TransferEvaluateModal';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import { getDateFormat } from 'helpers/dateHelper';
import { v4 as uuidv4 } from 'uuid';
import RuleToolTipRenderer from 'components/AgGrid/renderers/RuleToolTipRenderer';
import Spinner from 'components/Spinner';
import { search } from './api';
import { WarningIcon } from 'components/styled/Graphics';
import WarningsHeader from 'components/AgGrid/WarningsHeader';
import WarningCellRenderer from 'components/AgGrid/renderers/WarningCellRenderer';
import { processServiceWorkerMessage } from 'packaging/MessageHandlers/SWMessageHandlers';

const actionConstants = {
  handlePublishPrices: 'handlePublishPrices',
  setFilters: 'setFilters',
  togglePublishModal: 'togglePublishModal',
  toggleProgressIndicator: 'toggleProgressIndicator',
  setSearchResult: 'setSearchResult',
  setSelectedProductTypes: 'setSelectedProductTypes',
  setLatestFilters: 'setLatestFilters', //Refactor this with semantic action
  setGridOptions: 'setGridOptions',
  setClearFn: 'setClearFn'
};

const initialState = {
  loading: false,
  showPublishModal: false,
  showEvaluateModal: false,
  searchResult: { dataSetKey: null, data: [], missingExchangeRates: false, missingExchangeRatesCount: 0 },
  productTypes: List(),
  seasons: List(),
  sourceMarkets: List(),
  departurePoint: List(),
  arrivalPoint: List(),
  weekdays: List(),
  transferTypes: List(),
  unitTypes: List(),
  selectedProductTypes: List(),
  latestFilters: List(), //Should be refactored to semantic key,
  gridOptions: {
    context: {
      currency: { selected: null }
    },
    enableBrowserTooltips: true,
    getRowClass: params => {
      if (!params.data) return null;
      if (params.data.hasUnpublishedChanges) return 'unpublished-row';
    }
  },
  clearFn: null
};

function reducer(state, action) {
  switch (action.type) {
    case actionConstants.setFilters:
      return { ...state, ...action.payload };
    case actionConstants.togglePublishModal:
      return { ...state, showPublishModal: !state.showPublishModal };
      case actionConstants.toggleEvaluateModal:
        return { ...state, showEvaluateModal: !state.showEvaluateModal };
    case actionConstants.toggleProgressIndicator:
      return { ...state, loading: !state.loading };
    case actionConstants.setSearchResult:
      return { ...state, searchResult: action.payload };
    case actionConstants.setSelectedProductTypes:
      return { ...state, selectedProductTypes: action.payload };
    case actionConstants.setLatestFilters:
      return { ...state, latestFilters: action.payload };
    case actionConstants.setGridOptions:
      return { ...state, gridOptions: action.payload };
    case actionConstants.setClearFn:
      return { ...state, clearFn: action.payload };
    default:
      throw new Error();
  }
}

export default function TransfersOverview() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const access = useSelector(reduxState => reduxState.appState.user.access);
  const selectedCurrency = useSelector(reduxState => reduxState.appState.selectedCurrency);
  const externalWindowRef = useRef(null);

  useEffect(() => {
    const fetchCriteriaData = async () => {
      const sourceMarketResponse = await sourceMarketApi.getSourceMarkets();

      const matchingCriteriasResponse = await matchingCriteriaApi.get([
        'producttype',
        'season',
        'weekday',
        'airport',
        'area',
        'transfertype',
        'transferunittype'
      ]);

      return { sourceMarketResponse, matchingCriteriasResponse };
    };

    dispatch({ type: actionConstants.toggleProgressIndicator });
    fetchCriteriaData().then(response => {
      const airportValues = response.matchingCriteriasResponse.data.find(x => x.key === 'airport')?.values;
      const areaValues = response.matchingCriteriasResponse.data.find(x => x.key === 'area')?.values;

      const payload = {
        productTypes: fromJS(response.matchingCriteriasResponse.data.find(x => x.key === 'producttype')?.values),
        sourceMarkets: fromJS(response.sourceMarketResponse.data),
        seasons: fromJS(response.matchingCriteriasResponse.data.find(x => x.key === 'season')?.values),
        departurePoint: fromJS(airportValues.concat(areaValues)),
        arrivalPoint: fromJS(airportValues.concat(areaValues)),
        weekdays: fromJS(response.matchingCriteriasResponse.data.find(x => x.key === 'weekday')?.values),
        transferTypes: fromJS(response.matchingCriteriasResponse.data.find(x => x.key === 'transfertype')?.values),
        unitTypes: fromJS(response.matchingCriteriasResponse.data.find(x => x.key === 'transferunittype')?.values)
      };

      dispatch({ type: actionConstants.setFilters, payload });
      dispatch({ type: actionConstants.toggleProgressIndicator });
    });
  }, []);

  const handleSearch = async payload => {
    dispatch({ type: actionConstants.toggleProgressIndicator });
    const searchResp = await search(payload).finally(() => {
      dispatch({ type: actionConstants.toggleProgressIndicator });
    });

    const updatedGridOptions = state.gridOptions;
    updatedGridOptions.context.currency.selected = selectedCurrency;

    dispatch({
      type: actionConstants.setGridOptions,
      payload: updatedGridOptions
    });

    const { transfer, missingExchangeRates } = searchResp.data;

    dispatch({
      type: actionConstants.setSearchResult,
      payload: {
        dataSetKey: uuidv4(),
        data: transfer,
        missingExchangeRates: !!missingExchangeRates,
        missingExchangeRatesCount: missingExchangeRates
          ? transfer.filter(item => Boolean(item.warnings?.length)).length
          : 0
      }
    });

    dispatch({
      type: actionConstants.setSelectedProductTypes,
      payload: payload.productTypeIds
    });

    dispatch({
      type: actionConstants.setLatestFilters,
      payload: payload
    });
  };

  const handlePricesPublished = () => {
    handleCloseReviewPrices();
    handleSearch(latestFilters);
  };
  const handleReviewPublished = () => {
    handleCloseReviewPrice();
    handleSearch(latestFilters);
  };
  const handleCloseReviewPrices = () => {
    dispatch({ type: actionConstants.togglePublishModal });
  };
  const handleCloseReviewPrice = () => {
    dispatch({type: actionConstants.toggleEvaluateModal});
  };

  const onRowSelection = event =>
    processServiceWorkerMessage(event, externalWindowRef, state.clearFn, '/packaging/transfers/details');

  const togglePublishModal = () => dispatch({ type: actionConstants.togglePublishModal });
  const toggleEvaluateModal = () => dispatch({ type: actionConstants.toggleEvaluateModal });

  const {
    productTypes,
    seasons,
    sourceMarkets,
    departurePoint,
    arrivalPoint,
    weekdays,
    transferTypes,
    unitTypes,
    showPublishModal,
    showEvaluateModal,
    loading,
    searchResult,
    selectedProductTypes,
    latestFilters,
    gridOptions
  } = state;

  const collapsableContainerTitleChild = (
    <Flexbox marginLeft="auto">
      {searchResult.missingExchangeRates && (
        <Flexbox marginRight="16px">
          <WarningIcon margin="0 4px">warning</WarningIcon>
          Missing exchange rates for {searchResult.missingExchangeRatesCount} Transfer
          {searchResult.missingExchangeRatesCount === 1 ? '' : 's'}
        </Flexbox>
      )}
      { <div style={{ marginRight: '8px', fontSize: '14px', float: 'left' }}>
      {access.publishpackages.transfer.write && (
        <PrimaryButtonWithIcon onClick={toggleEvaluateModal} disabled={searchResult.missingExchangeRates}>
          <i className="material-icons">
            publish
          </i>
          Evaluate Prices
        </PrimaryButtonWithIcon>
      )}
      </div>}

      {access.publishpackages.transfer.write && (
        <PrimaryButtonWithIcon onClick={togglePublishModal} disabled={searchResult.missingExchangeRates}>
          <i className="material-icons">
            publish
          </i>
          Publish
        </PrimaryButtonWithIcon>
      )}
    </Flexbox>
  );

  return (
    <Flexbox direction={'column'} alignItems={'flex-start'} height="100%">
      <Spinner loading={loading} />
      <Flexbox justifyContent="space-between" width="100%" direction="column">
        <CollapsableContainer
          title="Transfers Overview"
          hideText="Hide search filters"
          showText="Show search filters"
          titleChildren={collapsableContainerTitleChild}
          localStorageKey="transfers_overview_collapsed_search_panel"
        >
          <TransfersSearchPanel
            onSearch={handleSearch}
            productTypes={productTypes}
            seasons={seasons}
            sourceMarkets={sourceMarkets}
            departurePoint={departurePoint}
            arrivalPoint={arrivalPoint}
            weekdays={weekdays}
            transferTypes={transferTypes}
            unitTypes={unitTypes}
          />
        </CollapsableContainer>
      </Flexbox>

      <AgGridInfinite
        gridHeight="100%"
        dataSet={searchResult}
        columnDefinitions={getColumnDefinitions()}
        gridOptions={gridOptions}
        agGridKey={`TransfersOverview-${selectedCurrency}`}
        onRowSelected={onRowSelection}
        clearSelection={clearSelectionFn => dispatch({ type: actionConstants.setClearFn, payload: clearSelectionFn })}
        rowSelection={'single'}
      />
        {showEvaluateModal && (
        <TransferEvaluateModal
          showModal={showEvaluateModal}
          onClose={() => dispatch({ type: actionConstants.toggleEvaluateModal })}
          allRows={searchResult.data}
          productType={selectedProductTypes}
          onEvaluated={handleReviewPublished}
        />
      )}
      {showPublishModal && (
        <TransferPublishModal
          showModal={showPublishModal}
          onClose={() => dispatch({ type: actionConstants.togglePublishModal })}
          allRows={searchResult.data}
          productType={selectedProductTypes}
          onPublished={handlePricesPublished}
        />
      )}
    </Flexbox>
  );
}

const getColumnDefinitions = () => {
  return [
    {
      field: 'warnings',
      headerName: 'Warnings',
      cellClass: 'no-border',
      width: 24,
      headerComponent: WarningsHeader,
      cellRenderer: WarningCellRenderer,
      exportValueGetter: value => value.map(v => v.message)
    },
    {
      field: 'productConfigurationId',
      headerName: 'Prod. config ID',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'saleableUnitId',
      headerName: 'SaleableUnitId',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'productType',
      headerName: 'Product type',
      cellClass: 'no-border',
      width: 120
    },
    {
      field: 'season',
      headerName: 'Planning Period',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'sourceMarket',
      headerName: 'Source market',
      cellClass: 'no-border',
      width: 108
    },
    {
      field: 'departure',
      headerName: 'Departure point',
      cellClass: 'no-border',
      width: 110
    },
    {
      field: 'arrival',
      headerName: 'Arrival point',
      cellClass: 'no-border',
      width: 110
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      cellClass: 'no-border',
      width: 110,
      cellRenderer: DateCellRenderer
    },
    {
      field: 'endDate',
      headerName: 'End date',
      cellClass: 'no-border',
      width: 110,
      cellRenderer: DateCellRenderer
    },
    {
      field: 'weekday',
      headerName: 'Weekday',
      cellClass: 'no-border',
      width: 110
    },
    {
      field: 'transferType',
      headerName: 'Transfer type',
      cellClass: 'no-border',
      width: 110
    },
    {
      field: 'unitType',
      headerName: 'Unit type',
      cellClass: 'no-border',
      width: 110
    },
    {
      field: 'appliedRules',
      headerTooltip: 'Number of applied transfer rules',
      headerName: 'Price rules',
      width: 93,
      type: 'numericColumn',
      cellRenderer: RuleToolTipRenderer
    },
    {
      field: 'lastPublished',
      headerName: 'Last published',
      cellClass: 'no-border',
      width: 116,
      cellRenderer: DateCellRenderer,
      cellRendererParams: { format: getDateFormat(3), useLocal: true }
    },
    {
      field: 'publishedBy',
      headerName: 'Published by',
      cellClass: 'no-border',
      width: 116
    },
    {
      field: 'lastEvaluated',
      headerName: 'Last evaluated',
      cellClass: 'no-border',
      width: 116,
      cellRenderer: DateCellRenderer,
      cellRendererParams: { format: getDateFormat(3), useLocal: true }
    },
    {
      field: 'evaluatedBy',
      headerName: 'Evaluated by',
      cellClass: 'no-border',
      width: 116
    }
  ];
};
