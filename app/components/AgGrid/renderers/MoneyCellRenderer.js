import React from 'react';
import { MoneyLabel, ContextMoneyLabel } from '../../MoneyLabels';
import { isNumber } from '../../../helpers/numberHelper';

class MoneyCellRenderer extends React.Component {
  static defaultParams = {
    formatMoneyParams: {},
    noOfDecimals: 2
  };
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.value !== this.props.value) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }
  render() {
    const { value, noOfDecimals } = this.props;
    if (!value && !isNumber(value)) {
      return null;
    }
    if (typeof value === 'object') {
      return (
        <div style={{ textAlign: 'right' }}>
          <ContextMoneyLabel values={value.values} noOfDecimals={noOfDecimals} />
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'right' }}>
        <MoneyLabel value={value} noOfDecimals={noOfDecimals} />
      </div>
    );
  }
}

export default MoneyCellRenderer;
