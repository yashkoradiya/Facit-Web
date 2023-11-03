import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import AutoCompleteMultiple from './AutoCompleteMultiple';
import { createFilterItem } from './form-fields-utils';
import { connect } from 'react-redux';

class SearchBox extends Component {
  shouldComponentUpdate = nextProps => {
    return (
      this.props.items !== nextProps.items ||
      this.props.selectedItemIds !== nextProps.selectedItemIds ||
      this.props.errorMessage !== nextProps.errorMessage ||
      this.props.parentIds !== nextProps.parentIds
    );
  };

  handleOnChange = (selectedItem, dynamicOptions) => {
    let selectedItemIds = this.props.selectedItemIds;
    if (dynamicOptions) {
      const newValues = selectedItemIds.filter(item => dynamicOptions.map(i => i.value).includes(item));
      this.props.onChange(newValues);
      return;
    }

    if (!selectedItem?.value) {
      return;
    }

    if (selectedItem.isSelected) {
      selectedItemIds = selectedItemIds.push(selectedItem.value);
    } else {
      const index = selectedItemIds.findIndex(id => id === selectedItem.value);
      if (index >= 0) {
        selectedItemIds = selectedItemIds.delete(index);
      }
    }
    this.props.onChange(selectedItemIds);
  };

  /**This method filters the selectedIds from props.items and return a list of Ids to the props.onChange */
  handleSelectAll = isAllItemsSelected => {
    if (isAllItemsSelected && this.props.requireSelection) {
      return;
    }
    const selectedItemIds = isAllItemsSelected
      ? List()
      : this.props.items
          .groupBy(x => x.get('id'))
          .map(x => x.first().get('id'))
          .toList();
    this.props.onChange(selectedItemIds);
  };

  render() {
    const { items, placeholder, errorMessage, width, selectedItemIds, disabled, parentIds, dynamicAccommodation } =
      this.props;
    const visibleItems = items
      .groupBy(x => x.get('id'))
      .map(x => x.first())
      .toList();
    const isAllItemsSelected = visibleItems.size && visibleItems.size === selectedItemIds.size;

    return (
      <AutoCompleteMultiple
        disabled={disabled}
        data={visibleItems.map(item => createFilterItem(item, selectedItemIds)).toArray()}
        placeholder={placeholder}
        onChange={this.handleOnChange}
        errorMessage={errorMessage}
        width={width}
        requireSelection={this.props.requireSelection}
        parentIds={parentIds ?? List()} //Used for filtering dynamic options that is required to be loaded from an API
        selectedItemIds={selectedItemIds} //Used for marking dynamic items has selected.
        allItemsSelectedCB={options => {
          if (
            placeholder === 'Resort' ||
            (placeholder === 'Accommodation' && dynamicAccommodation.get('dynamicAccommodationEnabled'))
          ) {
            this.props.onChange(options);
          } else {
            this.handleSelectAll(isAllItemsSelected);
          }
        }}
        allItemsSelected={isAllItemsSelected}
      />
    );
  }
}

SearchBox.propTypes = {
  disabled: PropTypes.bool,
  items: PropTypes.instanceOf(List).isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedItemIds: PropTypes.instanceOf(List),
  selectedsourcemarketIds: PropTypes.instanceOf(List),
  errorMessage: PropTypes.string,
  width: PropTypes.string,
  parentIds: PropTypes.instanceOf(List),
  requireSelection: PropTypes.bool
};

SearchBox.defaultProps = {
  selectedItemIds: List(),
  requireSelection: false
};

function mapStateToProps(state) {
  return {
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
}

export default connect(mapStateToProps)(SearchBox);
