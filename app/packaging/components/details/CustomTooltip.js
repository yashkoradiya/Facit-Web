import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CustomTooltip extends Component {
  componentDidMount() {
    this.props.reactContainer.className = 'custom-tooltip-wrapper';
  }

  render() {
    var data = this.props.api.getRowNode(`${this.props.rowIndex}`).data;
    var value = this.props.value;
    return <div style={{ margin: '8px' }}>{this.props.tooltipFactory(value, data)}</div>;
  }
}

CustomTooltip.propTypes = {
  tooltipFactory: PropTypes.func
};

export default CustomTooltip;
