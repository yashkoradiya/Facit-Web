import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownContent,
  DropdownContainer,
  DropdownLabel,
  DropdownInput
} from '../styled/Dropdown';
import { ErrorToolTip } from '../styled/Layout';

class DropdownMenu extends Component {
  handleChange = selectedItem => {
    this.props.onChange(selectedItem);
  };
  

  render() {
    const { label, items, defaultValue, width, errorMessage, disabled, clearItemSelection } = this.props;
    return (
      <Downshift  onChange={this.handleChange} itemToString={() => ''} defaultHighlightedIndex={0}>
        {({
          getMenuProps,
          isOpen,
          getItemProps,
          getInputProps,
          highlightedIndex,
          selectedItem,
          toggleMenu,
          inputValue,
          clearSelection
        }) => {
          const inputProps = getInputProps();
          
          if (clearItemSelection) {
            clearItemSelection(clearSelection);
          }

          return (
            <div>
              <DropdownContainer width={width ? width : null} hasErrorMessage={!!errorMessage}>
                {label && <DropdownLabel htmlFor={inputProps.id}>{label}</DropdownLabel>}
                <DropdownHeader
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    toggleMenu();
                  }}
                  isOpen={isOpen}
                >
                  <DropdownInput data-testid="dropdown-input" disabled={disabled} {...inputProps} placeholder={defaultValue} />
                </DropdownHeader>
                <DropdownContent {...getMenuProps({ isOpen })}>
                  <Dropdown data-testid="dropdown-menu" {...getMenuProps({ isOpen })} disabled={disabled}>
                    {isOpen &&
                      items
                        .filter(item => !inputValue || item.value.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((item, index) => (
                          <DropdownItem
                            key={item.key}
                            {...getItemProps({
                              item,
                              index,
                              isActive: highlightedIndex === index,
                              isSelected: selectedItem ? item.key === selectedItem.key : false
                            })}
                          >
                            {item.value}
                          </DropdownItem>
                        ))}
                  </Dropdown>
                </DropdownContent>
                <ErrorToolTip>{errorMessage}</ErrorToolTip>
              </DropdownContainer>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

DropdownMenu.propTypes = {
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  width: PropTypes.string,
  items: PropTypes.array,
  errorMessage: PropTypes.string
};

export default DropdownMenu;
