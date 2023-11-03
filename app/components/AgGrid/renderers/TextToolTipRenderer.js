import React from 'react';
import PropTypes from 'prop-types';

function TextToolTipRenderer(props) {
  if (props.value && props.value.tooltip?.length > 0) {
    const { content, tooltip } = props.value;
    const tooltipData = tooltip.map(t => `- ${t}`).join(' \n');
    return <div title={tooltipData}>{content}</div>;
  }
  return <div></div>;
}

TextToolTipRenderer.propTypes = {
  value: PropTypes.object
};

export default TextToolTipRenderer;
