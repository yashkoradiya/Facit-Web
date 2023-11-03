import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

class PercentageCellRenderer extends Component {
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.value !== this.props.value) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  render() {
    let { value } = this.props;
    return <span className="percentage-cell-renderer pull-right">{numeral(value).format('0.0%')}</span>;
  }
}

PercentageCellRenderer.propTypes = {
  value: PropTypes.number
};

export default PercentageCellRenderer;
