import React from 'react';
import PropTypes from 'prop-types';
import * as localStorage from 'core/localStorage';
import settings from '../../core/settings/settings';
import DropdownMenu from './DropdownMenu';
import { Flexbox } from '../styled/Layout';

class CurrencySelector extends React.PureComponent {
  constructor(props) {
    super(props);
    if (props.onInitialized) {
      props.onInitialized(props.selectedCurrency);
    }
  }

  handleChange = selectedItem => {
    localStorage.setItem('selectedCurrency', selectedItem.key);
    this.props.onChange(selectedItem.key);
  };

  render() {
    const { selectedCurrency } = this.props;
    return (
      <Flexbox marginRight="10px">
        <DropdownMenu
          onChange={this.handleChange}
          width={'80px'}
          defaultValue={selectedCurrency}
          items={settings.AVAILABLE_CURRENCIES.map(currency => ({ key: currency, value: currency }))}
        />
      </Flexbox>
    );
  }
}

CurrencySelector.propTypes = {
  selectedCurrency: PropTypes.string,
  onInitialized: PropTypes.func,
  onChange: PropTypes.func
};

export default CurrencySelector;
