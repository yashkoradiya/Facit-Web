import React from 'react';
import moment from 'moment';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getDateFormat } from '../../../../helpers/dateHelper';

ChartJS.register(...registerables);

const options = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month'
      }
    },
    y: {
      ticks: {
        stepSize: 5,
        callback: value => `${value}%`
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: tooltipItem => {
          return moment(tooltipItem.label).format(getDateFormat());
        },
        label: tooltipItem => {
          return `${tooltipItem.raw}%`;
        }
      }
    }
  }
};

const datasetOptions = {
  fill: true,
  lineTension: 0.03,
  backgroundColor: 'rgba(75,192,192,0.4)',
  borderColor: 'rgba(75,192,192,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(75,192,192,1)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10
};
export default class PhasingPeriodGraph extends React.PureComponent {
  render() {
    const height = this.props.height ? this.props.height : 100;
    let data = this.props.data;

    if (!data || data.size === 0) return null;

    data = data.toJS();
    data.datasets[0] = Object.assign(data.datasets[0], datasetOptions);

    return <Line height={height} data={data} options={options} />;
  }
}
