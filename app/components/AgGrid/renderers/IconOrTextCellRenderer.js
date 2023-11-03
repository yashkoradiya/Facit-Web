import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconCellRenderer from './IconCellRenderer';

class IconOrTextCellRenderer extends Component {
  render() {
    const { icon, text } = this.props.value;

    return icon ? <IconCellRenderer value={icon} colDef={this.props.colDef} /> : text;
  }
}

IconOrTextCellRenderer.propTypes = {
  value: PropTypes.shape({
    text: PropTypes.string,
    icon: PropTypes.string
  }).isRequired
};

export default IconOrTextCellRenderer;