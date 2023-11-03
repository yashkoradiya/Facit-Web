import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, fromJS, Map } from 'immutable';
import SearchBox from '../SearchBox';
import { getMatchingCriteriaTitle } from 'pricing/rules/ruleConstants';
import settings from '../../../core/settings/settings';
import { connect } from 'react-redux';
import { accommodationDiffCheck } from '../form-fields-utils';

class FilteredSearchBoxes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentsAndChildren: List([
        { parent: 'country', child: 'destination' },
        { parent: 'destination', child: 'resort' },
        { parent: 'resort', child: 'accommodationcode' },
        { parent: 'accommodationcode', child: ['roomtypecategory', 'roomcode', 'classification'] }
      ]),
      multitenantParentChild: List([
        { parent: 'sourcemarket', child: 'country' },
        { parent: 'sourcemarket', child: 'destination' },
        { parent: 'sourcemarket', child: 'resort' },
        { parent: 'country', child: 'destination' },
        { parent: 'destination', child: 'resort' },
        { parent: 'resort', child: 'accommodationcode' },
        { parent: 'accommodationcode', child: 'roomtypecategory' },
        { parent: 'accommodationcode', child: 'roomcode' }
      ]),
      selectedsourcemarket: [],
      selectedItemIds: List()
    };
    this.selectedsourcemarket = [];
  }

  componentDidMount() {
    const { selectedItemIds } = this.props;
    if (selectedItemIds.size > 0) {
      this.setState({ selectedItemIds });
      this.initiateFiltering(selectedItemIds);
    }
  }

  componentDidUpdate(previousProps) {
    if (settings.IS_MULTITENANT_ENABLED) {
      if (previousProps.selectedSourceMarkets !== this.props.selectedSourceMarkets) {
        const { selectedSourceMarkets, selectedItemIds } = this.props;
        const fillteredSelectedItemIds = selectedItemIds.filter(f => f.get('criteriaKey') !== 'sourcemarket');
        if (fillteredSelectedItemIds.size > 0) {
          const updatedItems = this.updateChildren(fillteredSelectedItemIds);
          this.props.onChange(updatedItems.selectedItemIds, updatedItems.filteredItems);
        } else {
          const selectedSourceMarketIds = selectedSourceMarkets
            ? fromJS(selectedSourceMarkets.map(this.getSelectedSourceMarkets))
            : List();
          const updatedItems = this.updateChildren(selectedSourceMarketIds);
          this.props.onChange(updatedItems.selectedItemIds, updatedItems.filteredItems);
        }
      }
    }

    const { selectedItemIds } = this.props;
    /**
     * Conditionally triggers filtering based on changes in dynamic accommodation settings or selected item IDs.
     *
     * This function checks if any of the following conditions are met:
     * 1. Dynamic accommodation is enabled and the accommodation items have changed.
     * 2. The selected item IDs have changed.
     *
     * If any of these conditions are satisfied, the `initiateFiltering` method is called to start the filtering process.
     *
     */
    if (
      (this.props.dynamicAccommodation.get('dynamicAccommodationEnabled') &&
        !accommodationDiffCheck(previousProps.items, this.props.items)) ||
      !this.state.selectedItemIds.equals(selectedItemIds)
    ) {
      this.initiateFiltering(selectedItemIds);
    }
  }

  initiateFiltering = selectedItemIds => {
    if (settings.IS_MULTITENANT_ENABLED) {
      const updatedItems = this.updateChildren(selectedItemIds);
      this.props.onChange(updatedItems.selectedItemIds, updatedItems.filteredItems);
    } else {
      const { filteredSelectedItemIds, filteredItems } = this.getFilteredItemsBasedOnSelectedItems(selectedItemIds);
      this.setState({ selectedItemIds: filteredSelectedItemIds });
      this.props.onChange(filteredSelectedItemIds, filteredItems);
    }
  };

  getSelectedSourceMarkets(ssm) {
    return Map({
      criteriaKey: 'sourcemarket',
      values: ssm.id
    });
  }

  handleSearchBoxChange = (criteriaKey, selectedIds) => {
    let selectedItemIds = this.props.selectedItemIds;

    const criteria = Map({
      criteriaKey: criteriaKey,
      values: selectedIds
    });

    if (selectedIds.size === 0) {
      selectedItemIds = selectedItemIds.filter(f => f.get('criteriaKey') !== criteriaKey);
    } else if (selectedItemIds.some(x => x.get('criteriaKey') === criteriaKey)) {
      selectedItemIds = selectedItemIds.splice(
        selectedItemIds.findIndex(x => x.get('criteriaKey') === criteriaKey),
        1,
        criteria
      );
    } else {
      selectedItemIds = selectedItemIds.push(criteria);
    }

    this.initiateFiltering(selectedItemIds);
  };

  /**
   * This function returns a new list of filtered items based on the selectedItems criteria.
   * @param {Map} selectedItemIds
   * @returns
   */
  getFilteredItemsBasedOnSelectedItems = selectedItemIds => {
    const { items } = this.props;

    let filteredSelectedItemIds = selectedItemIds;

    const filteredItems = selectedItemIds.reduce(
      (accummulator, criteria) => {
        /**
         * A helper function for updating the filteredItems and selectedItemsIds.
         * @param {number} idx
         */
        const performUpdate = idx => {
          if (idx > -1) {
            let updatedChild = this.getfilteredChild(criteria, idx);
            updatedChild = this.getValidatedChildBasedOnExceptions(updatedChild);
            filteredSelectedItemIds = this.updateSelectedItemIds(selectedItemIds, updatedChild);
            accummulator.splice(idx, 1, updatedChild);
          }
        };

        if (items.length && this.isGeographyCriteria(criteria)) {
          const parentAndChild = this.getParentAndChild(criteria);

          // If the parent contains an array of children, then loop through the children to filter the child options.
          if (typeof parentAndChild.child === 'object') {
            parentAndChild.child.forEach(child => {
              // Use the child to find the index of the child in the props.items
              const idx = accummulator.findIndex(item => item.criteriaKey === child);
              performUpdate(idx);
            });
          } else {
            const idx = accummulator.findIndex(item => item.criteriaKey === parentAndChild.child);
            performUpdate(idx);
          }
        }
        return accummulator;
      },
      [...items]
    );

    return { filteredSelectedItemIds, filteredItems };
  };

  /**
   * This function takes the selectedItemIds and Child item to filter the selectedItems by removing invalid item selections.
   * @param {List} selectedItemIds
   * @param {Object} child
   * @returns
   */
  updateSelectedItemIds = (selectedItemIds, child) => {
    const selectedChildIdx = selectedItemIds.findIndex(x => x.get('criteriaKey') === child.criteriaKey);
    const availableChildIds = selectedChildIdx > -1 ? selectedItemIds.get(selectedChildIdx).get('values') : List();

    const filteredSelectedChildIds = availableChildIds.filter(id => child.values.some(item => item.get('id') === id));

    if (availableChildIds.size !== filteredSelectedChildIds.size) {
      if (filteredSelectedChildIds.size > 0) {
        selectedItemIds = selectedItemIds.update(selectedChildIdx, item => {
          return item.set('values', filteredSelectedChildIds);
        });
      } else {
        selectedItemIds = selectedItemIds.delete(selectedChildIdx);
      }
    }

    return selectedItemIds;
  };

  /**
   * Based on the criteria this function returns boolean if the criteriaKey is a parent.
   * @param {Map} criteria
   * @returns
   */
  isGeographyCriteria = criteria => {
    const parentsList = this.state.parentsAndChildren.map(i => i.parent);

    return parentsList.includes(criteria.get('criteriaKey'));
  };

  getParentAndChild = criteria =>
    this.state.parentsAndChildren.find(item => item.parent === criteria.get('criteriaKey'));

  /**
   * This function returns the filtered child based on the selectedCriteria.
   * The child values are filtered, only if the parent items are selected,
   * else the child is returned unchanged.
   * @param {Map} selectedCriteria
   * @param {number} childIdx
   * @returns
   */
  getfilteredChild = (selectedCriteria = Map(), childIdx = -1) => {
    const child = this.props.items[childIdx];

    if (!child) return;

    if (selectedCriteria.get('values').size) {
      const filteredChildValues = child.values.filter(item =>
        selectedCriteria.get('values').includes(item.get('parentIds'))
      );

      return { ...child, values: filteredChildValues };
    }

    return child;
  };

  /**
   * A middleware function to handle specific logics for child in filtered items.
   * @param {Object} child
   * @returns
   */
  getValidatedChildBasedOnExceptions = child => {
    if (child.criteriaKey === 'roomcode' && this.isDynamicContractSelected()) {
      return { ...child, values: List() };
    } else {
      return child;
    }
  };

  /**
   * -----------------------------------------------------------------------------------------------------
   * The following two methods are archvial and needs to be discarded, when working on Muti-Tenant enabled.
   * -----------------------------------------------------------------------------------------------------
   *
   */
  updateChildren = selectedItemIds => {
    let filteredItems = [...this.props.items];
    let parentsAndChildren = [];

    parentsAndChildren = this.state.multitenantParentChild.filter(value =>
      filteredItems.some(x => x.criteriaKey === value.parent)
    );

    parentsAndChildren.forEach(parentAndChild => {
      const parentKey = parentAndChild.parent;
      const childKey = parentAndChild.child;
      const parent = selectedItemIds.find(x => x.get('criteriaKey') === parentKey);
      let selectedParentIds = parent ? parent.get('values') : List();

      const child = selectedItemIds.find(x => x.get('criteriaKey') === childKey);
      const selectedChildIds = child ? child.get('values') : List();

      //If the selected parentIds are empty, then mark all items of the parent as selected items (except resort).
      if (parentKey !== 'resort' && (!selectedParentIds || selectedParentIds.size === 0)) {
        selectedParentIds = filteredItems.find(x => x.criteriaKey === parentKey).values.map(x => x.get('id'));
      }

      const updatedChildren = this.filterItems(
        childKey,
        selectedParentIds,
        selectedChildIds,
        filteredItems,
        selectedItemIds,
        parentKey
      );
      filteredItems = updatedChildren.filteredItems;
      selectedItemIds = updatedChildren.selectedItemIds;
    });

    return { filteredItems, selectedItemIds };
  };

  filterItems = (criteriaKey, selectedParentIds, selectedChildIds, filteredItems, selectedItemIds, parentKey) => {
    const childIndex = filteredItems.findIndex(x => x.criteriaKey === criteriaKey);
    let child = filteredItems[childIndex];
    if (!child || selectedParentIds.size === 0) {
      return { filteredItems, selectedItemIds };
    }
    if (parentKey == 'sourcemarket') {
      this.selectedsourcemarket = selectedParentIds;
      const childValue = child.values.filter(item =>
        this.selectedsourcemarket.some(p => item.get('sourceMarketIds')?.includes(p))
      );
      child = { ...child, values: childValue };
      filteredItems[childIndex] = child;
    }
    if (!child || selectedParentIds.size === 0) {
      return { filteredItems, selectedItemIds };
    }
    if (this.selectedsourcemarket != null && this.selectedsourcemarket.size > 0) {
      if (criteriaKey == 'country') {
        const childValues = child.values.filter(item =>
          selectedParentIds.some(p => item.get('parentIds')?.includes(p))
        );
        child = { ...child, values: childValues };
        filteredItems[childIndex] = child;
      }

      if (criteriaKey == 'destination') {
        const selectedParent = selectedItemIds.find(x => x.get('criteriaKey') === 'country');
        let selectedParentIdss = selectedParent ? selectedParent.get('values') : List();
        const childValue = child.values.filter(item =>
          this.selectedsourcemarket.some(p => item.get('sourceMarketIds')?.includes(p))
        );
        child = { ...child, values: childValue };
        filteredItems[childIndex] = child;
        if (selectedParentIdss.size > 0) {
          const childValues = child.values.filter(item =>
            selectedParentIdss.some(p => item.get('parentIds')?.includes(p))
          );
          child = { ...child, values: childValues };
          filteredItems[childIndex] = child;
        }
      }

      if (criteriaKey == 'resort') {
        const selectedCountries = selectedItemIds.find(x => x.get('criteriaKey') === 'country');
        let selectedcountriesIds = selectedCountries ? selectedCountries.get('values') : List();
        const selectedDestinations = selectedItemIds.find(x => x.get('criteriaKey') === 'destination');
        let selectedDestinationsIds = selectedDestinations ? selectedDestinations.get('values') : List();

        if (selectedcountriesIds.size > 0) {
          const childValue = child.values.filter(item =>
            selectedcountriesIds.some(p => item.get('parentCountryIds')?.includes(p))
          );
          child = { ...child, values: childValue };
          filteredItems[childIndex] = child;
        }
        if (selectedDestinationsIds.size > 0) {
          const childValues = child.values.filter(item =>
            selectedDestinationsIds.some(p => item.get('parentIds')?.includes(p))
          );
          child = { ...child, values: childValues };
          filteredItems[childIndex] = child;
        }
      }

      if (criteriaKey == 'accommodationcode') {
        const selectedCountries = selectedItemIds.find(x => x.get('criteriaKey') === 'country');
        let selectedcountriesIds = selectedCountries ? selectedCountries.get('values') : List();

        const selectedDestinations = selectedItemIds.find(x => x.get('criteriaKey') === 'destination');
        let selectedDestinationsIds = selectedDestinations ? selectedDestinations.get('values') : List();

        const selectedResorts = selectedItemIds.find(x => x.get('criteriaKey') === 'resort');
        let selectedResortsIds = selectedResorts ? selectedResorts.get('values') : List();

        const childValue = child.values.filter(item =>
          this.selectedsourcemarket.some(p => item.get('sourceMarketIds')?.includes(p))
        );
        child = { ...child, values: childValue };
        filteredItems[childIndex] = child;

        if (selectedcountriesIds.size > 0) {
          child = {
            ...child,
            values: child.values.filter(item =>
              selectedcountriesIds.some(p => item.get('parentCountryIds')?.includes(p))
            )
          };
          filteredItems[childIndex] = child;
        }
        if (selectedDestinationsIds.size > 0) {
          child = {
            ...child,
            values: child.values.filter(item =>
              selectedDestinationsIds.some(p => item.get('parentDestinationIds')?.includes(p))
            )
          };
          filteredItems[childIndex] = child;
        }
        if (selectedResortsIds.size > 0) {
          const childValues = child.values.filter(item =>
            selectedResortsIds.some(p => item.get('parentIds')?.includes(p))
          );
          child = { ...child, values: childValues };
          filteredItems[childIndex] = child;
        }
      }
    } else {
      if (this.props.selectedSourceMarkets.length > 0) {
        if (selectedItemIds.size > 0) {
          const selectedSourceMarketIds = fromJS(
            this.props.selectedSourceMarkets.map(x => {
              return Map({
                criteriaKey: 'sourcemarket',
                values: x.id
              });
            })
          );
          const selectedSSMIds = selectedSourceMarketIds.filter(f => f.get('criteriaKey') == 'sourcemarket');
          if (selectedSSMIds.size > 0) {
            let selectedParentIdss = selectedSSMIds.map(x => x.get('values'));

            const childValue = child.values.filter(item =>
              selectedParentIdss.some(p => item.get('sourceMarketIds')?.includes(p))
            );
            child = { ...child, values: childValue };
            filteredItems[countryIdx] = child;
            const countryIdx = filteredItems.findIndex(x => x.criteriaKey === 'country');
            let filteredcountry = filteredItems[countryIdx];
            const filteredValue = filteredcountry.values.filter(item =>
              selectedParentIdss.some(p => item.get('parentIds')?.includes(p))
            );
            filteredcountry = { ...filteredcountry, values: filteredValue };
            filteredItems[countryIdx] = filteredcountry;
          } else {
            const selectedSourceMarkets = fromJS(this.props.selectedSourceMarkets.map(this.getSelectedSourceMarkets));

            let selectedParentIdss = selectedSourceMarkets.map(x => x.get('values'));
            const childValue = child.values.filter(item =>
              selectedParentIdss.some(p => item.get('sourceMarketIds')?.includes(p))
            );
            child = { ...child, values: childValue };
            filteredItems[countryIdx] = child;
            const countryIdx = filteredItems.findIndex(x => x.criteriaKey === 'country');
            let filteredcountry = filteredItems[countryIdx];
            const filteredValue = filteredcountry.values.filter(item =>
              selectedParentIdss.some(p => item.get('parentIds')?.includes(p))
            );
            filteredcountry = { ...filteredcountry, values: filteredValue };
            filteredItems[countryIdx] = filteredcountry;
          }
        }

        const childValues = child.values.filter(item =>
          selectedParentIds.some(p => item.get('parentIds')?.includes(p))
        );
        child = { ...child, values: childValues };
        filteredItems[childIndex] = child;
      }
    }
    const updatedSelectedChildIds = selectedChildIds.filter(id => child.values.some(item => item.get('id') === id));
    if (selectedChildIds.size !== updatedSelectedChildIds.size) {
      const index = selectedItemIds.findIndex(x => x.get('criteriaKey') === criteriaKey);
      if (updatedSelectedChildIds.size > 0) {
        selectedItemIds = selectedItemIds.update(index, item => {
          return item.set('values', updatedSelectedChildIds);
        });
      } else if (criteriaKey !== 'resort') {
        selectedItemIds = selectedItemIds.delete(index);
      }
    }

    if (criteriaKey === 'roomcode' && selectedParentIds.size) {
      const rmCodeIdx = filteredItems.findIndex(item => item.criteriaKey === 'roomcode');
      const roomCodeItem = filteredItems[rmCodeIdx];
      const matchingRmCodeItems = filteredItems[rmCodeIdx].values.filter(rmCodeItem =>
        selectedParentIds.some(item => item === rmCodeItem.get('parentIds'))
      );
      filteredItems[rmCodeIdx] = {
        ...roomCodeItem,
        values: matchingRmCodeItems
      };
    }

    return { filteredItems, selectedItemIds };
  };

  isDynamicContractSelected = () => {
    const selectedContractValues = this.props.selectedItemIds
      .find(x => x.get('criteriaKey') === 'contracttype')
      ?.get('values');
    return (
      this.props.dynamicAccommodation.get('dynamicAccommodationEnabled') &&
      selectedContractValues?.size === 1 &&
      selectedContractValues.contains('dynamic')
    );
  };

  render() {
    const { selectedItemIds, filteredItems, disabled, dynamicAccommodation } = this.props;

    return (
      filteredItems &&
      filteredItems.map(item => {
        const selected = selectedItemIds.find(criteria => criteria.get('criteriaKey') === item.criteriaKey);

        let dynamicParentIds;
        if (item.criteriaKey === 'resort') {
          dynamicParentIds =
            selectedItemIds.find(criteria => criteria.get('criteriaKey') === 'destination')?.get('values') ?? List();
        } else if (
          item.criteriaKey === 'accommodationcode' &&
          dynamicAccommodation.get('dynamicAccommodationEnabled')
        ) {
          dynamicParentIds =
            selectedItemIds.find(criteria => criteria.get('criteriaKey') === 'resort')?.get('values') ?? List();
        }

        return (
          <SearchBox
            key={`searchbox_${item.criteriaKey}`}
            disabled={disabled}
            items={item.values}
            placeholder={item.title === 'accommodationcode' ? 'Accommodation' : item.title}
            onChange={itemIds => this.handleSearchBoxChange(item.criteriaKey, itemIds)}
            selectedItemIds={selected ? selected.get('values') : List()}
            selectedsourcemarketIds={this.props.selectedsourcemarkets}
            errorMessage={this.props.errorMessage}
            width={item.criteriaKey === 'accommodationcode' ? '320px' : undefined}
            parentIds={dynamicParentIds}
          />
        );
      })
    );
  }
}

FilteredSearchBoxes.propTypes = {
  items: PropTypes.array.isRequired,
  filteredItems: PropTypes.array.isRequired,
  selectedItemIds: PropTypes.instanceOf(List),
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};
FilteredSearchBoxes.defaultProps = {
  selectedItemIds: List()
};

function mapStateToProps(state) {
  return {
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
}

export default connect(mapStateToProps)(FilteredSearchBoxes);

//TODO: Should remove references to this method and point to the utility function
export const createCriteriaItem = (criteriaKey, values) => {
  return {
    criteriaKey,
    title: getMatchingCriteriaTitle(criteriaKey),
    values: List(values)
  };
};

//TODO: Should remove references to this method and point to the utility function
export const createValueItem = (id, name, code, parentIds, sourceMarketIds, parentCountryIds, parentDestinationIds) => {
  return Map({
    id,
    name,
    code,
    parentIds,
    sourceMarketIds,
    parentCountryIds,
    parentDestinationIds
  });
};
