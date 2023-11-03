import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getDateFormat } from '../../../helpers/dateHelper';

class DateCellRenderer extends Component {
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.value !== this.props.value) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  render() {
    let { value, format, utcOffset, useLocal } = this.props;
    let text = value;

    let date = moment(value);
    
    if (date.isValid() && value) text = date.utcOffset(utcOffset, useLocal).format(format);

    return <div className="date-cell-renderer">{text}</div>;
  }
}

DateCellRenderer.propTypes = {
  format: PropTypes.string,
  utcOffset: PropTypes.any,
  useLocal: PropTypes.bool
};

DateCellRenderer.defaultProps = {
  format: getDateFormat(),
  utcOffset: 4,
  useLocal: false
};

export default DateCellRenderer;
