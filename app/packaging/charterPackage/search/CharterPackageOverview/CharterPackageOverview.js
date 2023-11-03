import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../api';
import * as productTypesApi from '../../../../apis/productTypeApi';
import * as geographyApi from '../../../../components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';
import AgGridInfinite from '../../../../components/AgGrid/AgGridInfinite';
import getDefaultContextMenuItems from 'components/AgGrid/common/getDefaultContextMenuItems';
import { Flexbox } from '../../../../components/styled/Layout';
import { PrimaryButtonWithIcon } from '../../../../components/styled/Button';
import SearchPanel from '../../../components/SearchPanel';
import getColumnDefinitions from '../components/columnDefinitions';
import ReviewCharterPackagePrices from '../ReviewCharterPackagePrices';
import EvaluateCharterPackagePrices from '../EvaluateCharterPackagePrices';
import Spinner from '../../../../components/Spinner';
import launch from 'images/launch.png';
import CollapsableContainer from 'components/CollapsableContainer';
import { withRouter } from 'react-router';
import {
  createCriteriaItem,
  createValueItem,
  filterCriteriasBasedOnAccommodations,
  reorderCriteriaItems
} from 'components/FormFields/form-fields-utils';
import { processServiceWorkerMessage } from 'packaging/MessageHandlers/SWMessageHandlers';

class CharterPackageOverview extends Component {
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
      showPublish: false,
      showReview: false,
      searchPreview: null,
      publishedBlockedMessage: null,
      loading: false,
      publishButtonDisabled: false,
      evaluateButtonDisabled: false,
      criterias: null,
      selectedProductTypes: null
    };
  }

  async componentDidMount() {
    const sourceMarkets = await geographyApi.getSourceMarkets();
    const productTypes = await productTypesApi.getProductTypes();
    const generalCriteiras = await matchingCriteriaApi.get(['season', 'classification', 'roomcode']);
    const geographyCriterias = await Promise.all([
      geographyApi.getCountries(),
      geographyApi.getDestinations(),
      geographyApi.getAccommodations()
    ]);

    const criterias = [
      { key: 'sourcemarket', values: sourceMarkets.data },
      { key: 'producttype', values: productTypes.data },
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
      'producttype',
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
    const { producttype } = searchData;
    this.setState({ loading: true, selectedProductTypes: producttype });
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
            data: response.data.charterPackages
          },
          missingExchangeRatesCount: response.data.missingExchangeRatesCount,
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
    const result = [];
    const {
      numberOfAccommodationsMissingPackageRule,
      missingExchangeRatesCount,
      numberOfAccommodationsMissingBrandProductCombinationConfigurationRule
    } = data;

    let publishedBlockedMessage = null;
    this.setState({ evaluateButtonDisabled: false });

    if (numberOfAccommodationsMissingPackageRule > 0) {
      this.setState({ evaluateButtonDisabled: false });
      publishedBlockedMessage = `No margin applied on ${numberOfAccommodationsMissingPackageRule}  ${
        numberOfAccommodationsMissingPackageRule === 1 ? 'accommodation' : 'accommodations'
      }`;
    }
    if (numberOfAccommodationsMissingBrandProductCombinationConfigurationRule > 0) {
      this.setState({ evaluateButtonDisabled: true });
      publishedBlockedMessage = `No BrandProductCombination Configuration applied to ${numberOfAccommodationsMissingBrandProductCombinationConfigurationRule} ${
        numberOfAccommodationsMissingBrandProductCombinationConfigurationRule === 1 ? 'accommodation' : 'accommodations'
      }`;
    }
    let missingExchangeRatesMessage;
    if (missingExchangeRatesCount) {
      this.setState({ evaluateButtonDisabled: true });
      missingExchangeRatesMessage = `Missing exchange rates for ${missingExchangeRatesCount} accommodation product${
        missingExchangeRatesCount === 1 ? '' : 's'
      }`;
    }
    result[0] = publishedBlockedMessage;
    result[1] = missingExchangeRatesMessage;
    return result;
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
  handleSearchPreview = searchData => {
    api.searchPreview(searchData).then(response => {
      this.setState({
        searchPreview: response.data
      });
    });
  };

  handleRowSelectionChanged = event => {
    if (event.data.warnings.some(x => x.warningLevel === 'BlockViewAndPublish')) return;

    const customEvent = {
      ...event,
      data: {
        masterId: event.data.id,
        roomTypeId: event.data.roomTypeId,
        sourceMarketId: event.data.sourceMarketId,
        duration: this.state.duration,
        currency: this.props.selectedCurrency,
        productType: event.data.productType
      }
    };
    processServiceWorkerMessage(
      customEvent,
      this.externalWindowRef,
      this.clearSelection,
      '/packaging/charter-package/details'
    );
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

  showPublishButtons = () => {
    return Boolean(this.props.access.publishpackages.charterpackage.write && this.state.searchResult.data.length);
  };

  render() {
    const {
      searchResult,
      gridOptions,
      showPublish,
      showReview,
      loading,
      publishedBlockedMessage,
      missingExchangeRatesMessage,
      publishButtonDisabled,
      evaluateButtonDisabled,
      criterias,
      selectedProductTypes
    } = this.state;

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
        {this.showPublishButtons() && (
          <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <PrimaryButtonWithIcon onClick={this.handleReviewPrices} disabled={evaluateButtonDisabled}>
              <i className="material-icons">publish</i>
              Evaluate prices
            </PrimaryButtonWithIcon>
          </div>
        )}
        {this.showPublishButtons() && (
          <PrimaryButtonWithIcon onClick={this.handlePublishPrices} disabled={publishButtonDisabled}>
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
            title="Accommodation Product"
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
                overviewFilterKey={'charterPackageOverview'}
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
          agGridKey={`charterPackageOverview_${this.props.selectedCurrency}`}
          onRowSelected={this.handleRowSelectionChanged}
          clearSelection={clearSelectionFunc => (this.clearSelection = clearSelectionFunc)}
          getContextMenuItems={this.getContextMenuItems}
        />

        {showReview && (
          <EvaluateCharterPackagePrices
            showModal={showReview}
            onClose={this.handleCloseReviewPrice}
            allRows={searchResult.data}
            onPublished={this.handlePricesReviewed}
            productType={selectedProductTypes}
          />
        )}
        {showPublish && (
          <ReviewCharterPackagePrices
            showModal={showPublish}
            onClose={this.handleCloseReviewPrices}
            allRows={searchResult.data}
            onPublished={this.handlePricesPublished}
            productType={selectedProductTypes}
          />
        )}
      </Flexbox>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCurrency: state.appState.selectedCurrency,
    access: state.appState.user.access,
    resortsList: state.appState.resortsList
  };
};

const connected = withRouter(connect(mapStateToProps)(CharterPackageOverview));
export { connected as CharterPackageOverview };
