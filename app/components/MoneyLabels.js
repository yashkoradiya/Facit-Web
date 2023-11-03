import * as React from 'react';
import { connect } from 'react-redux';
import accounting from 'accounting';
import { PropTypes } from 'prop-types';

class MoneyLabel extends React.PureComponent {
  static defaultParams = {
    formatMoneyParams: {},
    noOfDecimals: 2
  };

  render() {
    let { value, format, noOfDecimals } = this.props;
    return (
      <React.Fragment>
        {formatMoney(value, '', format, noOfDecimals, {
          thousand: ' ',
          precision: noOfDecimals,
          ...this.props.formatMoneyParams
        })}
      </React.Fragment>
    );
  }
}

function formatMoney(valueToRender, symbol, format, precision, accountingFormatMoneyParams) {
  let formatted;
  if (!format) {
    format = '%v';
  }
  if (!precision) {
    precision = 0;
  }

  if (valueToRender != null && !isNaN(valueToRender)) {
    formatted = accounting.formatMoney(valueToRender, {
      symbol,
      format,
      precision,
      ...accountingFormatMoneyParams
    });
  } else {
    formatted = '';
  }
  return formatted;
}

const ContextMoneyLabel = props => {
  const currency = props.currency ? props.currency : props.selectedCurrency.toUpperCase();
  const moneyValue = props.values[currency];
  return (
    <React.Fragment>
      <MoneyLabel value={moneyValue} format={props.format} noOfDecimals={props.noOfDecimals} />
      {props.showCurrency && ` ${currency}`}
    </React.Fragment>
  );
};

ContextMoneyLabel.propTypes = {
  values: PropTypes.object.isRequired,
  showCurrency: PropTypes.bool,
  currency: PropTypes.string
};

const mapStateToProps = state => {
  return {
    selectedCurrency: state.appState.selectedCurrency
  };
};

const connected = connect(mapStateToProps)(ContextMoneyLabel);
export { MoneyLabel, connected as ContextMoneyLabel };
