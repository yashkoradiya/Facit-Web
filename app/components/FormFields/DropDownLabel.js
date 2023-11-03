import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Flexbox } from '../styled/Layout';
import DropdownMenu from './DropdownMenu';

class DropDownLabel extends PureComponent {
  handleChange = e => {
    this.props.onChange(e);
  };

  render = () => {
    const { name, defaultValue, items } = this.props;
    return (
      <Flexbox width="100%" justifyContent="space-between">
        <h3>{name}</h3>
        <DropdownMenu onChange={this.handleChange} width={'120px'} defaultValue={defaultValue} items={items} />
      </Flexbox>
    );
  };
}

DropDownLabel.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  errorMessage: PropTypes.string
};

export default DropDownLabel;
