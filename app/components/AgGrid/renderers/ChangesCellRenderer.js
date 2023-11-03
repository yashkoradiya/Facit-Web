import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';

class ChangesCellRenderer extends Component {
  render() {
    const changes = this.props.value ?? [];

    if (changes.length > 0) {
      const summary = changes
        .map(v => {
          const sourceMarkets = v.sourceMarketsDescription ? `(${v.sourceMarketsDescription})` : '';
          let header = `${v.offeringTypeDescription} has unpublished changes ${sourceMarkets}\n`;
          let changes = v.changes.map(c => `  - ${c} `).join('\n');
          return header.concat(changes);
        })
        .join(' \n');
      return (
        <div>
          <Icon style={{ fontSize: 16, marginTop: 2 }} title={summary}>
            keyboard_tab
          </Icon>
        </div>
      );
    }
    return <div />;
  }
}

ChangesCellRenderer.propTypes = {
  value: PropTypes.array
};

export default ChangesCellRenderer;
