import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { PropTypes } from 'prop-types';
import getDefaultContextMenuItems from './common/getDefaultContextMenuItems';
import * as localStorage from '../../core/localStorage';
import './GridCustomization.scss';
import { AgGridToolTip } from '../styled/Layout';
import { isWithinElement } from 'helpers/domHelper';

export default class AgGridInfinite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSet: null,
      agGridKey: props.agGridKey ? `agGridWindow_${props.agGridKey}` : null
    };
  }

  onGridReady = params => {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.setRowData(this.props.dataSet.data);
  };

  saveWindow = event => {
    if (!event.finished) return;
    const { agGridKey } = this.state;
    const { gridApi, gridColumnApi } = this;
    if (!agGridKey || !gridApi || !gridColumnApi) return;

    const agGridWindow = {
      colState: gridColumnApi.getColumnState(),
      groupState: gridColumnApi.getColumnGroupState(),
      filterState: gridApi.getFilterModel()
    };
    localStorage.setItem(agGridKey, agGridWindow);
  };

  restoreWindow = () => {
    const agGridWindow = localStorage.getItem(this.state.agGridKey);
    if (agGridWindow && agGridWindow.colState && agGridWindow.colState.length > 0) {
      const { gridApi, gridColumnApi } = this;
      gridColumnApi.applyColumnState({ state: agGridWindow.colState });
      gridColumnApi.setColumnGroupState(agGridWindow.groupState);
      gridApi.setFilterModel(agGridWindow.filterState);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.dataSet.dataSetKey !== this.props.dataSet.dataSetKey) {
      this.gridApi?.setRowData(this.props.dataSet.data);
    }
  }

  sideBarSettings = () => {
    if (this.props.hideSideBar) return false;

    return {
      position: 'left',
      toolPanels: ['columns']
    };
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
    const {
      columnDefinitions,
      gridOptions,
      onRowClicked,
      onRowSelected,
      onSelectionChanged,
      defaultColDef,
      rowSelection,
      onCellClicked,
      testId
    } = this.props;

    return (
      <div data-testid={testId} style={{ width: '100%', height: this.props.gridHeight || 'calc(100vh - 300px)' }}>
        <AgGridToolTip
          width="auto"
          minHeight="auto"
          className={'tooltip-content'}
          onMouseOut={event => this.handleOnMouseOut(event)}
        />
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%'
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={columnDefinitions}
            defaultColDef={{
              minWidth: 40,
              resizable: true,
              enableValue: true,
              enableRowGroup: true,
              enablePivot: true,
              sortable: true,
              filter: false,
              ...defaultColDef
            }}
            rowBuffer={20}
            rowSelection={rowSelection || 'multiple'}
            rowDeselection={true}
            suppressRowClickSelection={this.props.disableSelection}
            suppressCellSelection={this.props.disableSelection}
            suppressColumnVirtualisation={process.env.NODE_ENV === 'test'}
            cacheOverflowSize={30}
            maxConcurrentDatasourceRequests={1}
            rowMultiSelectWithClick
            sideBar={this.sideBarSettings()}
            enableColResizerowSelection={'multiple'}
            onRowClicked={e => onRowClicked && onRowClicked(e)}
            onRowSelected={e => onRowSelected && onRowSelected(e)}
            onSelectionChanged={() => onSelectionChanged && onSelectionChanged(this.state.agGrid.api.getSelectedRows())}
            onGridReady={this.onGridReady}
            onDisplayedColumnsChanged={this.saveWindow}
            onColumnResized={this.saveWindow}
            onFirstDataRendered={this.restoreWindow}
            gridOptions={{ ...gridOptions, suppressPropertyNamesCheck: true }}
            rowHeight={22}
            headerHeight={22}
            getContextMenuItems={this.props.getContextMenuItems || getDefaultContextMenuItems}
            onCellClicked={onCellClicked}
            overlayLoadingTemplate={this.props.overlayLoadingTemplate}
          />
        </div>
      </div>
    );
  }
}


AgGridInfinite.propTypes = {
  onRowClicked: PropTypes.func,
  onRowSelected: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onCellClicked: PropTypes.func,
  gridOptions: PropTypes.any,
  rowSelection: PropTypes.string,
  agGridKey: PropTypes.string,
  columnDefinitions: PropTypes.array.isRequired,
  deselectAll: PropTypes.bool,
  clearSelection: PropTypes.func,
  disableSelection: PropTypes.bool,
  selectionSuppressedColumns: PropTypes.arrayOf(PropTypes.string)
};
