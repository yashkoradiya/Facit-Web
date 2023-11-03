import React from 'react';
import PropTypes from 'prop-types';
import { getDateFormat } from '../../../helpers/dateHelper';
import DateCellRenderer from './DateCellRenderer';

export default function DateTimeCellRenderer(props) {
  return <DateCellRenderer {...props} />;
}

DateTimeCellRenderer.propTypes = {
  format: PropTypes.string,
  utcOffset: PropTypes.any,
  useLocal: PropTypes.bool
};

DateTimeCellRenderer.defaultProps = {
  format: getDateFormat(3),
  utcOffset: 4,
  useLocal: false
};
