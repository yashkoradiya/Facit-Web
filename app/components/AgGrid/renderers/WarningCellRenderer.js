import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';

class WarningCellRenderer extends Component {
  render() {
    const warnings = this.props.value ?? [];

    if (warnings.length > 0) {
      const warning = warnings.map(v => v.message).join(' \n');
      return (
        <div>
          <Icon style={{ fontSize: 16, marginTop: 2, color: 'rgb(237, 201, 0)' }} title={warning}>
            warning
          </Icon>
        </div>
      );
    }
    return <div></div>;
  }
}

WarningCellRenderer.propTypes = {
  value: PropTypes.array
};

export default WarningCellRenderer;
