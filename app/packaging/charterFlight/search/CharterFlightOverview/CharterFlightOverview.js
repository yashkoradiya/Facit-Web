import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { fromJS, List } from 'immutable';
import { Flexbox } from '../../../../components/styled/Layout';
import { PrimaryButtonWithIcon } from '../../../../components/styled/Button';
import AgGridInfinite from '../../../../components/AgGrid/AgGridInfinite';
import getDefaultContextMenuItems from '../../../../components/AgGrid/common/getDefaultContextMenuItems';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';
import * as sourceMarketApi from '../../../../apis/sourceMarketsApi';
import getColumnDefinitions from '../columnDefinitions';
import { searchFlightSeries } from '../api';
import ConfirmFlightReferenceModal from '../ConfirmFlightReferenceModal';
import FlightSearchPanel from '../../components/FlightSearchPanel';
import ReviewCharterFlightPrices from '../ReviewCharterFlightPrices';
import EvaluateCharterFlightPrices from '../EvaluateCharterFlightPrices';
import Spinner from '../../../../components/Spinner';
import CollapsableContainer from 'components/CollapsableContainer';
import { getFlighProductTypes } from 'packaging/packaging-utils';

class CharterFlightOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResult: { dataSetKey: null, data: [] },
      showFlightDetails: false,
      detailedData: {},
      showConfirmReferenceFlight: false,
      confirmReferenceFlightData: {},
      latestFilters: {},
      seasons: [],
      sourceMarkets: List(),
      departureAirports: List(),
      destinationAirports: List(),
      airlines: List(),
      weekdays: List(),
      productTypes: List(),
      gridOptions: {
        context: {
          currency: { selected: props.selectedCurrency }
        },
        enableBrowserTooltips: true,
        getRowClass: params => {
          if (!params.data) {
            return null;
          }
          if (params.data.hasUnpublishedChanges) return 'unpublished-row';
        }
      },
      showPublish: false,
      showEvaluate: false,
      loading: false,
      publishButtonDisabled: false,
      evaluateButtonDisabled: false,
      missingExchangeRatesDates: null,
      publishedBlockedMessage: null
    };
  }

  async componentDidMount() {
    const sourceMarketResponse = await sourceMarketApi.getSourceMarkets();

    const matchingCriteriasResponse = await matchingCriteriaApi.get([
      'producttype',
      'season',
      'departureairport',
      'destinationairport',
      'airline',
      'weekday'
    ]);

    this.setState({
      productTypes: fromJS(
        getFlighProductTypes(matchingCriteriasResponse.data.find(x => x.key === 'producttype')?.values)
      ),
      sourceMarkets: fromJS(sourceMarketResponse.data),
      seasons: matchingCriteriasResponse.data.find(x => x.key === 'season')?.values,
      destinationAirports: fromJS(matchingCriteriasResponse.data.find(x => x.key === 'destinationairport')?.values),
      departureAirports: fromJS(matchingCriteriasResponse.data.find(x => x.key === 'departureairport')?.values),
      airlines: fromJS(matchingCriteriasResponse.data.find(x => x.key === 'airline')?.values),
      weekdays: fromJS(matchingCriteriasResponse.data.find(x => x.key === 'weekday')?.values)
    });
  }
  handleSearch = filters => {
    this.getFlights(filters);
  };

  getFlights = filters => {
    this.setState({ loading: true });
    searchFlightSeries(filters)
      .then(({ data }) => {
        const updatedGridOptions = this.state.gridOptions;
        updatedGridOptions.context.currency.selected = this.props.selectedCurrency;
        const [publishedBlockedMessage, missingExchangeRatesMessage] = this.validateResponseForPublishing(
          data
        );

        this.setState({
          searchResult: {
            dataSetKey: uuidv4(),
            data: data.charterFlights || []
          },
          missingExchangeRatesCount: data.missingExchangeRatesCount,
          latestFilters: filters,
          gridOptions: updatedGridOptions,
          publishedBlockedMessage,
          missingExchangeRatesMessage,
          publishButtonDisabled: publishedBlockedMessage || missingExchangeRatesMessage, 
        });
      })
      .finally(() => this.setState({ loading: false }));
  };
  validateResponseForPublishing = data => {
    const result = [];
    const {
      missingExchangeRatesCount,
      numberOfFlightsMissingPackageRule
    } = data;

    let publishedBlockedMessage = null;
    this.setState({ evaluateButtonDisabled: false });

    if (numberOfFlightsMissingPackageRule > 0) {
      this.setState({ evaluateButtonDisabled: false });
      publishedBlockedMessage = `No margin applied on ${numberOfFlightsMissingPackageRule} flights${
        numberOfFlightsMissingPackageRule === 1 ? '' : ''
      }`;
    }
    let missingExchangeRatesMessage = null; 
      if (missingExchangeRatesCount) {
      this.setState({ evaluateButtonDisabled: true });
      missingExchangeRatesMessage = `Missing exchange rates for ${missingExchangeRatesCount} flight${missingExchangeRatesCount === 1 ? '' : 's' }`
  }
    
    result[0] = publishedBlockedMessage;
    result[1] = missingExchangeRatesMessage;
    return result;
  };

  handleRowClicked = ({ data, column }) => {
    if (data.warnings.some(x => x.WarningLevel < 2)) return;

    if (column.colId === 'hasUnpublishedChanges') {
      return;
    }
  };

  handleCloseDetailView = () => {
    this.setState({ showFlightDetails: false, detailedData: {} });
  };

  // handleSetReferenceFlight = data => {
  //   if (!data.referenceFlightId) {
  //     this.handleConfirmSetReferenceFlight(data);
  //     return;
  //   }

  //   getReferenceFlightPreview(data.id).then(result => {
  //     this.setState({
  //       showConfirmReferenceFlight: true,
  //       confirmReferenceFlightData: { ...data, ...result.data }
  //     });
  //   });
  // };   //As mentioned in the JIRA CFD-4628, commented out the code to set reference flight

  // handleConfirmSetReferenceFlight = async data => {
  //   const name = `${data.departureAirport}-${data.arrivalAirport} ${data.weekday}`;

  //   if (data.referenceFlightId) {
  //     await updateReferenceFlight(data.referenceFlightId, data.id, name);
  //   } else {
  //     await createReferenceFlight(data.id, name);
  //   }

  //   this.getFlights(this.state.latestFilters);
  //   this.setState({
  //     showConfirmReferenceFlight: false,
  //     confirmReferenceFlightData: {}
  //   });
  // }; //As mentioned in the JIRA CFD-4628, commented out the code to set reference flight

  handleCloseConfirmReferenceFlight = () => {
    this.setState({
      showConfirmReferenceFlight: false,
      confirmReferenceFlightData: {}
    });
  };

  handleCloseReviewPrices = () => {
    this.setState({ showPublish: false });
  };
  handleCloseEvaluatePrices = () => {
    this.setState({ showEvaluate: false });
  };

  handlePricesPublished = () => {
    this.handleCloseReviewPrices();
    this.getFlights(this.state.latestFilters);
  };

  handlePricesEvaluated = () => {
    this.handleCloseEvaluatePrices();
    this.getFlights(this.state.latestFilters);
  };

  handlePublishPrices = () => {
    this.setState({ showPublish: true });
  };
  handleEvaluatePrices = () => {
    this.setState({ showEvaluate: true });
  };
  handleRowSelectionChanged = event => {
    if (event.data.warnings.some(x => x.WarningLevel < 2)) return;

    if (event.data.warnings.some(x => x.warningLevel === 'BlockViewAndPublish')) return;
    let win = this.state.externalWindow;
    const message = {
      event: event.node.selected ? 'add' : 'remove',
      data: event.data
    };
    if (win || message.event === 'remove') {
      this.postMessage(message);
    } else {
      event.node.setSelected(true);
      win = window.open('/packaging/charter-flight/details', '_blank');
      win.onload = () => {
        win.onServiceWorkerReady = () => {
          this.postMessage(message);
        };
      };

      win.onunload = unloadEvent => {
        if (unloadEvent.target.URL !== 'about:blank') {
          this.setState({ externalWindow: null });
          if (this.clearSelection) {
            this.clearSelection();
          }
        }
      };

      this.setState({
        externalWindow: win
      });
    }
  };

  postMessage = ({ event, data }) => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        event: event,
        data: data
          ? {
              masterId: data?.id,
              sourceMarket: data?.sourceMarket,
              sourceMarketId: data?.sourceMarketId,
              currency: this.props.selectedCurrency,
              seasonId: data?.seasonId
            }
          : null
      });
    }
  };

  render() {
    const {
      searchResult,
      showConfirmReferenceFlight,
      confirmReferenceFlightData,
      seasons,
      productTypes,
      sourceMarkets,
      departureAirports,
      destinationAirports,
      airlines,
      weekdays,
      gridOptions,
      showPublish,
      showEvaluate,
      loading,
      publishedBlockedMessage,
      missingExchangeRatesMessage,
      publishButtonDisabled,
      evaluateButtonDisabled,
    } = this.state;

    const { access } = this.props;

    const collapsableContainerTitleChild = (
      <Flexbox data-testid="action-buttons" marginLeft="auto">
      <div>
          {publishedBlockedMessage && (
            <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
              <i className="material-icons" style={{ fontSize: 18, marginRight: 8, color: 'rgb(237, 201, 0)' }}>
                warning
              </i>
              {publishedBlockedMessage}
            </div>
          )}

          {missingExchangeRatesMessage && (
            <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
              <i className="material-icons" style={{ fontSize: 18, marginRight: 8, color: 'rgb(237, 201, 0)' }}>
              warning
              </i>
              {missingExchangeRatesMessage}
            </div>
          )}
        </div>
        {access.publishcomponents.flightsupplements.write && (
          <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <PrimaryButtonWithIcon onClick={this.handleEvaluatePrices} disabled={evaluateButtonDisabled}>
              <i className="material-icons" style={{ marginRight: '16px', fontSize: '14px', float: 'left' }}>
                publish
              </i>
              Evaluate Price
            </PrimaryButtonWithIcon>
          </div>
        )}

        {access.publishcomponents.flightsupplements.write && (
          <PrimaryButtonWithIcon onClick={this.handlePublishPrices} disabled={publishButtonDisabled}>
            <i className="material-icons" style={{ marginRight: '8px', fontSize: '14px', float: 'left' }}>
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
            title="Flight Overview"
            hideText="Hide search filters"
            showText="Show search filters"
            titleChildren={collapsableContainerTitleChild}
            localStorageKey="flight_overview_collapsed_search_panel"
          >
            <FlightSearchPanel
              onSearch={this.handleSearch}
              productTypes={productTypes}
              seasons={seasons}
              sourceMarkets={sourceMarkets}
              destinationAirports={destinationAirports}
              departureAirports={departureAirports}
              airlines={airlines}
              weekdays={weekdays}
            />
          </CollapsableContainer>
        </Flexbox>

        <AgGridInfinite
          gridHeight="100%"
          dataSet={searchResult}
          columnDefinitions={getColumnDefinitions({
            currency: this.props.selectedCurrency
          })}
          gridOptions={gridOptions}
          getContextMenuItems={getDefaultContextMenuItems}
          agGridKey={`charterFlightOverview-${this.props.selectedCurrency}`}
          //onCellClicked={this.handleRowClicked}
          clearSelection={clearSelectionFunc => (this.clearSelection = clearSelectionFunc)}
          onRowSelected={this.handleRowSelectionChanged}
          rowSelection={'single'}
        />
        {showConfirmReferenceFlight && (
          <ConfirmFlightReferenceModal
            show={showConfirmReferenceFlight}
            data={confirmReferenceFlightData}
            onRequestClose={this.handleCloseConfirmReferenceFlight}
            onConfirm={this.handleConfirmSetReferenceFlight}
          />
        )}
        {showPublish && (
          <ReviewCharterFlightPrices
            showModal={showPublish}
            onClose={this.handleCloseReviewPrices}
            onPublished={this.handlePricesPublished}
            allRows={searchResult.data}
            currency={this.props.selectedCurrency}
          />
        )}

        {showEvaluate && (
          <EvaluateCharterFlightPrices
            showModal={showEvaluate}
            onClose={this.handleCloseEvaluatePrices}
            onPublished={this.handlePricesEvaluated}
            allRows={searchResult.data}
            currency={this.props.selectedCurrency}
          />
        )}
      </Flexbox>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCurrency: state.appState.selectedCurrency,
    access: state.appState.user.access
  };
};

const connected = connect(mapStateToProps)(CharterFlightOverview);
export { connected as CharterFlightOverview };
