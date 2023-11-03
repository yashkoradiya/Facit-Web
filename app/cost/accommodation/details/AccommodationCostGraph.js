import React, { useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { colourPalette } from '../../../components/styled/defaults';
import { getDateFormat } from '../../../helpers/dateHelper';

ChartJS.register(...registerables);
export default function AccommodationCostGraph({ data, currency }) {
  const graphData = useMemo(() => transformToGraphData(data, currency), [data, currency]);
  const graphOptions = useMemo(() => getGraphOptions(currency), [currency]);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <Line data={graphData} options={graphOptions} />
    </div>
  );
}

const transformToGraphData = (data, currency) => {
  let datasets = data.map((roomTypeData, index) => {
    let data = [];
    roomTypeData.calculatedCostPeriods.forEach(costPeriod => {
      const value = costPeriod.value.values[currency];
      const dates = getDaysInDatePeriod(costPeriod.from, costPeriod.to);

      dates.forEach(date => {
        data.push({
          x: moment(date).format('YYYY-MM-DD'),
          y: value
        });
      });
    });

    return {
      label: roomTypeData.roomCode,
      key: roomTypeData.id,
      data: data,
      fill: false,
      lineTension: 0.03,
      borderColor: `#${colourPalette[index % colourPalette.length]}`,
      backgroundColor: `#${colourPalette[index % colourPalette.length]}`,
      pointBorderColor: `#${colourPalette[index % colourPalette.length]}`,
      pointBorderWidth: 1,
      pointRadius: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: `#${colourPalette[index % colourPalette.length]}`,
      pointHoverBorderColor: `#${colourPalette[index % colourPalette.length]}`
    };
  });

  return {
    datasets: datasets
  };
};

const getDaysInDatePeriod = (startDate, endDate) => {
  const dates = [];

  const currDate = moment(startDate).startOf('day');
  const lastDate = moment(endDate).startOf('day');

  while (currDate.diff(lastDate) <= 0) {
    dates.push(currDate.clone());
    currDate.add(1, 'days');
  }

  return dates;
};

const getBeforeLabelCallback = () => tooltipItem => {
  const dataset = tooltipItem.dataset;
  const tooltip = [dataset.label];

  return tooltip;
};

const round = value => Math.round(value * 100) / 100;

const getGraphOptions = currency => {
  return {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          displayFormats: {
            week: 'd MMM'
          }
        }
      }
    },
    plugins: {
      legend: false,
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: tooltipItem => {
            if (tooltipItem.length === 0) return;
            const dataset = tooltipItem[0].dataset;
            const cost = `Cost: ${round(dataset.data[tooltipItem[0].dataIndex].y)} ${currency}`;
            return moment(new Date(tooltipItem[0].raw.x)).format(getDateFormat()) + '\n' + cost + ' \nPPPN';
          },
          beforeLabel: getBeforeLabelCallback(currency), //TODO handle currency
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
