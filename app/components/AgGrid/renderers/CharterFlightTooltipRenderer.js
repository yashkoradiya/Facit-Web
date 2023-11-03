import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CharterFlightTooltipRenderer extends Component {
  handleOnClick = event => {
    //TODO get publish data from backend

    const toolTipContent = document.querySelector('.tooltip-content');
    toolTipContent.innerHTML = '';

    const targetLeft = event.target.getBoundingClientRect().left;
    const targetTop = event.target.getBoundingClientRect().top - 5;
    const toolTipLeft = targetLeft + event.target.offsetWidth;
    toolTipContent.style.display = 'block';
    toolTipContent.style.left = `${toolTipLeft}px`;
    toolTipContent.style.top = `${targetTop}px`;

    toolTipContent.innerHTML = `TODO: Unpublish changes summary here`;
  };

  render() {
    if (!this.props.data) {
      return null;
    }

    if (this.props.data.hasUnpublishedChanges) {
      return (
        <div onClick={event => this.handleOnClick(event)}>
          <div style={{ marginTop: 2, paddingLeft: 0 }} title={'Has unpublished changes'}>
            <i className="material-icons" style={{ fontSize: '16px' }}>
              keyboard_tab
            </i>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

CharterFlightTooltipRenderer.propTypes = {
  data: PropTypes.object
};

export default CharterFlightTooltipRenderer;
