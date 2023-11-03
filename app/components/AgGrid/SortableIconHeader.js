import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';

export default class SortableIconHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortings: ['', 'asc', 'desc'],
      currentSortIndex: 0
    };
  }

  onSortRequested(event) {
    let sortIndex = this.state.currentSortIndex + 1;
    if (sortIndex > 2) sortIndex = 0;

    const order = this.state.sortings[sortIndex];

    this.props.setSort(order, event.shiftKey);
    this.setState({
      currentSortIndex: sortIndex
    });
  }

  render() {
    let sort = null;

    if (this.state.currentSortIndex === 1) sort = <span className="ag-icon ag-icon-asc" unselectable="on"></span>;
    else if (this.state.currentSortIndex === 2) sort = <span className="ag-icon ag-icon-desc" unselectable="on"></span>;

    return (
      <div className="ag-header-cell-label" onClick={this.onSortRequested.bind(this)}>
        <Icon style={{ fontSize: 16, marginTop: 2 }}>{this.props.icon}</Icon> {sort}
      </div>
    );
  }
}
