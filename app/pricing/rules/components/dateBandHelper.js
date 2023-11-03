import moment from 'moment';
import * as numberHelper from '../../../helpers/numberHelper';
import * as stringHelper from '../../../helpers/stringHelper';
import { v4 as uuidv4 } from 'uuid';


export const isValidNumber = value => {
  if (stringHelper.isEmpty(value)) return false;
  return numberHelper.isNumber(value);
};

export const isValidOptionalNumber = value => {
  if (!value || (stringHelper.isEmpty(value) && stringHelper.isString(value))) return true;
  return numberHelper.isNumber(value);
};

const getDate = date => {
  return !moment.isMoment(date) ? moment(date) : date;
};

export const isValidDate = date => {
  if (!date) return false;
  date = getDate(date);
  return date.isValid();
};

export const isValidDateRange = (fromDate, toDate) => {
  if (!isValidDate(fromDate) || !isValidDate(toDate)) return false;

  fromDate = getDate(fromDate);
  toDate = getDate(toDate);
  return fromDate.isSameOrBefore(toDate);
};

export const getStartAndEndDate = dateRanges => {
  if (!dateRanges || dateRanges.length === 0) return null;

  dateRanges.sort((a, b) => a.from - b.from);
  return {
    from: dateRanges[0].from,
    to: dateRanges[dateRanges.length - 1].to
  };
};

export const dateRangesAreAdjacent = (range1, range2) => {
  if (!range1 || !range2) return false;
  const range1From = getDate(range1.from).clone();
  const range1To = getDate(range1.to).clone();
  const range2From = getDate(range2.from);
  const range2To = getDate(range2.to);
  if (range1From.subtract(1, 'days').isSame(range2To, 'day')) return true;
  return range1To.add(1, 'days').isSame(range2From, 'day');
};

export const dateRangesAreNested = (range1, range2) => {
  if (!range1 || !range1.from || !range1.to) return false;
  if (!range2 || !range2.from || !range2.to) return false;

  if (range1.from.isBetween(range2.from, range2.to, 'day', '[]')) return true;
  if (range1.to.isBetween(range2.from, range2.to, 'day', '[]')) return true;
  if (
    range2.from.isBetween(range1.from, range1.to, 'day', '[]') &&
    range2.to.isBetween(range1.from, range1.to, 'day', '[]')
  )
    return true;
  return false;
};

export const dateRangeAlreadyExists = (dateBand, existingDateBands) => {
  const existingDateBand = existingDateBands.find(
    item => item.from.isSame(dateBand.from, 'day') && item.to.isSame(dateBand.to, 'day')
  );
  return !!existingDateBand;
};

export const updateDateBand = (dateBand, dateBands) => {
  const updatedDateBands = dateBands.map(item => {
    if (item.from.isSame(dateBand.from, 'day') && item.to.isSame(dateBand.to, 'day')) {
      return dateBand;
    }
    return item;
  });
  return updatedDateBands;
};

export const willRemoveDateBands = (newDateBand, dateBands) => {
  if (dateBands.length === 0) {
    return false;
  }
  dateBands.sort((a, b) => a.from - b.from);

  const spannedRanges = dateBands.reduce((ranges, item) => {
    if (newDateBand.from.isSameOrBefore(item.from, 'day') && ranges === null) {
      ranges = 1;
    }
    if (newDateBand.from.isSameOrBefore(item.to, 'day') && ranges === null) {
      ranges = 0;
    }
    if (newDateBand.to.isSameOrAfter(item.to, 'day') && ranges !== null) {
      ranges++;
    }
    return ranges;
  }, null);

  return spannedRanges > 1;
};

export const hasOneDaySpans = dateBands => {
  const oneDaySpans = dateBands.filter(item => item.from && item.to && item.from.isSame(item.to, 'day'));
  return oneDaySpans.length > 0;
};

export const hasDateBandGaps = dateBands => {
  const validator = dateBands.reduce(
    (validator, dateBand) => {
      const currentFromDate = dateBand.from.clone();
      const currentToDate = dateBand.to.clone();
      if (validator.previousDate !== null) {
        validator.hasGaps = validator.hasGaps || !validator.previousDate.add(1, 'days').isSame(currentFromDate, 'day');
      }
      validator.previousDate = currentToDate;
      return validator;
    },
    { previousDate: null, hasGaps: false }
  );

  return validator.hasGaps;
};

export const insertDateBand = (newDateBand, dateBands) => {
  if (dateBands.length === 0) {
    return [newDateBand];
  }
  dateBands.sort((a, b) => a.from - b.from);
  const dayAfterNewDateBand = newDateBand.to.clone().add(1, 'days');
  const dayBeforeNewDateBand = newDateBand.from.clone().subtract(1, 'days');

  const validator = dateBands.reduce(
    (validator, item, index) => {
      let shouldCreateNewuuidv4ForNextDateBand = false;
      if (newDateBand.from.isBefore(item.from, 'day') && index === 0) {
        validator.dateBands = [...validator.dateBands, newDateBand];
        validator.newDateBandStarted = true;
      }
      if (!validator.newDateBandStarted && newDateBand.from.isSameOrBefore(item.to, 'day')) {
        if (newDateBand.from.isSameOrBefore(item.from, 'day')) {
          validator.dateBands = [...validator.dateBands, newDateBand];
        } else {
          validator.dateBands = [
            ...validator.dateBands,
            { ...item, to: dayBeforeNewDateBand, key: item.key || uuidv4() },
            newDateBand
          ];
          shouldCreateNewuuidv4ForNextDateBand = true;
        }
        validator.newDateBandStarted = true;
      }
      if (validator.newDateBandStarted && !validator.newDateBandEnded) {
        if (newDateBand.to.isSame(item.to, 'day')) {
          validator.newDateBandEnded = true;
        }
        if (newDateBand.to.isBefore(item.to, 'day')) {
          validator.dateBands = [
            ...validator.dateBands,
            { ...item, key: shouldCreateNewuuidv4ForNextDateBand ? uuidv4() : item.key, from: dayAfterNewDateBand }
          ];
          validator.newDateBandEnded = true;
        }
      }
      if (newDateBand.to.isBefore(item.from, 'day') || newDateBand.from.isAfter(item.to, 'day')) {
        if (!validator.dateBands.some(x => x.key === item.key)) {
          validator.dateBands = [...validator.dateBands, item];
        }
      }
      return validator;
    },
    { newDateBandStarted: false, newDateBandEnded: false, dateBands: [] }
  );

  return validator.dateBands;
};

export const updateDateBandDurationGroups = (dateBand, durationGroups) => {
  const values = durationGroups.flatMap(d => {
    const valuesWithDurationGroup = dateBand.values.filter(x => x.durationGroup.key === d.key);

    let updatedValues = [];
    if (valuesWithDurationGroup.length === 0) {
      const valuesToCopy = getDurationGroupDefaultValues(dateBand);
      updatedValues = valuesToCopy.map(x => ({
        ...x,
        value: null,
        durationGroup: d
      }));
    } else {
      updatedValues = valuesWithDurationGroup.map(x => ({ ...x, durationGroup: d }));
    }

    return updatedValues;
  });

  return {
    ...dateBand,
    values: values
  };
};

const getDurationGroupDefaultValues = dateBand => {
  // Return the first durationGroups values to get a "default" to copy
  const group = dateBand.values[0].durationGroup;
  const valuesToCopy = dateBand.values.filter(x => x.durationGroup.key === group.key);

  return valuesToCopy;
};

const getDateBandRanges = dateBands => {
  if (!dateBands || dateBands.length === 0) return [];

  dateBands.sort((a, b) => a.from - b.from);
  return dateBands.map(item => ({
    from: item.from,
    to: item.to
  }));
};

export const handleNestedDateBands = (editedDateBand, allDateBands) => {
  const dateBandsWithoutEditedDateBand = allDateBands.filter(f => f.key !== editedDateBand.key);
  const totalDateBandRange = getStartAndEndDate(getDateBandRanges(dateBandsWithoutEditedDateBand));

  if (dateRangesAreNested(editedDateBand, totalDateBandRange)) {
    const newDateBands = insertDateBand(editedDateBand, dateBandsWithoutEditedDateBand);
    return [newDateBands, true];
  }

  return [allDateBands.sort((a, b) => a.from - b.from), false];
};
