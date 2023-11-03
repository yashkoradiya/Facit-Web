import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { colours } from 'components/styled/defaults';
import { IconButton } from 'components/styled/Button';

export default function CostCurrencyToggle({ selectedCurrency, contractCurrency, onDisplayCurrencyChanged }) {
  const [displayContractCurrency, setDisplayContractCurrency] = useState(false);

  const toggleDisplayContractCurrency = () => {
    const displayCurrency = !displayContractCurrency ? contractCurrency : selectedCurrency;
    setDisplayContractCurrency(!displayContractCurrency);
    onDisplayCurrencyChanged(displayCurrency);
  };

  if (contractCurrency === selectedCurrency) {
    return (
      <i
        className="material-icons"
        style={{ fontSize: '14px', marginLeft: '2px', color: `${colours.grey2}`, cursor: 'default' }}
        title="Contract currency is already displayed"
      >
        visibility
      </i>
    );
  }

  const tooltip = displayContractCurrency
    ? 'Stop displaying costs in contract currency'
    : 'Display costs in contract currency';

  return (
    <IconButton title={tooltip} width="15px" height="15px" marginLeft="5px" onClick={toggleDisplayContractCurrency}>
      {displayContractCurrency ? <Visibility fontSize="inherit" /> : <VisibilityOff fontSize="inherit" />}
    </IconButton>
  );
}
