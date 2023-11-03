import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { colourPalette } from '../../components/styled/defaults';
import { getDateFormat } from '../../helpers/dateHelper';

import moment from 'moment';

const percentageAxisId = 'y-axis-percentage';
const absoluteAxisId = 'y-axis-absolute';

const ErrorBox = styled.div`
  background-color: rgb(255, 255, 255);
  border: 2px dashed #efede7;
  padding: 20px 20px;
  margin-top: 8px;
  border-radius: 3px;
  width: 100%;
  height: 100px;
`;

const ErrorTitle = styled.h4`
  text-align: left;
  margin-block-start: 0.33em;
  margin-block-end: 0.33em;
  color: rgba(255, 0, 0, 0.6);
`;

const ErrorDescription = styled.label`
  font-size: 14px;
  text-align: left;
  color: rgba(255, 0, 0, 0.6);
`;

class MarginBandsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueDefinitions: []
    };
  }

  componentDidMount() {
    this.setState({
      valueDefinitions: this.props.valueDefinitions.map(definition => {
        let valueType = definition.valueType;
        let title = definition.title;

        if (valueType === 'Percentage') {
          title = `${title} %`;
        }

        return {
          id: definition.id,
          title: title,
          valueType: valueType
        };
      })
    });
  }

  buildDatasets() {
    let datasets = this.state.valueDefinitions.map((valueDefinition, index) => {
      let data = [];

      let isPercentage = valueDefinition.valueType === 'Percentage';

      this.props.marginBands.forEach(marginBand => {
        let value = null;
        const existingValue = marginBand.values.find(obj => obj.valueDefinitionId === valueDefinition.id);

        if (existingValue) {
          value = existingValue.value;

          if (isPercentage) {
            value = (value * 100).toFixed(2);
          }
        }

        if (!marginBand.from || !marginBand.to) return;

        data.push({
          x: marginBand.from.format('YYYY-MM-DD'),
          y: value
        });

        if (marginBand.to) {
          data.push({
            x: marginBand.to.clone().add(1, 'day').subtract(1, 'second').format('YYYY-MM-DD'),
            y: value
          });
        }
      });
      let dataset = {
        key: valueDefinition.id,
        label: valueDefinition.title,
        fill: false,
        lineTension: 0.03,
        borderColor: `#${colourPalette[index % colourPalette.length]}`,
        backgroundColor: `#${colourPalette[index % colourPalette.length]}`,
        pointHoverRadius: 5,
        pointHitRadius: 5,
        data: data
      };

      if (isPercentage) {
        dataset.yAxisID = percentageAxisId;
        dataset.borderDash = [10, 2];
      } else {
        dataset.yAxisID = absoluteAxisId;
      }

      return dataset;
    });

    return datasets;
  }

  getMaxValue(datasets) {
    if (datasets.length < 1) return null;

    return Math.max(
      ...datasets.map(dataset => {
        return Math.max(...dataset.data.map(dataPoint => dataPoint.y));
      })
    );
  }

  render() {
    const data = {
      datasets: this.buildDatasets()
    };

    const errorMessage = this.props.errorMessage;

    let maxPercentageValue = this.getMaxValue(data.datasets.filter(x => x.yAxisID === percentageAxisId));
    let showPercentageAxis = maxPercentageValue !== null;

    let maxAbsoluteValue = this.getMaxValue(data.datasets.filter(x => x.yAxisID === absoluteAxisId));
    let showAbsoluteAxis = maxAbsoluteValue !== null;

    const options = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month'
          }
        },

        'y-axis-absolute': {
          position: 'left',
          display: showAbsoluteAxis,
          ticks: {
            callback: value => `${value} ${this.props.selectedCurrency.toUpperCase()}`
          },
          suggestedMin: 0,
          suggestedMax: maxAbsoluteValue + 10
        },
        'y-axis-percentage': {
          position: showAbsoluteAxis ? 'right' : 'left',
          display: showPercentageAxis,
          gridLines: {
            drawOnChartArea: !showAbsoluteAxis // only show grid lines if absolute axis is hidden, only want the grid lines for one axis at a time
          },
          ticks: {
            stepSize: 5,
            callback: value => `${value}%`
          },
          suggestedMin: 0,
          suggestedMax: maxPercentageValue + 5
        }
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: tooltipItem => {
              if (tooltipItem.length === 0) return;
              return `${moment(tooltipItem[0].raw.x).format(getDateFormat())}`;
            },
            label: tooltipItem => {
              const dataset = tooltipItem.dataset;
              let label = dataset.label || '';
              let isPercentage = dataset.yAxisID === percentageAxisId;

              if (isPercentage) {
                label = `${label}: ${tooltipItem.raw.y}%`;
              } else {
                label = `${label}: ${tooltipItem.raw.y} ${this.props.selectedCurrency.toUpperCase()}`;
              }

              return label;
            }
          }
        },
        hover: {
          mode: 'y'
        }
      }
    };
    if (errorMessage) {
      return (
        <ErrorBox>
          <i
            className="material-icons"
            style={{ marginRight: '8px', fontSize: '40px', float: 'left', color: 'rgba(255, 0, 0, 0.6)' }}
          >
            error
          </i>
          <ErrorTitle>Unable to display graph</ErrorTitle>
          <ErrorDescription>- Please correct date band errors</ErrorDescription>
        </ErrorBox>
      );
    } else {
      return (
        <Line height={this.props.height} data={data} options={options} datasetKeyProvider={dataset => dataset.key} />
      );
    }
  }
}

MarginBandsGraph.propTypes = {
  valueDefinitions: PropTypes.array.isRequired,
  marginBands: PropTypes.array,
  selectedCurrency: PropTypes.string.isRequired,
  errorMessage: PropTypes.bool
};

MarginBandsGraph.defaultProps = {
  marginBands: []
};

export default MarginBandsGraph;
