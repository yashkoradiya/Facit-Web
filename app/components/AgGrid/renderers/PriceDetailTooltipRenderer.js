import React from 'react';
import PropTypes from 'prop-types';
import { isWithinElement } from '../../../helpers/domHelper';
import { AgGridToolTipAnchor } from '../../styled/Layout';

function PriceDetailToolTipRenderer({ displayValueGetter, forceKeepOpen, priceComponentTypes, currency, ...params }) {
  const getTooltipContent = () => {
    let content = '';
    let arrow = null;
    const tooltipData = params.data.tooltips;
    if (tooltipData) {
      tooltipData.forEach(x => {
        if (priceComponentTypes.some(priceComponentType => priceComponentType === x.priceComponentType)) {
          const amount = round(x.amount.values[currency.toUpperCase()]);
          arrow = getMinMaxArrow(amount, x);

          if (!x.id) {
            content += `<tr><td>${amount}</td> <td>${x.name}</td></tr>`;
          } else {
            const tooltipText = x.label ? `${x.label} - ${x.name}` : `${x.name}`;
            content += `<tr><td>${amount}</td> <td><a href="/pricing/rules/templates/edit/${x.id}" target="_blank"> ${tooltipText}</a></td></tr>`;
          }
        }
      });
    }
    return { content, arrow };
  };

  const round = value => Math.round(value * 100) / 100;

  const getMinMaxArrow = (amount, min_max) => {
    if (min_max.priceComponentType !== 'min_max') return null;
    if (amount > 0) return 'up';
    if (amount < 0) return 'down';
    return null;
  };

  const renderArrow = direction => {
    switch (direction) {
      case 'up':
        return <text style={{ color: 'black', marginRight: '2px' }}>&#8599;</text>;
      case 'down':
        return <text style={{ color: 'black', marginRight: '2px' }}>&#8600;</text>;
      default:
        return null;
    }
  };

  const handleOnMouseOver = e => {
    const { content } = getTooltipContent();
    if (content === '') return;

    const toolTipContent = document.querySelector('.tooltip-content');
    const targetLeft = e.target.getBoundingClientRect().left;
    const targetTop = e.target.getBoundingClientRect().top + window.scrollY - 5;
    const toolTipLeft = targetLeft + e.target.offsetWidth;
    toolTipContent.style.display = 'block';
    toolTipContent.style.left = `${toolTipLeft}px`;
    toolTipContent.style.top = `${targetTop}px`;

    toolTipContent.innerHTML = `<table>${content}</table>`;
  };

  const handleOnMouseOut = e => {
    const toolTipContent = document.querySelector('.tooltip-content');
    const isWithin = isWithinElement(toolTipContent, e.clientX, e.clientY, -7);
    if (isWithin && forceKeepOpen) {
      toolTipContent.style.display = 'block';
    } else {
      toolTipContent.style.display = 'none';
    }
  };

  if (params.data && params.data.tooltips && params.data.tooltips.length > 0) {
    const { content, arrow } = getTooltipContent();

    if (content) {
      return (
        <AgGridToolTipAnchor>
          {arrow && renderArrow(arrow)}
          <span onMouseOut={e => handleOnMouseOut(e)} onMouseOver={handleOnMouseOver}>
            {displayValueGetter(params)}
          </span>
        </AgGridToolTipAnchor>
      );
    } else {
      return <span>{displayValueGetter(params)}</span>;
    }
  }
  if (params.data) {
    return displayValueGetter(params);
  }
  return null;
}

PriceDetailToolTipRenderer.propTypes = {
  displayValueGetter: PropTypes.func.isRequired,
  forceKeepOpen: PropTypes.bool,
  priceComponentTypes: PropTypes.array
};

export default PriceDetailToolTipRenderer;
