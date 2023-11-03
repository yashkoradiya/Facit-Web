import React from 'react';
import { fromJS } from 'immutable';
import moment from 'moment';
import { colourPalette } from 'components/styled/defaults';

const ACCOMMODATION_ONLY = 'ACCOMMODATION_ONLY';
const FLY_AND_STAY = 'FLY_AND_STAY';

/**
 * Returns an Array of Product Types values
 */
export const ProductTypeValues = [FLY_AND_STAY, ACCOMMODATION_ONLY];
export const charterProductTypes = [FLY_AND_STAY];

/**
 * Returns the selected product type count
 */
export const getProductTypeCount = (selectedItems = [], productTypes = []) => {
  if (selectedItems.length === 1) {
    return 1;
  } else {
    return productTypes.length;
  }
};

export const getLastPublishedByProduct = (publishStatus, selectedItems = [], productTypes = []) => {
  const fsPublishStatus = (
    <div>
      <p>{publishStatus.lastPublishedFS} (FS)</p>
    </div>
  );

  const aoPublishStatus = (
    <div>
      <p>{publishStatus.lastPublishedAO} (AO)</p>
    </div>
  );

  if (selectedItems.length === 1) {
    if (selectedItems[0] === '0') {
      return fsPublishStatus;
    } else {
      return aoPublishStatus;
    }
  } else if (productTypes.length === 1) {
    if (productTypes[0] === FLY_AND_STAY) {
      return fsPublishStatus;
    } else {
      return aoPublishStatus;
    }
  } else {
    return (
      <div>
        <p>{publishStatus.lastPublishedAO} (AO)</p>
        <p>{publishStatus.lastPublishedFS} (FS)</p>
      </div>
    );
  }
};
export const getLastEvaluateByProduct = (evaluateStatus, selectedItems = [], productTypes = []) => {
  const fsEvaluateStatus = (
    <div>
      <p>{evaluateStatus.lastEvaluatedFS} (FS)</p>
    </div>
  );

  const aoEvaluateStatus = (
    <div>
      <p>{evaluateStatus.lastEvaluatedAO} (AO)</p>
    </div>
  );

  if (selectedItems.length === 1) {
    if (selectedItems[0] === '0') {
      return fsEvaluateStatus;
    } else {
      return aoEvaluateStatus;
    }
  } else if (productTypes.length === 1) {
    if (productTypes[0] === FLY_AND_STAY) {
      return fsEvaluateStatus;
    } else {
      return aoEvaluateStatus;
    }
  } else {
    return (
      <div>
        <p>{evaluateStatus.lastEvaluatedAO} (AO)</p>
        <p>{evaluateStatus.lastEvaluatedFS} (FS)</p>
      </div>
    );
  }
};

/**
 * Returns an array of tooltip data.
 */
export const getProductTypeTooltip = (selectedItems = [], productTypes = [], key = '') => {
  if (selectedItems.length === 1) {
    return toolTip(ProductTypeValues[selectedItems[0]], key);
  } else {
    return productTypes.map(item => toolTip(item, key));
  }
};

const toolTip = (title, key) => <div key={`pt_${title}_${key}`}>{title}</div>;

/**
 * Returns the selected product type values as array.
 */
export const getProductTypeValues = (selectedProductType = []) => {
  if (selectedProductType.length === 1) {
    return [ProductTypeValues[selectedProductType[0]]];
  } else {
    return ProductTypeValues;
  }
};

/**
 * Returns flight related product types.
 */
export const getFlighProductTypes = (productTypes = []) => {
  return productTypes.filter(item => charterProductTypes.includes(item.name));
};

/**
 * Returns Immutable Map data by mutating resorts.
 */
export const getMutatedGeographyData = (resorts, geoData) => {
  const mutatedGeoData = geoData.toJS();
  return fromJS({ ...mutatedGeoData, resorts });
};

/**
 * Returns sorted number values.
 * @param {String} keyDurations
 * @returns String
 */
export const sortKeyDurations = (keyDurations = '') => {
  return keyDurations
    .split(',')
    .filter(i => Boolean(i.trim()))
    .sort((a, b) => a - b)
    .toString();
};

/**
 * Returns the minimum date from the datasets data.
 * @param {Array} datasets
 * @returns
 */
export const getMinDate = (datasets = []) => {
  const startDates = [];
  datasets.forEach(dataset => {
    if (dataset.data && dataset.data[0]) {
      startDates.push(moment(dataset.data[0].x));
    }
  });

  return moment.min(startDates);
};

/**
 * Returns the maximum date from the datasets data.
 * @param {Array} datasets
 * @returns
 */
export const getMaxDate = (datasets = []) => {
  const dates = [];
  datasets.forEach(dataset => {
    const maxdata = dataset.data.length - 1;
    if (dataset.data && dataset.data[maxdata]) {
      dates.push(moment(dataset.data[maxdata].x));
    }
  });
  return moment.max(dates);
};

/**
 * Common styles used for Bar graph
 */
export const BarGraphStylingOptions = {
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

export const mapBarStyles = (datasets = []) => {
  return datasets.map((item, idx) => {
    const styles = BarGraphStylingOptions;
    styles.backgroundColor = `#${colourPalette[idx % colourPalette.length]}`;
    styles.borderColor = `#${colourPalette[idx % colourPalette.length]}`;
    styles.pointBorderColor = `#${colourPalette[idx % colourPalette.length]}`;
    styles.pointHoverBackgroundColor = `#${colourPalette[idx % colourPalette.length]}`;
    styles.pointHoverBorderColor = `#${colourPalette[idx % colourPalette.length]}`;
    return Object.assign(item, styles);
  });
};

/**
 * A helper function for mutating the dataset for including line graph, if there is no dataset available.
 * @param {Array} datasets 
 */
export function appendLineXDatasetIfDoesntExist(datasets) {
  const lineXExists = datasets.some(dataset => dataset.xAxisID === 'line-x');
  if (!lineXExists) {
    datasets.push({
      label: '',
      data: [],
      fill: false,
      type: 'scatter',
      xAxisID: 'line-x'
    });
  }
}

/**
 * Filters datasets based on the age category
 * @param {Array} datasets
 * @param {Object} ageCategory
 * @returns
 */
export const filterDatasetsByAgeCategory = (datasets, ageCategory) => {
  let filteredDatasets = datasets;
  if (!ageCategory.adult) {
    filteredDatasets = filteredDatasets.filter(x => x.metadata.ageCategoryType !== 'Adult');
  }
  if (!ageCategory.child) {
    filteredDatasets = filteredDatasets.filter(x => !x.metadata.ageCategoryType?.toLowerCase().startsWith('child'));
  }
  if (!ageCategory.infant) {
    filteredDatasets = filteredDatasets.filter(x => x.metadata.ageCategoryType !== 'Infant');
  }
  return filteredDatasets;
};

/**
 * An utility function to get min/max date from list of dates.
 * @param {Array} values
 * @param {String} op
 * @returns
 */
export const getMinMaxDate = (values = [], op = '') => {
  if (!values.length || !op) return;
  if (op === 'min') {
    return moment.min(values.map(value => moment(value.date)));
  } else {
    return moment.max(values.map(value => moment(value.date)));
  }
};

/**
 * An utility function to get dates from range.
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
export const getDatesFromRange = (startDate, endDate) => {
  let dates = [],
    currentDate = startDate;

  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};
