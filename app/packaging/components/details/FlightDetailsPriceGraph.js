import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { colourPalette } from 'components/styled/defaults';
import { Flexbox } from 'components/styled/Layout';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import PackagePriceDetailsFilters from './PackagePriceDetailsFilters';
import { getDateFormat } from 'helpers/dateHelper';
import { appendLineXDatasetIfDoesntExist } from 'packaging/packaging-utils';

ChartJS.register(...registerables);

let datasetOptions = {
  fill: false,
  lineTension: 0.03,
  backgroundColor: 'rgba(75,192,192,0.4)',
  borderColor: 'rgba(75,192,192,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'transparent',
  pointBackgroundColor: 'transparent',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  showLine: true
};

class FlightDetailsPriceGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChartIds: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newThings = [];
    nextProps.data.datasets.forEach((x, index) => {
      datasetOptions.backgroundColor = `#${colourPalette[index % colourPalette.length]}`;
      datasetOptions.borderColor = `#${colourPalette[index % colourPalette.length]}`;
      datasetOptions.pointBorderColor = `#${colourPalette[index % colourPalette.length]}`;
      datasetOptions.pointHoverBackgroundColor = `#${colourPalette[index % colourPalette.length]}`;
      datasetOptions.pointHoverBorderColor = `#${colourPalette[index % colourPalette.length]}`;
      Object.assign(x, datasetOptions);

      if (!prevState.selectedChartIds.some(y => y.key === x.key)) {
        newThings.push({ key: x.key, selected: x.selected });
      }
    });

    return {
      selectedChartIds: [...prevState.selectedChartIds, ...newThings]
    };
  }

  getMinDate = datasets => {
    const startDates = [];
    datasets.forEach(dataset => {
      if (dataset.data && dataset.data[0]) {
        startDates.push(moment(dataset.data[0].x));
      }
    });
    return moment.min(startDates);
  };
  getMaxDate = datasets => {
    const startDates = [];
    datasets.forEach(dataset => {
      const maxdata = dataset.data.length - 1;
      if (dataset.data && dataset.data[maxdata]) {
        startDates.push(moment(dataset.data[maxdata].x));
      }
    });
    return moment.max(startDates);
  };

  getStepSizeY = values => {
    const max = Math.max(...values);
    const step = Math.pow(10, Math.ceil(Math.log10(max))) / 10;

    return step;
  };

  getChartMax = values => {
    const max = Math.max(...values);
    const step = this.getStepSizeY(values);
    const chartMaxY = Math.ceil(max / step) * step;

    return chartMaxY;
  };

  legendClick = key => {
    const { selectedChartIds } = this.state;
    const updatedChartIds = selectedChartIds.map(x => (x.key === key ? { ...x, selected: !x.selected } : x));

    this.setState({ selectedChartIds: updatedChartIds }, () => this.props.onLegendSelectionChanged(updatedChartIds));
  };

  getBeforeLabelCallback = currency => tooltipItem => {
    const dataset = tooltipItem.dataset;
    return [
      `${dataset.metadata.sourceMarketId} - ${dataset.metadata.transportCode}, ${dataset.metadata.departureAirport}, ${dataset.metadata.ageCategoryType}, ${dataset.seatClassesName}`,
      `Price: ${Math.ceil(tooltipItem.raw.y)} ${currency}`,
      `Cost: ${Math.ceil(dataset.data[tooltipItem.dataIndex].cost)} ${currency}`
    ];
  };

  getDataset = data => {
    let dataSets = data.datasets.filter(x => this.state.selectedChartIds.some(y => y.key === x.key && y.selected));
    dataSets = this.getFilterAgeSettings(dataSets);
    const moneyDatasets = dataSets.map(ds => {
      return {
        ...ds,
        type: 'scatter',
        xAxisID: 'line-x',
        data: ds.data.map(dataPoint => {
          return {
            x: moment(dataPoint.date).format('YYYY-MM-DD'),
            y: this.round(dataPoint.price.values[this.props.selectedCurrency.toUpperCase()]),
            cost: this.round(this.getCost(dataPoint))
          };
        })
      };
    });
    return moneyDatasets;
  };

  round = value => Math.round(value * 100) / 100;

  getCost = dataPoint => {
    const currency = this.props.selectedCurrency.toUpperCase();
    const calculatedCost = dataPoint.calculatedCost.values[currency];
    return calculatedCost;
  };

  getBarDataset = max => {
    const data = this.props.selectedDates
      .filter((date, i, a) => a.findIndex(x => x.toDateString() === date.toDateString()) === i)
      .map(date => ({
        x: date,
        y: max
      }))
      .sort((a, b) => {
        if (a.x > b.x) return 1;
        if (b.x > a.x) return -1;
        return 0;
      });
    return {
      label: 'Selected Dates',
      type: 'bar',
      data: data,
      fill: false,
      backgroundColor: 'rgba(194,230,250, 0.5)',
      xAxisID: 'bar-x'
    };
  };

  handleShowAdultPrices = show => {
    this.props.onShowAgeCategoryPricesChanged(this.props.showAgeCategoryPrices.child, show);
  };

  handleShowChildPrices = show => {
    this.props.onShowAgeCategoryPricesChanged(this.props.showAgeCategoryPrices.adult, show);
  };

  handleShowEconomyPrices = show => {
    this.props.onShowSeatCategoryPricesChanged(
      show,
      this.props.showSeatCategoryPrices.comfort,
      this.props.showSeatCategoryPrices.premium
    );
  };

  handleShowComfortPrices = show => {
    this.props.onShowSeatCategoryPricesChanged(
      this.props.showSeatCategoryPrices.economy,
      show,
      this.props.showSeatCategoryPrices.premium
    );
  };

  handleShowPremiumPrices = show => {
    this.props.onShowSeatCategoryPricesChanged(
      this.props.showSeatCategoryPrices.economy,
      this.props.showSeatCategoryPrices.comfort,
      show
    );
  };

  getFilterAgeSettings = datasets => {
    const { showAgeCategoryPrices, showSeatCategoryPrices } = this.props;
    let filteredDatasets = datasets;
    if (!showAgeCategoryPrices.adult && !showAgeCategoryPrices.child) {
      filteredDatasets = filteredDatasets.filter(x => x.metadata.ageCategoryType !== 'Adult & Child');
    }
    // if (!showAgeCategoryPrices.child) {
    //   filteredDatasets = filteredDatasets.filter(x => !x.metadata.ageCategoryType.includes('Child'));
    // }
    const economyClass = datasets.filter(x => x.seatClassesName === 'Economy');
    if (!showSeatCategoryPrices.economy && economyClass.length > 0) {
      filteredDatasets = filteredDatasets.filter(x => x.seatClassesName !== 'Economy');
    }
    const premiumClass = datasets.filter(x => x.seatClassesName === 'Premium');
    if (!showSeatCategoryPrices.premium && premiumClass.length > 0) {
      filteredDatasets = filteredDatasets.filter(x => !x.seatClassesName.includes('Premium'));
    }
    const comfortClass = datasets.filter(x => x.seatClassesName === 'Comfort');
    if (!showSeatCategoryPrices.comfort && comfortClass.length > 0) {
      filteredDatasets = filteredDatasets.filter(x => !x.seatClassesName.includes('Comfort'));
    }
    return filteredDatasets;
  };

  render() {
    const { selectedChartIds } = this.state;
    const { data, selectedCurrency, showAgeCategoryPrices, showSeatCategoryPrices } = this.props;
    if (!data) return null;
    const moneyDatasets = this.getDataset(data);
    const values = moneyDatasets.flatMap(dataset => dataset.data.map(data => data.y));

    let datasets = [];
    let barDatasetIndex = -1;
    if (this.props.selectedDates) {
      const barDataset = this.getBarDataset(this.getChartMax(values));
      barDatasetIndex = moneyDatasets.length;
      datasets = [...moneyDatasets, barDataset];
    } else {
      datasets = moneyDatasets;
    }
    appendLineXDatasetIfDoesntExist(datasets);
    const minDate = this.getMinDate(datasets);
    const maxDate = this.getMaxDate(datasets);
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        'line-x': {
          type: 'time',
          time: {
            min: minDate,
            max: maxDate,
            unit: 'day',
            unitStepSize: 1000,
            displayFormats: {
              month: 'dd'
            }
          }
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
            stepSize: this.getStepSizeY(values),
            callback: value => `${value}`
          }
          // min: 500,
          // max: 1000
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
            beforeLabel: this.getBeforeLabelCallback(selectedCurrency),
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

    const filteredDatasets = this.getFilterAgeSettings(data.datasets);

    return (
      <Flexbox direction={'column'} alignItems="left" width={'100%'}>
        <Flexbox direction={'row'} justifyContent={'space-between'} alignItems="flex-end">
          <Flexbox alignItems={'flex-start'} style={{ marginTop: 6 }}>
            <Flexbox
              direction={'column'}
              alignItems={'flex-start'}
              style={{ marginRight: 100, marginBottom: 14, paddingLeft: 6 }}
            >
              {filteredDatasets.map(x => {
                const isSelected = selectedChartIds.find(y => y.key === x.key).selected;
                return (
                  <Flexbox
                    key={x.key}
                    onClick={() => this.legendClick(x.key)}
                    style={{ marginBottom: 6, maxWidth: 640 }}
                  >
                    <div
                      className={`graphCheckbox ${isSelected ? 'selected' : null}`}
                      style={{
                        borderColor: x.backgroundColor,
                        backgroundColor: isSelected ? x.backgroundColor : 'white'
                      }}
                      id={x.key}
                    />
                    <label className={'graphCheckboxLabel'}>{x.label}</label>
                  </Flexbox>
                );
              })}
            </Flexbox>
            <Flexbox direction="column">
              <InputCheckbox
                label="Adult & Child"
                style={{ marginBottom: 6 }}
                onChange={this.handleShowAdultPrices}
                checked={showAgeCategoryPrices.adult}
              />
              <InputCheckbox
                label="Child"
                onChange={this.handleShowChildPrices}
                checked={showAgeCategoryPrices.child}
                style={{ display: 'none' }}
              />
            </Flexbox>
          </Flexbox>
          <Flexbox style={{ marginRight: '23px', marginBottom: '6px', alignItems: 'flex-end' }} direction="column">
            <Flexbox childrenMarginRight="10px" justifyContent={'space-between'} width={'100%'}>
              <InputCheckbox
                label="Economy"
                style={{ marginLeft: 6 }}
                onChange={this.handleShowEconomyPrices}
                checked={showSeatCategoryPrices.economy}
              />
              <InputCheckbox
                label="Comfort"
                style={{ marginLeft: 6 }}
                onChange={this.handleShowComfortPrices}
                checked={showSeatCategoryPrices.comfort}
              />
              <InputCheckbox
                label="Premium"
                onChange={this.handleShowPremiumPrices}
                checked={showSeatCategoryPrices.premium}
              />
            </Flexbox>
          </Flexbox>

          <PackagePriceDetailsFilters
            duration={this.props.duration}
            durationValueChanged={this.props.durationValueChanged}
            onDurationBlur={this.props.onDurationBlur}
            packageType={this.props.packageType}
            bookingDate={this.props.bookingDate}
            onBookingDateChange={this.props.onBookingDateChange}
            onBookingDateBlur={this.props.onBookingDateBlur}
            simulationAge={this.props.simulationAge}
            onSimulationAgeChanged={this.props.onSimulationAgeChanged}
            onSimulationAgeBlur={this.props.onSimulationAgeBlur}
            simulationBed={this.props.simulationBed}
            onSimulationBedChanged={this.props.onSimulationBedChanged}
            onSimulationBedBlur={this.props.onSimulationBedBlur}
            onRefresh={this.props.onRefresh}
            outboundFlights={this.props.outboundFlights}
            homeboundFlights={this.props.homeboundFlights}
            selectedHomeBoundFlight={this.props.selectedHomeBoundFlight}
            selectedOutBoundFlight={this.props.selectedOutBoundFlight}
            onHomeboundFlightChange={this.props.onHomeboundFlightChange}
            onOutboundFlightChange={this.props.onOutboundFlightChange}
          />
        </Flexbox>
        {datasets.length > 0 && (
          <div style={{ height: '400px' }}>
            <Line options={options} data={{ datasets }} />
          </div>
        )}
      </Flexbox>
    );
  }
}

FlightDetailsPriceGraph.propTypes = {
  data: PropTypes.any.isRequired,
  durationValueChanged: PropTypes.func,
  duration: PropTypes.any.isRequired,
  onLegendSelectionChanged: PropTypes.func.isRequired,
  bookingDate: PropTypes.any,
  simulationAge: PropTypes.number,
  packageType: PropTypes.string,
  onRefresh: PropTypes.func
};

FlightDetailsPriceGraph.defaultProps = {
  onRefresh: () => {}
};

export default FlightDetailsPriceGraph;
