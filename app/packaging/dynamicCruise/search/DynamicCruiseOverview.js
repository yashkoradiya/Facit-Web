import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as api from './api';
import * as sourceMarketApi from 'apis/sourceMarketsApi';
import * as matchingCriteriaApi from 'apis/matchingCriteriasApi';
import CruiseSearchPanel from './CruiseSearchPanel';
import getColumnDefinitions from './columnDefinitions';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import { Flexbox } from 'components/styled/Layout';
import { PrimaryButtonWithIcon } from 'components/styled/Button';
import ReviewDynamicCruisePrices from './ReviewDynamicCruisePrices';
import Spinner from '../../../components/Spinner';
import CollapsableContainer from 'components/CollapsableContainer';

class DynamicCruiseOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDatasets: null,
      searchData: {
        page: 1,
        fromDate: null,
        toDate: null
      },
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
      sourceMarkets: [],
      seasons: [],
      cruises: [],
      cruiseLines: [],
      cruiseRegions: [],
      selectedCruises: { key: null, cruises: [] },
      showPublish: false,
      externalWindow: null,
      loading: false
    };
  }

  componentDidMount() {
    const apiCalls = [sourceMarketApi.getSourceMarkets(), matchingCriteriaApi.get(['season']), api.getCruiseFilters()];
    Promise.all(apiCalls).then(response => {
      this.setState({
        sourceMarkets: response[0].data,
        seasons: response[1].data.find(x => x.key === 'season').values,
        cruises: response[2].data.cruises,
        cruiseLines: response[2].data.cruiseLines,
        cruiseRegions: response[2].data.cruiseRegions
      });
    });
  }

  handleSearchClick = searchData => {
    this.setState({ loading: true });
    api
      .search(searchData)
      .then(response => {
        const updatedGridOptions = this.state.gridOptions;
        updatedGridOptions.context.currency.selected = this.props.selectedCurrency;
        this.setState({
          searchResult: {
            dataSetKey: uuidv4(),
            data: response.data.results
          },
          gridOptions: updatedGridOptions
        });
      })
      .finally(() => this.setState({ loading: false }));
  };

  handleSearchPreview = searchData => {
    api.searchPreview(searchData).then(response => {
      this.setState({
        searchPreview: response.data
      });
    });
  };

  handleCloseReviewPrices = () => {
    this.setState({ showPublish: false });
  };

  handlePublishPrices = () => {
    this.setState({ showPublish: true });
  };

  render() {
    const {
      searchResult,
      sourceMarkets,
      seasons,
      gridOptions,
      showPublish,
      cruises,
      cruiseLines,
      cruiseRegions,
      loading
    } = this.state;

    const { access } = this.props;
    const collapsableContainerTitleChild = (
      <Flexbox marginLeft="auto">
          {access.publishpackages.dynamiccruise.write && (
          <PrimaryButtonWithIcon onClick={this.handlePublishPrices}>
            <i className="material-icons">publish</i>
            Publish prices
          </PrimaryButtonWithIcon>
        )}
      </Flexbox>
    );

    return (
      <Flexbox direction={'column'} alignItems={'flex-start'} height="100%">
        <Spinner loading={loading} />
        <Flexbox justifyContent="space-between" alignItems="flex-start" width="100%" direction="column">
          <CollapsableContainer
            title="Dynamic Cruise"
            hideText="Hide search filters"
            showText="Show search filters"
            titleChildren={collapsableContainerTitleChild}
            localStorageKey="dynamic_cruise_collapsed_search_panel"
          >
            {sourceMarkets.length > 0 && (
              <CruiseSearchPanel
                onSearch={this.handleSearchClick}
                onSearchPreview={this.handleSearchPreview}
                searchPreview={this.state.searchPreview}
                sourceMarkets={sourceMarkets}
                seasons={seasons}
                cruises={cruises}
                cruiseLines={cruiseLines}
                cruiseRegions={cruiseRegions}
              />
            )}
          </CollapsableContainer>
        </Flexbox>

        <AgGridInfinite
          gridHeight="100%"
          dataSet={searchResult}
          columnDefinitions={getColumnDefinitions()}
          gridOptions={gridOptions}
          agGridKey={'dynamicCruiseOverview'}
          clearSelection={clearSelectionFunc => (this.clearSelection = clearSelectionFunc)}
        />
        {showPublish && (
          <ReviewDynamicCruisePrices
            showModal={showPublish}
            onClose={this.handleCloseReviewPrices}
            allRows={searchResult.data}
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

const connected = connect(mapStateToProps)(DynamicCruiseOverview);
export { connected as DynamicCruiseOverview };
