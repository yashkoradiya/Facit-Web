import React, { Component } from 'react';
import DropdownMenu from '../../FormFields/DropdownMenu';

export default class SingleSelectCellEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  isPopup() {
    return true;
  }

  getValue() {
    return this.state.value;
  }

  handleOnChange = selectedItem => {
    this.setState({ value: selectedItem }, () => {
      this.props.api.stopEditing();
    });
  };

  render() {
    return (
      <DropdownMenu
        onChange={selectedItem => this.handleOnChange(selectedItem.value)}
        defaultValue={this.props.getDropdownValues().find(x => x.value === this.state.value).value}
        items={this.props.getDropdownValues()}
      />
    );
  }
}
