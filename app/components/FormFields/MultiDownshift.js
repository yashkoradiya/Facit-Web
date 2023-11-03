import React, { Component } from 'react';
import Downshift from 'downshift';

export default class MultiDownshift extends Component {
    constructor(props) {
      super(props);
      this.state = { data: [] };
    }
  
    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.data !== prevState.data) {
        return {
          data: nextProps.data,
          selectedItems: nextProps.data.filter(item => item.isSelected)
        };
      } else return null;
    }
  
    stateReducer = (state, changes) => {
      switch (changes.type) {
        case Downshift.stateChangeTypes.keyDownEnter:
        case Downshift.stateChangeTypes.clickItem:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            isOpen: true
          };
        default:
          return changes;
      }
    };
  
    handleSelection = selectedItem => {
      if (this.props.disabled) {
        return;
      }
      const { data } = this.state;
      let item = data.find(searchItem => searchItem.value === selectedItem.value);
      
      if (item?.isSelected && this.props.requireSelection) {
        const selectedcount = this.getSelectedItems().length;
        if (selectedcount === 1) {
          return;
        }
      } else {
        item = selectedItem;
      }
  
      item.isSelected = !item.isSelected;
      this.setState(
        {
          data
        },
        () => (this.props.onChange ? this.props.onChange(item) : null)
      );
    };
  
    filterItems = inputValue => {
      const result = this.props.data.filter(
        item => !inputValue || item.label.toUpperCase().includes(inputValue.toUpperCase())
      );
  
      result.sort((a, b) => {
        if (a.label.toUpperCase() > b.label.toUpperCase()) {
          return 1;
        }
        if (a.label.toUpperCase() < b.label.toUpperCase()) {
          return -1;
        }
        return 0;
      });
      return result;
    };
  
    getSelectedItems = () => {
      return this.props.data.filter(item => item.isSelected);
    };
  
    markHits = (listValue, inputValue) => {
      if (inputValue) {
        const regex = new RegExp(inputValue, 'i');
        const hits = regex.exec(listValue);
        if (hits) {
          return `${listValue.slice(0, hits.index)}<mark>${hits[0]}</mark>${listValue.slice(
            hits.index + hits[0].length
          )}`;
        }
        return listValue.replace(regex, `<mark>${inputValue}</mark>`);
      }
      return listValue;
    };
  
    getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
      return {
        onClick: e => {
          onClick && onClick(e);
          e.stopPropagation();
          this.handleSelection(item);
        },
        ...props
      };
    };
  
    getStateAndHelpers = downshift => {
      const { filterItems, getSelectedItems, markHits, getRemoveButtonProps, handleSelection } = this;
      return {
        getRemoveButtonProps,
        handleSelection,
        getSelectedItems,
        filterItems,
        markHits,
        ...downshift
      };
    };
  
    render() {
      const { render, children = render, ...props } = this.props;
      return (
        <Downshift
          {...props}
          stateReducer={this.stateReducer}
          onChange={this.handleSelection}
          selectedItem={null}
          defaultHighlightedIndex={0}
        >
          {downshift => children(this.getStateAndHelpers(downshift))}
        </Downshift>
      );
    }
  }