import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS, List, Map } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import { DebounceInput } from 'react-debounce-input';
import * as localStorage from '../../../core/localStorage';
import MiscCost from '../miscCost';
import VAT from '../VAT';
import DistributionCost from '../DistributionCost';
import Accommodation from '../accommodation';
import DynamicCruise from '../dynamicCruise';
import Flight from '../Flight';
import CharterPackage from '../CharterPackage';
import * as api from '../../../apis/rulesApi';
import * as matchingCriteriasApi from '../../../apis/matchingCriteriasApi';
import FilteredSearchBoxes, {
  createCriteriaItem
} from '../../../components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { createValueItem, parsePaginatedResortCriteria } from '../../../components/FormFields/form-fields-utils';
import { Tabs, Tab, TabContent, TabText } from '../../../components/styled/Tabs';
import { Button } from '../../../components/styled/Button';
import { Input, InputLabel, InputBox } from '../../../components/styled/Input';
import { Flexbox, PageHeader } from '../../../components/styled/Layout';
import { Content } from '../../../components/styled/Content';
import { ruleTabs, ruleTypes as ruleTypeConstants, getRuleTypeDisplayName } from '../ruleConstants';
import * as sourceMarketApi from '../../../apis/sourceMarketsApi';
import RoomUpgrade from '../RoomUpgrade';
import Spinner from 'components/Spinner';
import BulkAdjustment from '../BulkAdjustment';
import MinMax from '../MinMax';
import settings from '../../../core/settings/settings';
import { getFlighProductTypes } from 'packaging/packaging-utils';
import Transfers from '../Transfers';

const getTabs = access => [
  {
    label: 'Accommodation',
    key: ruleTabs.accommodation,
    visible:
      access.componenttemplates.accommodationcomponents.read ||
      access.packagetemplates.accommodationonly.read ||
      access.componenttemplates.underoccupancy.read ||
      access.componenttemplates.overoccupancy.read ||
      access.componenttemplates.boardupgrade.read ||
      access.componenttemplates.mandatorysupplement.read ||
      access.componenttemplates.ancillary.read
  },
  {
    label: 'Room upgrade',
    key: ruleTabs.roomUpgrade,
    visible: access.componenttemplates.roomupgrade.read
  },
  { label: 'Flight', key: ruleTabs.flight, visible: access.componenttemplates.flightsupplements.read },
  { label: 'Transfers', key: ruleTabs.transfers, visible: access.componenttemplates.transfermargincomponent.read },
  {
    label: 'Durational Accom',
    key: ruleTabs.charterPackage,
    visible: access.packagetemplates.charterpackage.read
  },
  {
    label: 'Dynamic cruise',
    key: ruleTabs.dynamicCruise,
    visible: access.componenttemplates.dynamiccruise.read
  },
  {
    label: 'Misc cost',
    key: ruleTabs.miscellaneousCost,
    visible:
      access.componenttemplates.misccost.read ||
      access.componenttemplates.guaranteefundaccom.read ||
      access.componenttemplates.guaranteefundflight.read
  },
  {
    label: 'Distribution cost',
    key: ruleTabs.distributionCost,
    visible:
      access.componenttemplates.distributioncost.read ||
      access.componenttemplates.flightdistributioncost.read ||
      access.componenttemplates.transferdistributioncost.read
  },
  {
    label: 'VAT',
    key: ruleTabs.vat,
    visible:
      access.componenttemplates.vat.read ||
      access.componenttemplates.flightvat.read ||
      access.componenttemplates.transfervat.read ||
      access.componenttemplates.reversecharge.write
  },
  {
    label: 'Bulk adjustment',
    key: ruleTabs.bulkAdjustment,
    visible: access.packagetemplates.bulkadjustment.read
  },
  {
    label: 'Min/Max Margin',
    key: ruleTabs.minMax,
    visible: access.packagetemplates.minmax.read
  }
];

class RulesOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleTypes: {
        [ruleTabs.miscellaneousCost]: [
          'miscellaneous_cost',
          'guaranteefund_accom_misccostcomponent',
          'guaranteefund_flight_misccostcomponent'
        ],
        [ruleTabs.distributionCost]: [
          'distribution_cost',
          'charter_flight_distcostcomponent',
          ruleTypeConstants.transferDistributionCost
        ],
        [ruleTabs.accommodation]: [
          'accommodation_only',
          'accommodation_component',
          'under_occupancy',
          'over_occupancy',
          'board_upgrade',
          'mandatory_supplement',
          'ancillary'
        ],
        [ruleTabs.dynamicCruise]: ['dynamic_cruise'],
        [ruleTabs.vat]: ['vat', 'charter_flight_vat', ruleTypeConstants.transferVat, ruleTypeConstants.accomReverse],
        [ruleTabs.flight]: ['charter_flight_component'],
        [ruleTabs.transfers]: [ruleTypeConstants.transferMarginComponent],
        [ruleTabs.charterPackage]: ['charter_package'],
        [ruleTabs.roomUpgrade]: [ruleTypeConstants.roomUpgrade],
        [ruleTabs.bulkAdjustment]: [ruleTypeConstants.bulkAdjustment],
        [ruleTabs.minMax]: [ruleTypeConstants.minMax]
      },
      currentTab: 'undefined_tab',
      data: this.resetData(),
      initialData: this.resetData(),
      searchPreview: {
        [ruleTabs.miscellaneousCost]: 0,
        [ruleTabs.distributionCost]: 0,
        [ruleTabs.accommodation]: 0,
        [ruleTabs.dynamicCruise]: 0,
        [ruleTabs.vat]: 0,
        [ruleTabs.flight]: 0,
        [ruleTabs.transfers]: 0,
        [ruleTabs.charterPackage]: 0,
        [ruleTabs.roomUpgrade]: 0,
        [ruleTabs.bulkAdjustment]: 0,
        [ruleTabs.minMax]: 0
      },
      allItems: [],
      filteredItems: [],
      selectedPrimaryFilters: List(),
      selectedSecondaryFilters: List(),
      selectedProperties: List(),
      selectedSourceMarkets: List(),
      selectedRuleTypes: List(),
      searchText: '',
      resetFiltersKey: uuidv4(),
      resetTabsKey: uuidv4(),
      localStorageFiltersKey: 'rulesOverview_filters',
      visibleTabs: []
    };

    this.latestTabKey = 'rulesOverview_latestTab';
  }

  getCurrentTab = (latestTab, visibleTabs) => {
    if (this.props.match.params.id) {
      return this.props.match.params.id;
    } else if (latestTab) {
      return latestTab.tabName;
    } else {
      return visibleTabs[0].key;
    }
  };

  componentDidMount() {
    const latestTab = localStorage.getItem(this.latestTabKey);
    const visibleTabs = getTabs(this.props.access).filter(t => t.visible);

    const currentTab = this.getCurrentTab(latestTab, visibleTabs);

    this.initializeFilters().then(data => {
      this.setState({ ...data, currentTab, visibleTabs }, this.updateStateFromLocalStorage);
    });
  }

  componentDidUpdate() {
    const { resortsList } = this.props;
    const { allItems } = this.state;
    const newAllItems = parsePaginatedResortCriteria(resortsList, allItems);
    if (newAllItems) {
      this.setState({ allItems: newAllItems });
    }
  }

  updateStateFromLocalStorage = () => {
    let savedPrimaryFilters = localStorage.getItem(this.state.localStorageFiltersKey);
    let savedTabFilters = localStorage.getItem(`${this.state.localStorageFiltersKey}_${this.state.currentTab}`);
    let selectedPrimaryFilters = List();
    if (savedPrimaryFilters) {
      selectedPrimaryFilters = fromJS(savedPrimaryFilters.selectedPrimaryFilters);
    }

    let selectedSecondaryFilters = List();
    let selectedProperties = List();
    let selectedRuleTypes = List();
    let selectedSourceMarkets = List();
    if (savedTabFilters) {
      selectedSecondaryFilters = savedTabFilters.selectedSecondaryFilters
        ? fromJS(savedTabFilters.selectedSecondaryFilters.filter(x => x.criteriaKey !== 'sourcemarket')) // TODO: remove filter of sourcemarket. Only to trigger removal from local storage.
        : List();
      selectedProperties = savedTabFilters.selectedProperties ? fromJS(savedTabFilters.selectedProperties) : List();
      selectedRuleTypes = savedTabFilters.selectedRuleTypes ? fromJS(savedTabFilters.selectedRuleTypes) : List();
      selectedSourceMarkets = savedTabFilters.selectedSourceMarkets
        ? fromJS(savedTabFilters.selectedSourceMarkets)
        : List();
    }
    this.setState(
      {
        selectedPrimaryFilters,
        selectedSecondaryFilters,
        selectedProperties,
        selectedRuleTypes,
        selectedSourceMarkets,
        resetFiltersKey: uuidv4()
      },
      () => this.handleSearch()
    );
  };

  initializeFilters = () => {
    const promises = [
      matchingCriteriasApi.get([
        'producttype',
        'season',
        'country',
        'destination',
        'accommodation',
        'classification',
        'concept',
        'label',
        'cruiseline',
        'cruiseregion',
        'destinationairport',
        'roomtypecategory',
        'contractlevel',
        'departureairport',
        'airline',
        'weekday',
        'accommodationcode',
        'area',
        'airport',
        'transfer_type',
        'value_type',
        'transfer_direction'
      ]),
      api.getSelectableItems('miscellaneous_cost'),
      api.getSelectableItems('bulk_adjustment'),
      sourceMarketApi.getSourceMarkets(),
      api.getSelectableItems('distribution_cost'),
      api.getSelectableItems('accom_vat'),
      api.getSelectableItems('vat'),
      api.getSelectableItems('flight_margin_overview'),
      matchingCriteriasApi.getCommissionMarker()
    ];

    return Promise.all(promises).then(responses => {
      const data = {
        criterias: responses[0].data,
        costLabels: responses[1].data.properties.filter(item => item.key === 'cost_label'),
        packageTypes: responses[2].data.properties.filter(item => item.key === 'package_type'),
        sourceMarkets: responses[3].data,
        productTypes: responses[4].data.properties.filter(item => item.key === 'product_type_for_distcost'),
        productTypesVat: responses[5].data.properties.filter(item => item.key === 'product_type_for_vat'),
        flightMarginOverview: responses[7].data.properties.filter(item => item.key === 'flight_template_type')
      };

      if (responses[8].data.length) {
        data.criterias.push(responses[8].data[0]);
      }

      const allItems = [];
      const productTypeKey = 'producttype';
      const productTypeObj = data.criterias.find(item => item.key === productTypeKey);
      if (productTypeObj) {
        const productTypeValues = productTypeObj.values.map(item => createValueItem(item.id, item.name, null, null));
        allItems.push(createCriteriaItem(productTypeKey, productTypeValues));
      }

      if (data.sourceMarkets.length) {
        const sourceMarketKey = 'sourcemarket';
        const sourceMarketValues = data.sourceMarkets.map(sm => {
          return createValueItem(sm.id, sm.name, null, null);
        });
        allItems.push(createCriteriaItem(sourceMarketKey, sourceMarketValues));
      }

      data.criterias
        .filter(item => item.key !== productTypeKey)
        .forEach(mc => {
          const criteriaKey = mc.key;
          const values = mc.values.map(value => {
            if (settings.IS_MULTITENANT_ENABLED) {
              return createValueItem(
                value.id,
                value.name,
                value.code,
                value.parentIds,
                value.sourceMarketIds,
                value.parentCountryIds,
                value.parentDestinationIds
              );
            } else {
              return createValueItem(
                value.id,
                value.name,
                value.code,
                value.parentId,
                value.sourceMarketIds,
                value.parentCountryIds,
                value.parentDestinationIds
              );
            }
          });

          const item = createCriteriaItem(criteriaKey, values);
          allItems.push(item);

          // If the current criteriakey equals 'destination', then add a placeholder item for 'Resorts'
          if (criteriaKey === 'destination') {
            allItems.push(createCriteriaItem('resort', []));
          }
        });

      data.costLabels.forEach(mc => {
        const criteriaKey = 'cost_label';
        const values = mc.values.map(value => {
          return createValueItem(value.value, value.displayName, null, null);
        });

        const item = createCriteriaItem(criteriaKey, values);
        allItems.push(item);
      });

      data.packageTypes.forEach(packType => {
        const values = packType.values.map(ptv => {
          return createValueItem(ptv.value, ptv.displayName, null, null);
        });
        const item = createCriteriaItem(packType.key, values);
        allItems.push(item);
      });
      data.productTypes.forEach(prodType => {
        const values = prodType.values.map(ptv => {
          return createValueItem(ptv.value, ptv.displayName, null, null);
        });
        const item = createCriteriaItem(prodType.key, values);
        allItems.push(item);
      });

      data.productTypesVat.forEach(pt => {
        const values = pt.values.map(ptv => {
          return createValueItem(ptv.value, ptv.displayName, null, null);
        });
        const item = createCriteriaItem(pt.key, values);
        allItems.push(item);
      });

      data.flightMarginOverview.forEach(pt => {
        const values = pt.templateTypes.map(ptv => {
          return createValueItem(ptv.value, ptv.displayName, null, null);
        });
        const item = createCriteriaItem(pt.key, values);
        allItems.push(item);
      });

      const ruleTypes = {
        criteriaKey: 'rule_type',
        title: 'Rule type',
        values: List(
          this.state.ruleTypes[ruleTabs.accommodation].map(x =>
            createValueItem(x, getRuleTypeDisplayName(x), null, null)
          )
        )
      };

      allItems.push(ruleTypes);
      return {
        allItems,
        filteredItems: allItems
      };
    });
  };

  resetData = () => {
    return {
      [ruleTabs.miscellaneousCost]: { data: [], dataSetKey: '' },
      [ruleTabs.distributionCost]: { data: [], dataSetKey: '' },
      [ruleTabs.accommodation]: { data: [], dataSetKey: '' },
      [ruleTabs.dynamicCruise]: { data: [], dataSetKey: '' },
      [ruleTabs.vat]: { data: [], dataSetKey: '' },
      [ruleTabs.flight]: { data: [], dataSetKey: '' },
      [ruleTabs.transfers]: { data: [], dataSetKey: '' },
      [ruleTabs.charterPackage]: { data: [], dataSetKey: '' },
      [ruleTabs.roomUpgrade]: { data: [], dataSetKey: '' },
      [ruleTabs.bulkAdjustment]: { data: [], dataSetKey: '' },
      [ruleTabs.minMax]: { data: [], dataSetKey: '' }
    };
  };

  handleClearFilters = () => {
    this.setState(
      {
        data: this.resetData(),
        initialData: this.resetData(),
        selectedPrimaryFilters: List(),
        selectedSecondaryFilters: List(),
        selectedProperties: List(),
        selectedSourceMarkets: List(),
        filteredItems: this.state.allItems,
        searchText: '',
        resetFiltersKey: uuidv4()
      },
      () => {
        this.handleSearch();
        this.saveStateToLocalStorage();
      }
    );
  };

  handleTabClick = tabName => {
    localStorage.setItem(this.latestTabKey, { tabName });

    this.setState({ currentTab: tabName }, () => {
      this.updateStateFromLocalStorage();
    });
  };

  handlePrimaryFilterChange = (selectedItemIds, filteredItems) => {
    const { selectedSecondaryFilters } = this.state;

    const updatedSelectedFilters = selectedSecondaryFilters.reduce((updatedList, criteria) => {
      const availableFilters = filteredItems.find(x => x.criteriaKey === criteria.get('criteriaKey'));
      if (availableFilters) {
        const values = criteria.get('values').filter(value => availableFilters.values.some(v => v.get('id') === value));
        if (values.size > 0) {
          return updatedList.push(criteria.set('values', values));
        }
      }
      return updatedList;
    }, List());

    this.setState(
      {
        selectedPrimaryFilters: selectedItemIds,
        filteredItems: filteredItems,
        selectedSecondaryFilters: updatedSelectedFilters
      },
      () => {
        this.handleSearch();
        this.saveStateToLocalStorage();
      }
    );
  };

  saveStateToLocalStorage = () => {
    const {
      selectedPrimaryFilters,
      selectedSecondaryFilters,
      selectedProperties,
      selectedSourceMarkets,
      selectedRuleTypes,
      localStorageFiltersKey,
      currentTab
    } = this.state;

    localStorage.setItem(localStorageFiltersKey, { selectedPrimaryFilters });
    localStorage.setItem(`${localStorageFiltersKey}_${currentTab}`, {
      selectedSecondaryFilters,
      selectedProperties,
      selectedRuleTypes,
      selectedSourceMarkets
    });
  };

  handleSearchTextInputChange = e => {
    this.setState({ searchText: e.target.value }, () => this.handleSearch());
  };

  handleSearch = () => {
    const selectedFilterCriterias = this.combineFilterCriterias();
    const { searchText, ruleTypes, currentTab, selectedProperties, selectedRuleTypes, selectedSourceMarkets } =
      this.state;
    const searchPreviewInput = Object.values(ruleTabs)
      .filter(ruleTab => ruleTab !== currentTab)
      .map(ruleTab => {
        return { key: ruleTab, ruleTypes: ruleTypes[ruleTab] };
      });

    const selectedRuleTypeItems = selectedRuleTypes.size > 0 ? selectedRuleTypes : ruleTypes[currentTab];

    const promises = [
      api.search(
        searchText,
        selectedRuleTypeItems,
        selectedFilterCriterias,
        selectedProperties,
        selectedSourceMarkets.getIn([0, 'values'])
      ),
      api.searchPreview(searchPreviewInput, searchText, ruleTypes[ruleTabs.distributionCost], selectedFilterCriterias)
    ];

    Promise.all(promises).then(responses => {
      const data = {
        [currentTab]: {
          data: responses[0].data.results,
          dataSetKey: uuidv4()
        }
      };

      const searchPreview = responses[1].data.reduce((acc, curr) => {
        acc[curr.key] = curr.count;
        return acc;
      }, {});
      searchPreview[currentTab] = responses[0].data.results.length;
      this.setState({ data, initialData: data, searchPreview });
    });
  };

  handleSecondaryFilterChangedWithSourceMarket = (selectedCriterias, filteredItems) => {
    const selectedRuleTypes = selectedCriterias.find(x => x.get('criteriaKey') === 'rule_type');
    const ruleTypes = selectedRuleTypes ? selectedRuleTypes.get('values') : List();

    const selectedSourceMarkets = selectedCriterias.find(x => x.get('criteriaKey') === 'sourcemarket');
    let sourceMarkets = List();
    if (selectedSourceMarkets) {
      sourceMarkets = sourceMarkets.push(
        Map({
          key: 'sourcemarket',
          values: selectedSourceMarkets.get('values')
        })
      );
    }

    const pureSelectedCriterias = selectedCriterias.filter(
      x => x.get('criteriaKey') !== 'rule_type' && x.get('criteriaKey') !== 'sourcemarket'
    );
    this.handleSecondaryFilterChanged(pureSelectedCriterias, filteredItems, null, ruleTypes, sourceMarkets);
  };

  handleSecondaryFilterChanged = (
    selectedItemIds,
    filteredItems,
    selectedProperties,
    selectedRuleTypes,
    selectedSourceMarkets
  ) => {
    selectedRuleTypes = selectedRuleTypes || this.state.selectedRuleTypes;
    selectedProperties = selectedProperties || this.state.selectedProperties;
    selectedSourceMarkets = selectedSourceMarkets || this.state.selectedSourceMarkets;
    let updatedFilteredItems = [...this.state.filteredItems];
    filteredItems.forEach(criteria => {
      const index = this.state.filteredItems.findIndex(x => x.criteriaKey === criteria.criteriaKey);
      updatedFilteredItems[index] = criteria;
    });

    this.setState(
      {
        selectedSecondaryFilters: selectedItemIds,
        selectedProperties,
        selectedRuleTypes,
        selectedSourceMarkets,
        filteredItems: updatedFilteredItems
      },
      () => {
        this.handleSearch();
        this.saveStateToLocalStorage();
      }
    );
  };

  combineFilterCriterias = () => {
    const { selectedPrimaryFilters, selectedSecondaryFilters, currentTab } = this.state;
    let primaryMappedFilters = [];
    if (selectedPrimaryFilters) {
      const validSelectedPrimaryFilters = selectedPrimaryFilters.filter(criteria =>
        this.getPrimaryFilterCriterias(currentTab).some(x => x === criteria.get('criteriaKey'))
      );

      primaryMappedFilters = validSelectedPrimaryFilters
        .map(x => {
          if (currentTab === ruleTabs.flight && x.get('criteriaKey') === 'producttype') {
            const accomProductId = '1';
            const values = x.get('values').includes(accomProductId)
              ? x.get('values').filter(item => item !== accomProductId)
              : x.get('values');

            return {
              key: x.get('criteriaKey'),
              values: values.toArray()
            };
          }
          return {
            key: x.get('criteriaKey'),
            values: x.get('values').toArray()
          };
        })
        .toArray();
    }

    let secondaryMappedFilters = [];
    if (selectedSecondaryFilters) {
      secondaryMappedFilters = selectedSecondaryFilters
        .map(sf => {
          return {
            key: sf.get('criteriaKey'),
            values: sf.get('values').toArray()
          };
        })
        .toArray();
    }

    const mappedFilters = [...primaryMappedFilters, ...secondaryMappedFilters];

    return [...mappedFilters].filter(m => m.values.length);
  };

  getPrimaryFilterCriterias = currentTab => {
    switch (currentTab) {
      case ruleTabs.dynamicCruise:
        return ['sourcemarket', 'season'];
      case ruleTabs.flight:
      case ruleTabs.transfers:
        return ['producttype', 'sourcemarket', 'season'];
      case ruleTabs.vat:
        return ['producttype', 'sourcemarket', 'country', 'destination'];
      default:
        return ['producttype', 'season', 'sourcemarket', 'country', 'destination', 'resort'];
    }
  };

  getFlightRelatedProducts = searchFilters => {
    return searchFilters.map(item => {
      if (item.criteriaKey === 'producttype') {
        return {
          ...item,
          values: fromJS(getFlighProductTypes(item.values.toJS()))
        };
      }
      return item;
    });
  };

  includeAllProductTypes = (filteredItems = [], allItems = []) => {
    return filteredItems.map(item => {
      if (item.criteriaKey === 'producttype') {
        return {
          ...item,
          values: allItems.find(innerItem => innerItem.criteriaKey === 'producttype').values
        };
      }
      return item;
    });
  };

  render() {
    const {
      currentTab,
      data,
      initialData,
      searchText,
      allItems: oAllItems,
      filteredItems: oFilteredItems,
      selectedPrimaryFilters,
      selectedSecondaryFilters,
      selectedProperties,
      selectedSourceMarkets,
      selectedRuleTypes,
      resetFiltersKey,
      searchPreview,
      visibleTabs
    } = this.state;

    const primaryFilterCriterias = this.getPrimaryFilterCriterias(currentTab);

    const allItems = currentTab === ruleTabs.flight ? this.getFlightRelatedProducts(oAllItems) : oAllItems;
    const filteredItems =
      currentTab === ruleTabs.flight
        ? this.getFlightRelatedProducts(oFilteredItems)
        : this.includeAllProductTypes(oFilteredItems, oAllItems);
 
    return (
      <Content>
        <Spinner loading={currentTab === 'undefined_tab'} />
        <Flexbox marginBottom="10px">
          <PageHeader>Templates Overview</PageHeader>
        </Flexbox>

        <Flexbox data-testid="filters-container" marginBottom="20px" alignItems="flex-end">
          <FilteredSearchBoxes
            key={`FilteredSearchBoxes_${allItems.map(x => x.id).join('_')}_${resetFiltersKey}`}
            items={allItems}
            filteredItems={filteredItems.filter(criteria =>
              primaryFilterCriterias.some(x => x === criteria.criteriaKey)
            )}
            selectedItemIds={selectedPrimaryFilters}
            onChange={this.handlePrimaryFilterChange}
          />
          <Flexbox marginRight="25px" direction="column">
            <InputBox hasLabel={true} width={150}>
              <InputLabel>Template name</InputLabel>
              <DebounceInput
                element={Input}
                value={searchText}
                width="150px"
                height="26px"
                minLength={2}
                debounceTimeout={250}
                onChange={this.handleSearchTextInputChange}
              />
            </InputBox>
          </Flexbox>
        </Flexbox>
        <Flexbox marginBottom="10px" alignItems="flex-end">
          <Button onClick={this.handleClearFilters}>Clear filters</Button>
        </Flexbox>

        <Flexbox justifyContent="space-between" alignItems="flex-end">
          <Tabs data-testid="tabs-container">
            {visibleTabs.map(tab => (
              <Tab isSelected={currentTab === tab.key} onClick={() => this.handleTabClick(tab.key)} key={tab.key}>
                <TabText>
                  {tab.label} ({searchPreview[tab.key]})
                </TabText>
              </Tab>
            ))}
          </Tabs>
        </Flexbox>

        <TabContent>
          {currentTab === ruleTabs.accommodation && data[ruleTabs.accommodation] && (
            <Accommodation
              key={`${ruleTabs.accommodation}`}
              data={data[ruleTabs.accommodation]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedRuleTypes={selectedRuleTypes}
              initialData={initialData[ruleTabs.accommodation]}
              onFilterChanged={this.handleSecondaryFilterChangedWithSourceMarket}
              selectedSourceMarkets={selectedSourceMarkets}
            />
          )}
          {currentTab === ruleTabs.roomUpgrade && data[ruleTabs.roomUpgrade] && (
            <RoomUpgrade
              key={`${ruleTabs.roomUpgrade}`}
              data={data[ruleTabs.roomUpgrade]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedRuleTypes={selectedRuleTypes}
              initialData={initialData[ruleTabs.roomUpgrade]}
              onFilterChanged={this.handleSecondaryFilterChangedWithSourceMarket}
              selectedSourceMarkets={selectedSourceMarkets}
            />
          )}

          {currentTab === ruleTabs.flight && data[ruleTabs.flight] && (
            <Flight
              key={`${ruleTabs.flight}`}
              data={data[ruleTabs.flight]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.flight]}
              onFilterChanged={this.handleSecondaryFilterChangedWithSourceMarket}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedSourceMarkets={selectedSourceMarkets}
            />
          )}
          {currentTab === ruleTabs.transfers && data[ruleTabs.transfers] && (
            <Transfers
              key={`${ruleTabs.transfers}`}
              data={data[ruleTabs.transfers]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.transfers]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedProperties={selectedProperties}
              selectedSourceMarkets={selectedSourceMarkets}
              selectedRuleTypes={selectedRuleTypes}
            />
          )}
          {currentTab === ruleTabs.charterPackage && data[ruleTabs.charterPackage] && (
            <CharterPackage
              key={`${ruleTabs.charterPackage}`}
              data={data[ruleTabs.charterPackage]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.charterPackage]}
              onFilterChanged={this.handleSecondaryFilterChangedWithSourceMarket}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedSourceMarkets={selectedSourceMarkets}
            />
          )}

          {currentTab === ruleTabs.miscellaneousCost && data[ruleTabs.miscellaneousCost] && (
            <MiscCost
              key={`${ruleTabs.miscellaneousCost}`}
              data={data[ruleTabs.miscellaneousCost]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.miscellaneousCost]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedProperties={selectedProperties}
            />
          )}
          {currentTab === ruleTabs.distributionCost && data[ruleTabs.distributionCost] && (
            <DistributionCost
              key={`${ruleTabs.distributionCost}`}
              data={data[ruleTabs.distributionCost]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.distributionCost]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
            />
          )}

          {currentTab === ruleTabs.dynamicCruise && data[ruleTabs.dynamicCruise] && (
            <DynamicCruise
              key={`${ruleTabs.dynamicCruise}`}
              data={data[ruleTabs.dynamicCruise]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.dynamicCruise]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
            />
          )}
          {currentTab === ruleTabs.vat && data[ruleTabs.vat] && (
            <VAT
              key={`${ruleTabs.vat}`}
              data={data[ruleTabs.vat]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.vat]}
              onFilterChanged={this.handleSecondaryFilterChangedWithSourceMarket}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedSourceMarkets={selectedSourceMarkets}
            />
          )}
          {currentTab === ruleTabs.bulkAdjustment && data[ruleTabs.bulkAdjustment] && (
            <BulkAdjustment
              key={`${ruleTabs.bulkAdjustment}_${resetFiltersKey}`}
              data={data[ruleTabs.bulkAdjustment]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.bulkAdjustment]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedSourceMarkets={selectedSourceMarkets}
              selectedProperties={selectedProperties}
            />
          )}
          {currentTab === ruleTabs.minMax && data[ruleTabs.minMax] && (
            <MinMax
              key={`${ruleTabs.minMax}_${resetFiltersKey}`}
              data={data[ruleTabs.minMax]}
              searchBoxData={allItems}
              filteredSearchBoxData={filteredItems}
              initialData={initialData[ruleTabs.minMax]}
              onFilterChanged={this.handleSecondaryFilterChanged}
              selectedSecondaryFilters={selectedSecondaryFilters}
              selectedSourceMarkets={selectedSourceMarkets}
              selectedProperties={selectedProperties}
            />
          )}
        </TabContent>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  return {
    access: state.appState.user.access,
    resortsList: state.appState.resortsList
  };
}

export default connect(mapStateToProps)(RulesOverview);
