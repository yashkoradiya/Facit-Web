import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isWithinElement } from '../../../helpers/domHelper';
import { AgGridToolTipAnchor } from '../../styled/Layout';

class RuleToolTipRenderer extends Component {
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.value !== this.props.value) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  handleOnMouseOver = (event, values) => {
    const toolTipContent = document.querySelector('.tooltip-content');
    toolTipContent.innerHTML = '';

    const targetLeft = event.target.getBoundingClientRect().left;
    const targetTop = event.target.getBoundingClientRect().top - 5;
    const toolTipLeft = targetLeft + event.target.offsetWidth;
    toolTipContent.style.display = 'block';
    toolTipContent.style.left = `${toolTipLeft}px`;
    toolTipContent.style.top = `${targetTop}px`;

    values.forEach(value => {
      const tooltipText = value.label
        ? `${value.ruleType} - ${value.label} - ${value.name}`
        : `${value.ruleType} - ${value.name}`;
      toolTipContent.innerHTML += `<a href="/pricing/rules/templates/edit/${value.id}" target="_blank">${tooltipText}</a>`;
    });
  };

  handleOnMouseOut = event => {
    const toolTipContent = document.querySelector('.tooltip-content');
    const isWithin = isWithinElement(toolTipContent, event.clientX, event.clientY, -7);

    if (isWithin) {
      toolTipContent.style.display = 'block';
    } else {
      toolTipContent.style.display = 'none';
    }
  };

  render() {
    if (!this.props.data) {
      return null;
    }

    const values = this.props.data.appliedRules;
    if (values && values.length > 0) {
      return (
        <AgGridToolTipAnchor
          onMouseOut={event => this.handleOnMouseOut(event)}
          onMouseOver={event => this.handleOnMouseOver(event, values)}
        >
          <span>{values.length}</span>
        </AgGridToolTipAnchor>
      );
    } else {
      return <div>{0}</div>;
    }
  }
}

RuleToolTipRenderer.propTypes = {
  value: PropTypes.array
};

export default RuleToolTipRenderer;
