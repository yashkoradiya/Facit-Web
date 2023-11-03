import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox } from 'components/styled/Layout';
import { mapBarStyles } from 'packaging/packaging-utils';

ChartTile.propTypes = {
  items: PropTypes.array,
  onTileSelected: PropTypes.func.isRequired,
  selectedChartIds: PropTypes.array.isRequired
};

ChartTile.defaultProps = {
  items: [],
  selectedChartIds: [],
  onTileSelected: () => {}
};

export default function ChartTile(props) {
  const mappedDatasets = mapBarStyles(props.items);
  return (
    <Flexbox width={props.width} data-testid="chart-tile-container" direction="column" alignItems="normal">
      {mappedDatasets.map(item => {
        const isSelected = props.selectedChartIds.find(chart => chart.key === item.key)?.selected;
        return (
          <Flexbox key={item.key} onClick={() => props.onTileSelected(item.key)}>
            <div
              className={`graphCheckbox ${isSelected ? 'selected' : null}`}
              style={{
                borderColor: item.backgroundColor,
                backgroundColor: isSelected ? item.backgroundColor : 'white'
              }}
              id={item.key}
            />
            <label className={'graphCheckboxLabel'}>{item.label}</label>
          </Flexbox>
        );
      })}
    </Flexbox>
  );
}
