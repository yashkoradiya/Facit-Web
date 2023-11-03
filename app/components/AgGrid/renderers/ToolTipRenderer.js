import React from 'react';
import PropTypes from 'prop-types';
import { isWithinElement } from '../../../helpers/domHelper';
import { AgGridToolTipAnchor } from '../../styled/Layout';

function ToolTipRenderer({
  displayValueGetter,
  tooltipValueGetter,
  forceKeepOpen,
  displayAsAnchor,
  showTooltip = () => true,
  ...params
}) {
  if (!showTooltip(params) || !tooltipValueGetter) return displayValueGetter(params);

  const handleOnMouseOver = (e, tooltipValue) => {
    const toolTipContent = document.querySelector('.tooltip-content');
    toolTipContent.innerHTML = '';

    const targetLeft = e.target.getBoundingClientRect().left;
    const targetTop = e.target.getBoundingClientRect().top + window.scrollY - 5;
    const toolTipLeft = targetLeft + e.target.offsetWidth;
    toolTipContent.style.display = 'block';
    toolTipContent.style.left = `${toolTipLeft}px`;
    toolTipContent.style.top = `${targetTop}px`;

    toolTipContent.innerHTML = tooltipValue;
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
  const content = (
    <div onMouseOut={e => handleOnMouseOut(e)} onMouseOver={e => handleOnMouseOver(e, tooltipValueGetter(params))}>
      <span>{displayValueGetter(params)}</span>
    </div>
  );
  return displayAsAnchor ? <AgGridToolTipAnchor>{content}</AgGridToolTipAnchor> : content;
}

ToolTipRenderer.propTypes = {
  displayValueGetter: PropTypes.func.isRequired,
  tooltipValueGetter: PropTypes.func,
  forceKeepOpen: PropTypes.bool
};

export default ToolTipRenderer;
