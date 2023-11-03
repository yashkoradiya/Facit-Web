import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map, fromJS } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import * as localStorage from '../../core/localStorage';
import { Flexbox, PageHeader } from '../../components/styled/Layout';
import FilteredSearchBoxes, {
  createCriteriaItem,
  createValueItem
} from '../../components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { Button, PrimaryButton } from '../../components/styled/Button';
import * as sourceMarketApi from '../../apis/sourceMarketsApi';
import * as rulesApi from '../../apis/rulesApi';
import * as matchingCriteriasApi from '../../apis/matchingCriteriasApi';
import AgGridInfinite from '../../components/AgGrid/AgGridInfinite';
import { getColumnDefinition } from './columnDefinitions';
import PhasedAccommodationsModal from './PhasedAccommodationsModal';
import { filterCriteriasBasedOnAccommodations } from 'components/FormFields/form-fields-utils';

class PhasingReferenceOverview extends Component {
  localStorageFiltersKey = 'phasingReferenceOverview_filters';

  constructor(props) {
    super(props);

    this.state = {
      allItems: null,
      filteredItems: [],
      selectedFilters: List(),
      searchResult: { dataSetKey: null, data: [] },
      showPhasedAccommodationsModal: false,
      phasedAccommodations: []
    };
  }

  componentDidMount() {
    this.updateStateFromLocalStorage();
    this.initializeFilters().then(data => {
      this.setState({ ...data });
    });
  }

  initializeFilters = () => {
    const promises = [
      matchingCriteriasApi.get([
        'season',
        'country',
        'destination',
        'classification',
        'concept',
        'label',
        'accommodationcode'
      ]),
      sourceMarketApi.getSourceMarkets()
    ];

    return Promise.all(promises).then(responses => {
      const data = {
        criterias: responses[0].data,
        sourceMarkets: responses[1].data
      };
      // Filter classification values based on available accommodations.
      filterCriteriasBasedOnAccommodations(data.criterias);
      let allItems = [];
      data.criterias.forEach(mc => {
        const criteriaKey = mc.key;
        const values = mc.values.map(value => {
          return createValueItem(value.id, value.name, value.code, value.parentId);
        });

        const item = createCriteriaItem(criteriaKey, values);
        allItems.push(item);

        // If the current criteriakey equals 'destination', then add a placeholder item for 'Resorts'
        if (criteriaKey === 'destination') {
          allItems.push(createCriteriaItem('resort', []));
        }
      });

      const sourceMarketKey = 'sourcemarket';
      const sourceMarketValues = data.sourceMarkets.map(sm => {
        return createValueItem(sm.id, sm.name, null, null);
      });
      const sourceMarketItem = createCriteriaItem(sourceMarketKey, sourceMarketValues);
      allItems.push(sourceMarketItem);
      return {
        allItems,
        filteredItems: allItems
      };
    });
  };

  updateStateFromLocalStorage = () => {
    const savedFilters = localStorage.getItem(this.localStorageFiltersKey);
    if (savedFilters) {
      const { selectedFilters } = savedFilters;

      this.setState(
        {
          selectedFilters: fromJS(selectedFilters)
        },
        () => this.handleSearch()
      );
    } else {
      this.handleSearch();
    }
  };

  saveStateToLocalStorage = () => {
    const { selectedFilters } = this.state;
    localStorage.setItem(this.localStorageFiltersKey, {
      selectedFilters
    });
  };

  createPhasingTemplate = createUrl => {
    this.props.history.push(createUrl);
  };

  handleFilterChange = (selectedItemIds, filteredItems) => {
    this.setState(
      {
        selectedFilters: selectedItemIds,
        filteredItems: filteredItems
      },
      () => {
        this.handleSearch();
        this.saveStateToLocalStorage();
      }
    );
  };

  handleSearch = () => {
    const { selectedFilters } = this.state;

    const fomattedFilters = selectedFilters
      .filter(x => x.get('criteriaKey') !== 'sourcemarket')
      .map(x => {
        return {
          key: x.get('criteriaKey'),
          values: x.get('values').toArray()
        };
      })
      .toArray()
      .filter(m => m.values.length);

    const selectedSourceMarkets = selectedFilters.find(x => x.get('criteriaKey') === 'sourcemarket');
    let sourceMarkets = List();
    if (selectedSourceMarkets) {
      sourceMarkets = sourceMarkets.push(
        Map({
          key: 'sourcemarket',
          values: selectedSourceMarkets.get('values')
        })
      );
    }

    const promises = [
      rulesApi.search('', ['phasing_reference'], fomattedFilters, [], sourceMarkets.getIn([0, 'values']))
    ];

    Promise.all(promises).then(responses => {
      const data = {
        data: responses[0].data.results,
        dataSetKey: uuidv4()
      };

      this.setState({ searchResult: data });
    });
  };

  handleClearFilters = () => {
    this.setState(
      {
        selectedFilters: List(),
        filteredItems: this.state.allItems
      },
      () => {
        this.handleSearch();
        this.saveStateToLocalStorage();
      }
    );
  };

  showPhasedAccommodationsModal = id => {
    rulesApi.getAssignedAccommodations(id).then(response => {
      this.setState({
        phasedAccommodations: response.data,
        showPhasedAccommodationsModal: true
      });
    });
  };

  togglePhasedAccommodationsModal = () => {
    const { showPhasedAccommodationsModal } = this.state;
    this.setState({ showPhasedAccommodationsModal: !showPhasedAccommodationsModal });
  };

  componentDidUpdate() {
    const { resortsList } = this.props;
    const { allItems } = this.state;
    const resortOptionsIdx = allItems?.findIndex(item => item.criteriaKey === 'resort');

    if (resortsList.length && resortOptionsIdx >= 0 && allItems[resortOptionsIdx]?.values.size !== resortsList.length) {
      const valueItems = resortsList.map(item =>
        createValueItem(
          item.id,
          item.name,
          item.code,
          item.parentIds,
          item.sourceMarketIds,
          item.parentCountryIds,
          item.parentDestinationIds
        )
      );

      allItems.splice(resortOptionsIdx, 1, createCriteriaItem('resort', valueItems));
      this.setState({ allItems });
    }
  }

  render() {
    const {
      allItems,
      filteredItems,
      selectedFilters,
      searchResult,
      showPhasedAccommodationsModal,
      phasedAccommodations
    } = this.state;

    if (!allItems) {
      return null;
    }
    return (
      <div>
        <Flexbox marginBottom="10px">
          <PageHeader>Phasing Reference Overview</PageHeader>
        </Flexbox>
        <Flexbox alignItems="flex-start" justifyContent="space-between">
          <Flexbox marginBottom="20px" marginRight="8px" width="1100px" alignItems="flex-end" wrap="wrap">
            <FilteredSearchBoxes
              key={`FilteredSearchBoxes_${allItems.map(x => x.id).join('_')}`}
              items={allItems}
              filteredItems={filteredItems}
              selectedItemIds={selectedFilters}
              onChange={this.handleFilterChange}
            />
            <Button onClick={this.handleClearFilters}>Clear filters</Button>
          </Flexbox>
          {this.props.access.phasing.templates.write && (
            <PrimaryButton
              onClick={() => this.createPhasingTemplate('/cost/rules/templates/create/phasing')}
              style={{ marginTop: '18px' }}
            >
              New phasing template
            </PrimaryButton>
          )}
        </Flexbox>

        <AgGridInfinite
          columnDefinitions={getColumnDefinition({
            handlePhasedAccommodationsClick: this.showPhasedAccommodationsModal
          })}
          dataSet={searchResult}
          agGridKey={'phasing_reference_overview'}
        />

        <PhasedAccommodationsModal
          show={showPhasedAccommodationsModal}
          onRequestClose={this.togglePhasedAccommodationsModal}
          phasedAccommodations={phasedAccommodations}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    access: state.appState.user.access,
    resortsList: state.appState.resortsList
  };
}

export default connect(mapStateToProps)(PhasingReferenceOverview);
