import React from 'react';
import { MoneyLabel } from '../../MoneyLabels';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import { isWithinElement } from '../../../helpers/domHelper';
import { Flexbox } from '../../styled/Layout';
import { colours } from 'components/styled/defaults';

function SellingPriceCellRenderer({ value, noOfDecimals, data, currency, forceKeepOpen }) {
  // allow 0 as a value
  if (value == null || value === undefined) {
    return null;
  }

  const selectedCalcPrice = data.calcPrice.values[currency];
  const selectedSellingPrice = data.sellingPrice.values[currency];
  const selectedCost = data.accommodationCost?.values[currency] ?? data.boardUpgradeCost?.values[currency];

  const changed = isPreviouslyChanged(selectedCalcPrice, value, data.hasChanges);
  return (
    <Flexbox
      justifyContent={changed ? 'space-between' : 'flex-end'}
      onMouseOut={e => handleOnMouseOut(e, forceKeepOpen)}
      onMouseOver={e => handleOnMouseOver(e, selectedSellingPrice, selectedCalcPrice, selectedCost)}
    >
      {changed && <DoneIcon style={{ color: 'black', fontSize: 14 }} />}
      <MoneyLabel value={selectedSellingPrice} noOfDecimals={noOfDecimals} />
    </Flexbox>
  );
}

const handleOnMouseOver = (e, sellingPrice, calcPrice, cost) => {
  const diff = sellingPrice - calcPrice;
  if (diff === 0) return;

  let tooltipValue = '';

  if (isSellingPriceBelowCost(sellingPrice, cost)) {
    tooltipValue += `Price is below cost! <br>`;
  }

  tooltipValue += `${diff} Fine pricing`;

  const toolTipContent = document.querySelector('.tooltip-content');
  toolTipContent.innerHTML = '';

  const targetLeft = e.target.getBoundingClientRect().left;
  const targetTop = e.target.getBoundingClientRect().top + window.scrollY - 5;
  const toolTipLeft = targetLeft + e.target.offsetWidth + 10;
  toolTipContent.style.display = 'block';
  toolTipContent.style.left = `${toolTipLeft}px`;
  toolTipContent.style.top = `${targetTop}px`;
  toolTipContent.innerHTML = tooltipValue;
};

const handleOnMouseOut = (e, forceKeepOpen) => {
  const toolTipContent = document.querySelector('.tooltip-content');
  const isWithin = isWithinElement(toolTipContent, e.clientX, e.clientY, -7);
  if (isWithin && forceKeepOpen) {
    toolTipContent.style.display = 'block';
  } else {
    toolTipContent.style.display = 'none';
  }
};

const isPreviouslyChanged = (calcPrice, sellingPrice, hasChanges) => {
  if (hasChanges) {
    return false;
  }
  if (calcPrice !== sellingPrice) {
    return true;
  }

  return false;
};

const isSellingPriceBelowCost = (sellingPrice, cost) => {
  return sellingPrice < cost;
};

SellingPriceCellRenderer.propTypes = {
  tooltipValueGetter: PropTypes.func,
  forceKeepOpen: PropTypes.bool
};

export function getBackgroundColor(calcPrice, sellingPrice, hasChanges, cost) {
  if (hasChanges) {
    return colours.yellow;
  }

  if (isSellingPriceBelowCost(sellingPrice, cost)) {
    return colours.orange;
  }

  if (calcPrice !== sellingPrice) {
    return colours.green;
  }

  return '';
}

export default SellingPriceCellRenderer;
