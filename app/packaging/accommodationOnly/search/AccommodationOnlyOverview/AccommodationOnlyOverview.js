import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../api';
import * as geographyApi from 'components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';
import SearchPanel from '../../../components/SearchPanel';
import getColumnDefinitions from '../components/columnDefinitions';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { Flexbox } from 'components/styled/Layout';
import { PrimaryButtonWithIcon } from 'components/styled/Button';
import ReviewAOPrices from '../ReviewAOPrices';
import EvaluateAOPrices from '../EvaluateAOPrices';
import Spinner from 'components/Spinner';
import launch from 'images/launch.png';
import CollapsableContainer from 'components/CollapsableContainer';
import {
  createCriteriaItem,
  createValueItem,
  filterCriteriasBasedOnAccommodations,
  reorderCriteriaItems
} from 'components/FormFields/form-fields-utils';

class AccommodationOnlyOverview extends Component {
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
      duration: 7,
      showPublish: false,
      showReview: false,
      externalWindow: null,
      missingExchangeRatesSeasons: null,
      loading: false,
      publishButtonDisabled: false,
      evaluateButtonDisabled: false,
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

    window.onbeforeunload = () => {
      this.sendDisconnectMessage();
    };
  }

  componentWillUnmount() {
    this.sendDisconnectMessage();
    window.onbeforeunload = null;
  }

  handleSearchClick = searchData => {
    this.setState({ loading: true });
    api
      .search(searchData)
      .then(response => {
        const updatedGridOptions = this.state.gridOptions;
        updatedGridOptions.context.currency.selected = this.props.selectedCurrency;

        const [publishedBlockedMessage, missingExchangeRatesMessage] = this.validateResponseForPublishing(
          response.data
        );

        this.setState({
          searchResult: {
            dataSetKey: uuidv4(),
            data: response.data.results
          },
          gridOptions: updatedGridOptions,
          latestFilters: searchData,
          publishedBlockedMessage,
          missingExchangeRatesMessage,
          publishButtonDisabled: publishedBlockedMessage || missingExchangeRatesMessage
        });
      })
      .finally(() => this.setState({ loading: false }));
  };

  validateResponseForPublishing = data => {
    const {
      numberOfAccommodationsMissingPackageRule,
      missingExchangeRatesSeasons,
      numberOfAccommodationsMissingBrandProductCombinationConfigurationRule
    } = data;
    this.setState({ evaluateButtonDisabled: false });
    let publishedBlockedMessage = null;
    if (numberOfAccommodationsMissingPackageRule > 0) {
      this.setState({ evaluateButtonDisabled: false });
      publishedBlockedMessage = `No margin applied ${numberOfAccommodationsMissingPackageRule} ${
        numberOfAccommodationsMissingPackageRule === 1 ? 'accommodation' : 'accommodations'
      }`;
    }
    if (numberOfAccommodationsMissingBrandProductCombinationConfigurationRule > 0) {
      this.setState({ evaluateButtonDisabled: true });
      publishedBlockedMessage = `No BrandProductCombination Configuration applied to ${numberOfAccommodationsMissingBrandProductCombinationConfigurationRule} ${
        numberOfAccommodationsMissingBrandProductCombinationConfigurationRule === 1 ? 'accommodation' : 'accommodations'
      }`;
    }
    let missingExchangeRatesMessage = null;
    if (missingExchangeRatesSeasons) {
      this.setState({ evaluateButtonDisabled: true });
      missingExchangeRatesMessage = `Missing exchange rates for seasons: ${missingExchangeRatesSeasons}`;
    }
    const result = [];
    result[0] = publishedBlockedMessage;
    result[1] = missingExchangeRatesMessage;
    return result;
  };

  handleSearchPreview = searchData => {
    api.searchPreview(searchData).then(response => {
      this.setState({
        searchPreview: response.data
      });
    });
  };

  sendDisconnectMessage = () => {
    this.postMessage({
      event: 'disconnect'
    });
  };

  handleRowSelectionChanged = event => {
    if (event.data.warnings.some(x => x.warningLevel === 'BlockViewAndPublish')) return;

    let win = this.state.externalWindow;

    const message = {
      event: event.node.selected ? 'add' : 'remove',
      data: event.data
    };

    if (win || message.event === 'remove') {
      this.postMessage(message);
    } else {
      win = window.open('/packaging/accommodation-only/detailed-pricing', '_blank');
      win.onload = () => {
        win.onServiceWorkerReady = () => {
          this.postMessage(message);
        };
      };

      win.onunload = event => {
        if (event.target.URL !== 'about:blank') {
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
              masterId: data.id,
              roomTypeId: data.roomTypeId,
              sourceMarketId: data.sourceMarketId,
              duration: this.state.duration,
              currency: this.props.selectedCurrency
            }
          : null
      });
    }
  };

  handleCloseReviewPrices = () => {
    this.setState({ showPublish: false });
  };
  handleCloseReviewPrice = () => {
    this.setState({ showReview: false });
  };

  handlePricesPublished = () => {
    this.handleCloseReviewPrices();
    this.handleSearchClick(this.state.latestFilters);
  };

  handlePricesReviewed = () => {
    this.handleCloseReviewPrice();
    this.handleSearchClick(this.state.latestFilters);
  };

  handlePublishPrices = () => {
    this.setState({ showPublish: true });
  };
  handleReviewPrices = () => {
    this.setState({ showReview: true });
  };

  getContextMenuItems(params) {
    return [
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
  }

  render() {
    const {
      searchResult,
      gridOptions,
      showPublish,
      showReview,
      loading,
      publishButtonDisabled,
      missingExchangeRatesMessage,
      publishedBlockedMessage,
      evaluateButtonDisabled,
      criterias
    } = this.state;

    const { access } = this.props;

    const collapsableContainerTitleChild = (
      <Flexbox marginLeft="auto">
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

        {access.publishpackages.accommodationonly.write && (
          <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <PrimaryButtonWithIcon disabled={evaluateButtonDisabled} onClick={this.handleReviewPrices}>
              <i className="material-icons">publish</i>
              Evaluate Prices
            </PrimaryButtonWithIcon>
          </div>
        )}
        {access.publishpackages.accommodationonly.write && (
          <PrimaryButtonWithIcon
            disabled={publishButtonDisabled}
            style={{ marginleft: '50px' }}
            onClick={this.handlePublishPrices}
          >
            <i className="material-icons">publish</i>
            Publish prices
          </PrimaryButtonWithIcon>
        )}
      </Flexbox>
    );

    return (
      <Flexbox direction={'column'} alignItems={'flex-start'} height="100%">
        <Spinner loading={loading} />
        <Flexbox justifyContent="space-between" width="100%" direction="column">
          <CollapsableContainer
            title="Accommodation Only"
            hideText="Hide search filters"
            showText="Show search filters"
            titleChildren={collapsableContainerTitleChild}
            localStorageKey="accommodation_only_collapsed_search_panel"
          >
            {criterias && criterias.length && (
              <SearchPanel
                onSearch={this.handleSearchClick}
                onSearchPreview={this.handleSearchPreview}
                searchPreview={this.state.searchPreview}
                criterias={criterias}
                overviewFilterKey={'accommodationOnlyOverview'}
              />
            )}
          </CollapsableContainer>
        </Flexbox>

        <AgGridInfinite
          gridHeight={'100%'}
          dataSet={searchResult}
          columnDefinitions={getColumnDefinitions({
            currency: this.props.selectedCurrency
          })}
          gridOptions={gridOptions}
          agGridKey={`accommodationOnlyOverview-${this.props.selectedCurrency}`}
          onRowSelected={this.handleRowSelectionChanged}
          clearSelection={clearSelectionFunc => (this.clearSelection = clearSelectionFunc)}
          getContextMenuItems={this.getContextMenuItems}
        />
        <div marginRight="8px">
          {showReview && (
            <EvaluateAOPrices
              showModal={showReview}
              onClose={this.handleCloseReviewPrice}
              allRows={searchResult.data}
              onPublished={this.handlePricesReviewed}
            />
          )}
        </div>
        <div marginRight="16px">
          {showPublish && (
            <ReviewAOPrices
              showModal={showPublish}
              onClose={this.handleCloseReviewPrices}
              allRows={searchResult.data}
              onPublished={this.handlePricesPublished}
            />
          )}
        </div>
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

const connected = connect(mapStateToProps)(AccommodationOnlyOverview);
export { connected as AccommodationOnlyOverview };
