import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import { mapBarStyles, getMaxDate, getMinDate, appendLineXDatasetIfDoesntExist } from 'packaging/packaging-utils';
import { Flexbox } from 'components/styled/Layout';

PricesGraph.propTypes = {
  datasets: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  selectedDates: PropTypes.array.isRequired,
  selectedChartIds: PropTypes.array.isRequired
};

PricesGraph.defaultProps = {
  datasets: [],
  selectedCurrency: '',
  selectedDates: [],
  selectedChartIds: []
};

ChartJS.register(...registerables);
export default function PricesGraph(props) {
  let filteredDatasets = props.datasets.filter(item =>
    props.selectedChartIds?.some(chart => chart.key === item.key && chart.selected)
  );

  const moneyDatasets = filteredDatasets.map(fDs => {
    const currency = props.selectedCurrency.toUpperCase();
    return {
      ...fDs,
      type: 'scatter',
      xAxisID: 'line-x',
      data: fDs.data.map(dataPoint => {
        switch (props.type) {
          case 'transfers':
            return {
              x: moment(dataPoint.date).format('YYYY-MM-DD'),
              y: getRoundedValue(dataPoint.transferPrice.values[currency]),
              cost: getRoundedValue(dataPoint.transferCost.values[currency])
            };
          case 'package': {
            const accommodationCost = dataPoint.accommodationCost.values[currency];
            const referenceFlightCost = dataPoint.referenceFlightCost
              ? dataPoint.referenceFlightCost.values[currency]
              : 0;
            const cost = accommodationCost + referenceFlightCost;

            return {
              x: moment(dataPoint.date).format('YYYY-MM-DD'),
              y: getRoundedValue(dataPoint.price.values[currency]),
              cost: getRoundedValue(cost)
            };
          }
        }
      })
    };
  });
  const values = moneyDatasets.flatMap(dataset => dataset.data.map(dd => dd.y));

  let barData = [];
  let barDatasetIndex = -1;

  if (props.selectedDates) {
    const templBarDataset = getBarDataset(values, props.selectedDates);
    barDatasetIndex = moneyDatasets.length;
    barData = [...mapBarStyles(moneyDatasets), templBarDataset];
  } else {
    barData = mapBarStyles(moneyDatasets);
  }
  appendLineXDatasetIfDoesntExist(barData);

  const minDate = getMinDate(barData);
  const maxDate = getMaxDate(barData);

  if (!props.selectedChartIds.length || !barData?.length) return null;

  return (
    <Flexbox direction={'column'} alignItems="left" width={'100%'}>
      <div style={{ height: '400px' }}>
        <Line
          data={{ datasets: barData }}
          options={getBarOptions(minDate, maxDate, barDatasetIndex, values, props.selectedCurrency, props.type)}
        />
      </div>
    </Flexbox>
  );
}

const getBarOptions = (minDate, maxDate, barDatasetIndex, values, currency, type) => {
  return {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      'line-x': {
        type: 'time',
        time: getXAxisTimeConfig(minDate, maxDate, type)
      },
      'bar-x': {
        type: 'time',
        time: {
          min: minDate,
          unit: 'day',
          unitStepSize: 1
        },
        categoryPercentage: 1,
        barPercentage: 1,
        display: false
      },
      y: {
        ticks: {
          stepSize: getStepSizeY(values),
          callback: value => `${value}`
        }
      }
    },
    elements: {
      line: {
        tension: 0
      }
    },
    animation: {
      duration: 0,
      resize: {
        duration: 0
      }
    },
    showLine: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: false,
      tooltip: {
        mode: 'nearest',
        intersect: false,
        filter: tooltip => {
          return tooltip.datasetIndex !== barDatasetIndex;
        },
        callbacks: {
          title: tooltipItem => {
            if (tooltipItem.length === 0) return;
            return moment(new Date(tooltipItem[0].raw.x)).format(getDateFormat());
          },
          beforeLabel: getBeforeLabelCallback(currency, type),
          label: () => null
        }
      },
      hover: {
        mode: 'nearest',
        animationDuration: 0,
        intersect: false
      }
    }
  };
};

const getXAxisTimeConfig = (minDate, maxDate, type) => {
  switch (type) {
    case 'transfers':
      return {
        min: minDate,
        max: maxDate,
        unit: 'day',
        unitStepSize: 1000,
        displayFormats: {
          month: 'dd'
        }
      };
    case 'package':
      return {
        min: minDate,
        unit: 'month',
        unitStepSize: 1,
        displayFormats: {
          month: 'MMM'
        }
      };
  }
};

const getBeforeLabelCallback = (currency, type) => tooltipItem => {
 const dataset = tooltipItem.dataset;
  switch (type) {
    case 'transfers': {
      const { sourceMarketId, ageCategoryType, salableUnitId, unitType } = dataset.metadata;

      return [
        `${sourceMarketId} - ${salableUnitId} ${ageCategoryType ? '- ' + ageCategoryType : ''} - ${unitType}`,
        `Price: ${Math.ceil(tooltipItem.raw.y)} ${currency}`,
        `Cost: ${Math.ceil(dataset.data[tooltipItem.dataIndex].cost)} ${currency}`
      ];
    }
    case 'package': {
      return [
        `${dataset.metadata.sourceMarketName} - ${dataset.metadata.accommodationName}, ${dataset.metadata.roomType}, ${dataset.metadata.ageCategoryType}`,
        `Classification: ${dataset.metadata.classification}`,
        `Price: ${Math.ceil(tooltipItem.raw.y)} ${currency}`,
        `Cost: ${Math.ceil(dataset.data[tooltipItem.dataIndex].cost)} ${currency}`
      ];
    }
  }
};

const getRoundedValue = value => Math.round(value * 100) / 100;

const getStepSizeY = values => {
  const max = Math.max(...values);
  return Math.pow(10, Math.ceil(Math.log10(max))) / 10;
};

const getChartMax = values => {
  const max = Math.max(...values);
  const step = getStepSizeY(values);
  return Math.ceil(max / step) * step;
};

const getBarDataset = (values, selectedDates) => {
  const dateData = selectedDates
    .filter((date, idx, self) => self.findIndex(item => item.toDateString() === date.toDateString()) === idx)
    .map(date => ({ x: date, y: getChartMax(values) }))
    .sort((a, b) => {
      if (a.x > b.x) return 1;
      if (b.x > a.x) return -1;
      return 0;
    });

  return {
    label: 'Selected Dates',
    type: 'bar',
    data: dateData,
    fill: false,
    backgroundColor: 'rgba(194,230,250, 0.5)',
    xAxisID: 'bar-x'
  };
};
