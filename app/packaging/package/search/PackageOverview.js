import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as api from './api';
import * as geographyApi from '../../../components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../apis/matchingCriteriasApi';
import AgGridInfinite from '../../../components/AgGrid/AgGridInfinite';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { Flexbox } from '../../../components/styled/Layout';
import SearchPanel from '../../components/SearchPanel';
import getColumnDefinitions from './components/columnDefinitions';
import Spinner from '../../../components/Spinner';
import launch from 'images/launch.png';
import CollapsableContainer from 'components/CollapsableContainer';
import { withRouter } from 'react-router';
import { processServiceWorkerMessage } from 'packaging/MessageHandlers/SWMessageHandlers';
import {
  createCriteriaItem,
  createValueItem,
  filterCriteriasBasedOnAccommodations,
  reorderCriteriaItems
} from 'components/FormFields/form-fields-utils';

class PackageOverview extends Component {
  externalWindowRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedDatasets: null,
      latestFilters: {},
      gridOptions: {
        context: {
          currency: { selected: this.props.selectedCurrency }
        },
        getRowClass: params => {
          if (!params.data) {
            return null;
          }
          if (params.data.hasUnpublishedChanges) return 'unpublished-row';
        }
      },
      searchResult: { dataSetKey: null, data: [] },
      missingExchangeRatesDates: null,
      duration: 7,
      searchPreview: null,
      loading: false,
      resortSearchInfo: { countryName: '', destination: '', sourceMarket: '' },
      sourceMarketId: null,
      countryId: null,
      destinationId: null,
      planningPeriodId: null,
      airportcode: null,
      criterias: null
    };
  }

  async componentDidMount() {
    const sourceMarkets = await geographyApi.getSourceMarkets();
    const generalCriteiras = await matchingCriteriaApi.get(['season', 'classification', 'roomcode']);
    const geographyCriterias = await Promise.all([
      geographyApi.getCountries(),
      geographyApi.getDestinations(),
      geographyApi.getAccommodations()
    ]);

    const criterias = [
      { key: 'sourcemarket', values: sourceMarkets.data },
      ...generalCriteiras.data.map(item => ({ key: item.key, values: item.values })),
      { key: 'country', values: geographyCriterias[0].data },
      { key: 'destination', values: geographyCriterias[1].data },
      { key: 'accommodationcode', values: geographyCriterias[2].data }
    ];

    filterCriteriasBasedOnAccommodations(criterias);

    const mappedCriterias = criterias.map(mc => {
      const key = mc.key;
      const values = mc.values.map(val => createValueItem(val.id, val.name, val.code, val.parentId ?? val.parentIds));

      return createCriteriaItem(key, values);
    });

    // Check if Destination exists in criteria, if exists, then get the criteria index
    const destIdx = mappedCriterias.findIndex(criteria => criteria.criteriaKey === 'destination');
    if (destIdx > -1) {
      // Add placeholder value for the Resort, since it's a paginated filter.
      mappedCriterias.push(createCriteriaItem('resort', []));
    }

    const reorderedCriterias = reorderCriteriaItems(mappedCriterias, [
      'season',
      'sourcemarket',
      'country',
      'destination',
      'resort',
      'accommodationcode',
      'classification',
      'roomcode'
    ]);

    this.setState({
      criterias: reorderedCriterias
    });
  }

  handleSearchClick = searchData => {
    this.setState({ loading: true });
    api
      .search(searchData)
      .then(response => {
        const updatedGridOptions = this.state.gridOptions;
        updatedGridOptions.context.currency.selected = this.props.selectedCurrency;

        const [missingExchangeRatesMessage] = this.validateResponseForPublishing(response.data);
        this.setState({
          searchResult: {
            dataSetKey: uuidv4(),
            data: response.data.charterPackages
          },
          missingExchangeRatesDates: response.data.missingExchangeRatesDates,
          gridOptions: updatedGridOptions,
          latestFilters: searchData,
          missingExchangeRatesMessage,
          planningPeriodId: response.data.seasonId
        });
      })
      .finally(() => this.setState({ loading: false }));
  };

  validateResponseForPublishing = data => {
    const result = [];
    const { missingExchangeRatesDates } = data;

    let missingExchangeRatesMessage = null;
    if (missingExchangeRatesDates) {
      missingExchangeRatesMessage = `Missing exchange rates for period : Contract Start Date - Contract End Date`;
    }
    result[0] = missingExchangeRatesMessage;
    return result;
  };

  handleSearchPreview = searchData => {
    api.searchPreview(searchData).then(response => {
      this.setState({
        searchPreview: response.data
      });
    });
  };

  handleRowSelectionChanged = event => {
    if (event.data.warnings.some(x => x.warningLevel === 'BlockViewAndPublish')) return;
    if (
      this.state.resortSearchInfo.countryName === '' ||
      this.state.resortSearchInfo.destination === '' ||
      this.state.resortSearchInfo.sourceMarket === ''
    ) {
      this.setState({
        resortSearchInfo: {
          countryName: event.data.country,
          destination: event.data.destination,
          sourceMarket: event.data.sourceMarket
        },
        sourceMarketId: event.data.sourceMarketId,
        countryId: event.data.countryId,
        destinationId: event.data.destinationId,
        planningPeriodId: event.data.seasonId,
        airportcode: event.data.airportCode
      });
    } else if (
      (this.state.resortSearchInfo.countryName !== event.data.country) |
      (this.state.resortSearchInfo.destination !== event.data.destination) |
      (this.state.resortSearchInfo.sourceMarket !== event.data.sourceMarket)
    ) {
      if (this.externalWindowRef.current === null) {
        event.node.setSelected(true);
        this.resetResortSearchInfo();
      } else {
        event.node.setSelected(false);
        return;
      }
    }
    const customEvent = {
      ...event,
      data: {
        masterId: event.data.id,
        roomTypeId: event.data.roomTypeId,
        country: event.data.country,
        sourceMarket: event.data.sourceMarket,
        destination: event.data.destination,
        sourceMarketId: event.data.sourceMarketId,
        duration: this.state.duration,
        currency: this.props.selectedCurrency,
        destinationId: event.data.destinationId,
        countryId: event.data.countryId,
        planningPeriodId: event.data.seasonId,
        airportcode: event.data.airportCode
      }
    };
    processServiceWorkerMessage(customEvent, this.externalWindowRef, this.clearSelection, '/packaging/package/details');
  };
  resetResortSearchInfo = () => {
    this.setState({
      resortSearchInfo: {
        countryName: '',
        destination: '',
        sourceMarket: ''
      }
    });
  };

  getContextMenuItems(params) {
    var result = [
      {
        name: 'View contract',
        icon: `<img class="ag-icon" style="width: 13px; height: 13px;" src=${launch} />`,
        action: function () {
          window.open(`/cost/accommodation/details/${params.node.data.id}`, '_blank');
        }
      },
      'separator',
      ...getDefaultContextMenuItems(params)
    ];
    return result;
  }

  render() {
    const {
      searchResult,
      gridOptions,
      loading,
      missingExchangeRatesMessage,
      criterias
    } = this.state;

    const collapsableContainerTitleChild = (
      <Flexbox marginLeft="auto">
        <div>
          {missingExchangeRatesMessage && (
            <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
              <i className="material-icons" style={{ fontSize: 18, marginRight: 8, color: 'rgb(237, 201, 0)' }}>
                warning
              </i>
              {missingExchangeRatesMessage}
            </div>
          )}
        </div>
      </Flexbox>
    );

    return (
      <Flexbox direction={'column'} alignItems={'flex-start'} height="100%">
        <Spinner loading={loading} />
        <Flexbox justifyContent="space-between" width="100%" direction="column">
          <CollapsableContainer
            title="Package"
            hideText="Hide search filters"
            showText="Show search filters"
            titleChildren={collapsableContainerTitleChild}
            localStorageKey="charter_package_collapsed_search_panel"
          >
            {criterias && criterias.length && (
              <SearchPanel
                onSearch={this.handleSearchClick}
                onSearchPreview={this.handleSearchPreview}
                searchPreview={this.state.searchPreview}
                criterias={criterias}
                overviewFilterKey={'PackageOverview'}
              />
            )}
          </CollapsableContainer>
        </Flexbox>

        <AgGridInfinite
          gridHeight="100%"
          dataSet={searchResult}
          columnDefinitions={getColumnDefinitions({
            currency: this.props.selectedCurrency
          })}
          gridOptions={gridOptions}
          agGridKey={`packageOverview_${this.props.selectedCurrency}`}
          onRowSelected={this.handleRowSelectionChanged}
          clearSelection={clearSelectionFunc => (this.clearSelection = clearSelectionFunc)}
          getContextMenuItems={this.getContextMenuItems}
        />
      </Flexbox>
    );
  }
}

const mapStateToProps = state => {
  return {
    resortsList: state.appState.resortsList,
    selectedCurrency: state.appState.selectedCurrency,
    access: state.appState.user.access,
    resortSearchInfo: state.resortSearchInfo
  };
};

const connected = withRouter(connect(mapStateToProps)(PackageOverview));
export { connected as PackageOverview };
