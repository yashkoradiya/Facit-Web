import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyledLink } from '../../styled/Link';

class LinkCellRenderer extends Component {
  render() {
    if (!this.props.value) {
      return null;
    }

    const name = this.props.value.name;
    const url = this.props.value.url;

    if (!url) {
      return name;
    } else if (this.props.value.newTab) {
      return (
        <StyledLink
          onClick={e => {
            e.stopPropagation();
            window.open(url);
          }}
        >
          {name}
        </StyledLink>
      );
    }

    return (
      <Link
        onClick={e => {
          e.stopPropagation();
        }}
        to={url}
      >
        {name}
      </Link>
    );
  }
}

LinkCellRenderer.propTypes = {
  value: PropTypes.any
};

export default LinkCellRenderer;
