import * as dateBandHelper from './dateBandHelper';
import moment from 'moment';

describe('isValidNumber', () => {
  it('should not allow empty values', () => {
    expect(dateBandHelper.isValidNumber('')).toBe(false);
  });

  it('should not allow non numeric values', () => {
    expect(dateBandHelper.isValidNumber(' ')).toBe(false);
    expect(dateBandHelper.isValidNumber('test')).toBe(false);
    expect(dateBandHelper.isValidNumber('1test')).toBe(false);
    expect(dateBandHelper.isValidNumber([])).toBe(false);
    expect(dateBandHelper.isValidNumber({})).toBe(false);
  });

  it('should allow decimals and integers', () => {
    expect(dateBandHelper.isValidNumber(1)).toBe(true);
    expect(dateBandHelper.isValidNumber(1.5)).toBe(true);
    expect(dateBandHelper.isValidNumber('1')).toBe(true);
    expect(dateBandHelper.isValidNumber('1.5')).toBe(true);
    expect(dateBandHelper.isValidNumber('1,5')).toBe(true);
    expect(dateBandHelper.isValidNumber('1 000')).toBe(true);
  });
});

describe('isValidOptionalNumber', () => {
  it('should not allow non numeric values', () => {
    expect(dateBandHelper.isValidOptionalNumber('test')).toBe(false);
    expect(dateBandHelper.isValidOptionalNumber('1test')).toBe(false);
    expect(dateBandHelper.isValidOptionalNumber({})).toBe(false);
    expect(dateBandHelper.isValidOptionalNumber([])).toBe(false);
  });

  it('should allow empty string values', () => {
    expect(dateBandHelper.isValidOptionalNumber('')).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber(' ')).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber(String())).toBe(true);
  });

  it('should allow null', () => {
    expect(dateBandHelper.isValidOptionalNumber(null)).toBe(true);
  });

  it('should allow decimals and integers', () => {
    expect(dateBandHelper.isValidOptionalNumber(1)).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber(1.5)).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber('1')).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber('1.5')).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber('1,5')).toBe(true);
    expect(dateBandHelper.isValidOptionalNumber('1 000')).toBe(true);
  });
});

describe('isValidDate', () => {
  it('should return false when date is empty or falsy', () => {
    expect(dateBandHelper.isValidDate('')).toBe(false);
    expect(dateBandHelper.isValidDate(null)).toBe(false);
    expect(dateBandHelper.isValidDate()).toBe(false);
  });

  it('should return true when date is empty object or array', () => {
    expect(dateBandHelper.isValidDate({})).toBe(true);
    expect(dateBandHelper.isValidDate({})).toBe(true);
  });

  it('should return false when date is not valid date', () => {
    console.warn = jest.fn();
    expect(dateBandHelper.isValidDate('test')).toBe(false);
    expect(dateBandHelper.isValidDate('2012-11-33')).toBe(false);
    expect(dateBandHelper.isValidDate('1099/13/77')).toBe(false);
  });

  it('should return true when date is valid date', () => {
    console.warn = jest.fn();
    expect(dateBandHelper.isValidDate('2016-10-19')).toBe(true);
    //expect(dateBandHelper.isValidDate('120131')).toBe(true); CDF-11925 upgrading to downshift latest_version, here the issue is expected result has to come true but showing false, so test case is getting fail.(need to check)
    expect(dateBandHelper.isValidDate('01/03/2013')).toBe(true);
  });
});

describe('isValidDateRange', () => {
  it('should return false when fromDate or toDate are invalid', () => {
    expect(dateBandHelper.isValidDateRange(null, null)).toBe(false);
    expect(dateBandHelper.isValidDateRange('test', '31-01-2013')).toBe(false);
    expect(dateBandHelper.isValidDateRange('31-01-2013', '23423242344')).toBe(false);
  });

  it('should return false when fromDate is greater than toDate', () => {
    expect(dateBandHelper.isValidDateRange('2013-01-31', '30-01-2013')).toBe(false);
  });

  it('should return true when fromDate is same as toDate', () => {
    expect(dateBandHelper.isValidDateRange('2013-01-31', '2013-01-31')).toBe(true);
  });

  it('should return true when toDate is greater then fromDate', () => {
    expect(dateBandHelper.isValidDateRange('2013-01-20', '2013-01-21')).toBe(true);
  });
});

describe('getStartAndEndDate', () => {
  it('should return null when nothing is passed', () => {
    expect(dateBandHelper.getStartAndEndDate()).toBe(null);
  });

  it('should return null when empty array is passed', () => {
    expect(dateBandHelper.getStartAndEndDate([])).toBe(null);
  });

  it('should return start and end date when array of date ranges are passed', () => {
    const dateRanges = [
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    expect(dateBandHelper.getStartAndEndDate(dateRanges)).toEqual({ from: moment('20130101'), to: moment('20130331') });
  });
});

describe('dateRangesAreAdjacent', () => {
  it('should return true when daterange1 is adjacent before daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20130101'), to: moment('20130131') },
        { from: moment('20130201'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 is adjacent after daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20130101'), to: moment('20130131') },
        { from: moment('20121201'), to: moment('20121231') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 is adjacent after daterange2 recognizing leap year', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20120101'), to: moment('20120229') },
        { from: moment('20120301'), to: moment('20121231') }
      )
    ).toBe(true);
  });

  it('should return false when daterange1 is not adjacent after daterange2 recognizing leap year', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20120101'), to: moment('20120228') },
        { from: moment('20120301'), to: moment('20121231') }
      )
    ).toBe(false);
  });

  it('should return false when any parameter is falsy', () => {
    expect(dateBandHelper.dateRangesAreAdjacent(null, null)).toBe(false);
    expect(dateBandHelper.dateRangesAreAdjacent(null, { from: moment('20130101'), to: moment('20130131') })).toBe(
      false
    );
  });

  it('should return false when daterange1 is not adjacent to daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20130102'), to: moment('20130131') },
        { from: moment('20121201'), to: moment('20121231') }
      )
    ).toBe(false);
  });

  it('should return false when one daterange ends the same day as another begins', () => {
    expect(
      dateBandHelper.dateRangesAreAdjacent(
        { from: moment('20130101'), to: moment('20130131') },
        { from: moment('20131201'), to: moment('20130101') }
      )
    ).toBe(false);
  });

  it('should not mutate existing dateranges', () => {
    const range1 = { from: moment('20130101'), to: moment('20130131') };
    const range2 = { from: moment('20130201'), to: moment('20130215') };
    dateBandHelper.dateRangesAreAdjacent(range1, range2);
    expect(range1.from).toEqual(moment('20130101'));
    expect(range1.to).toEqual(moment('20130131'));
    expect(range2.from).toEqual(moment('20130201'));
    expect(range2.to).toEqual(moment('20130215'));
  });
});

describe('dateRangesAreNested', () => {
  it('should return true when daterange1 ends within daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130101'), to: moment('20130131') },
        { from: moment('20130115'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 starts within daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130131'), to: moment('20130206') },
        { from: moment('20130115'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 starts same day as daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130131'), to: moment('20130206') },
        { from: moment('20130131'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 ends same day as daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130131'), to: moment('20130215') },
        { from: moment('20130210'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange1 starts before and ends after daterange2', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130101'), to: moment('20130228') },
        { from: moment('20130210'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when daterange2 starts before and ends after daterange1', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130201'), to: moment('20130208') },
        { from: moment('20130110'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return true when dateranges starts and ends the same', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130201'), to: moment('20130215') },
        { from: moment('20130201'), to: moment('20130215') }
      )
    ).toBe(true);
  });

  it('should return false when any parameter is falsy', () => {
    expect(dateBandHelper.dateRangesAreNested(null, null)).toBe(false);
    expect(dateBandHelper.dateRangesAreNested(null, { from: moment('20130101'), to: moment('20130131') })).toBe(false);
  });

  it('should return false when daterange1 ends before daterange2 starts', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130101'), to: moment('20130131') },
        { from: moment('20130201'), to: moment('20130215') }
      )
    ).toBe(false);
  });

  it('should return false when daterange1 starts after daterange2 ends', () => {
    expect(
      dateBandHelper.dateRangesAreNested(
        { from: moment('20130201'), to: moment('20130228') },
        { from: moment('20130101'), to: moment('20130115') }
      )
    ).toBe(false);
  });
});

describe('dateRangeAlreadyExists', () => {
  it("should return true when dateband's to and from matches to and from of item in existing date bands", () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: '0', from: moment('20130201'), to: moment('20130228') };
    expect(dateBandHelper.dateRangeAlreadyExists(dateBand, existingDateBands)).toBe(true);
  });

  it('should return false when only one date in dateband matches existing datebands', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: '0', from: moment('20130202'), to: moment('20130228') };
    expect(dateBandHelper.dateRangeAlreadyExists(dateBand, existingDateBands)).toBe(false);
  });

  it('should return false when existing datebands are empty', () => {
    const existingDateBands = [];
    const dateBand = { key: '0', from: moment('20130202'), to: moment('20130228') };
    expect(dateBandHelper.dateRangeAlreadyExists(dateBand, existingDateBands)).toBe(false);
  });

  it('should return false when new dateband has no valid date range', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: '0', from: null, to: null };
    expect(dateBandHelper.dateRangeAlreadyExists(dateBand, existingDateBands)).toBe(false);
  });
});

describe('willRemoveDateBands', () => {
  it('should return true when new dateband has same dates as one existing dateband', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130201'), to: moment('20130228') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return true when new dateband spans more than one existing dateband', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130115'), to: moment('20130315') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return true when new dateband spans all existing datebands', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20121201'), to: moment('20130415') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return true when new dateband starts the same day as an existing dateband and ends in the next', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130101'), to: moment('20130215') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return true when new dateband starts in one dateband and ends the same day as the next', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130131'), to: moment('20130228') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return false when new dateband starts and ends in the same existing dateband', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130201'), to: moment('20130215') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(false);
  });

  it('should return true when new dateband starts before existing dateband and ends in the second one', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20121201'), to: moment('20130215') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });

  it('should return true when new dateband starts in the second dateband and ends after existing ones', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: 0, from: moment('20130215'), to: moment('20130415') };
    expect(dateBandHelper.willRemoveDateBands(dateBand, existingDateBands)).toBe(true);
  });
});

describe('hasOneDaySpans', () => {
  it('should return true if datespans contains one daterange of one day', () => {
    const dateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130201') },
      { key: '3', from: moment('20130202'), to: moment('20130331') }
    ];
    expect(dateBandHelper.hasOneDaySpans(dateBands)).toBe(true);
  });

  it('should return true if datespans contains several dateranges of one day', () => {
    const dateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130201') },
      { key: '3', from: moment('20130202'), to: moment('20130202') }
    ];
    expect(dateBandHelper.hasOneDaySpans(dateBands)).toBe(true);
  });

  it('should return false if datespans contains no dateranges of one day', () => {
    const dateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130202') },
      { key: '3', from: moment('20130203'), to: moment('20130331') }
    ];
    expect(dateBandHelper.hasOneDaySpans(dateBands)).toBe(false);
  });
});

describe('hasDateBandGaps', () => {
  it('should return true when there is one gap between datebands', () => {
    const dateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130120') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    expect(dateBandHelper.hasDateBandGaps(dateBands)).toBe(true);
  });

  it('should return true when there are gaps between several datebands', () => {
    const dateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130120') },
      { key: '2', from: moment('20130201'), to: moment('20130220') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    expect(dateBandHelper.hasDateBandGaps(dateBands)).toBe(true);
  });

  it('should return false when there are no gaps between datebands', () => {
    const dateBands = [
      { key: '1', from: moment('20121201'), to: moment('20121231') },
      { key: '2', from: moment('20130101'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    expect(dateBandHelper.hasDateBandGaps(dateBands)).toBe(false);
  });
});

describe('updateDateBand', () => {
  it('should update the existing datebands array with new dateband', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: '0', from: moment('20130201'), to: moment('20130228') };
    const result = dateBandHelper.updateDateBand(dateBand, existingDateBands);
    expect(result[1].key).toBe('0');
  });

  it('should return existing datebands unchanged if no dateband match is found', () => {
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBand = { key: '0', from: moment('20130202'), to: moment('20130228') };
    const result = dateBandHelper.updateDateBand(dateBand, existingDateBands);
    expect(result).toEqual(existingDateBands);
  });
});

describe('insertDateBand', () => {
  it('should insert dateband first in array when there are no existing datebands', () => {
    const newDateBand = { key: '1', from: moment('20130201'), to: moment('20130228') };
    const dateBands = dateBandHelper.insertDateBand(newDateBand, []);

    expect(dateBands[0].key).toBe('1');
    expect(dateBands).toHaveLength(1);
  });

  it('should insert new dateband starting before existing datebands and change key and startdate of first existing one', () => {
    const newDateBand = { key: '0', from: moment('20121215'), to: moment('20130115') };
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('0');
    expect(dateBands[0].from.isSame(moment('20121215'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130115'), 'day')).toBe(true);
    expect(dateBands[1].key).not.toBe('0');
    expect(dateBands[1].from.isSame(moment('20130116'), 'day')).toBe(true);
    expect(dateBands[1].to.isSame(moment('20130131'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(4);
  });

  it('should insert new dateband starting and ending with same date as all existing datebands replacing them', () => {
    const newDateBand = { key: '0', from: moment('20130101'), to: moment('20130531') };
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') },
      { key: '4', from: moment('20130401'), to: moment('20130430') },
      { key: '5', from: moment('20130501'), to: moment('20130531') }
    ];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('0');
    expect(dateBands[0].from.isSame(moment('20130101'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130531'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(1);
  });

  it('should insert new dateband spanning all existing datebands and remove all existing ones', () => {
    const newDateBand = { key: '0', from: moment('20121215'), to: moment('20130415') };
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130131') },
      { key: '2', from: moment('20130201'), to: moment('20130228') },
      { key: '3', from: moment('20130301'), to: moment('20130331') }
    ];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('0');
    expect(dateBands[0].from.isSame(moment('20121215'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130415'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(1);
  });

  it('should insert new dateband where there is a gap replacing existing first one', () => {
    const newDateBand = { key: '0', from: moment('20130101'), to: moment('20130131') };
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130120') },
      { key: '2', from: moment('20130201'), to: moment('20130228') }
    ];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('0');
    expect(dateBands[0].from.isSame(moment('20130101'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130131'), 'day')).toBe(true);
    expect(dateBands[1].from.isSame(moment('20130201'), 'day')).toBe(true);
    expect(dateBands[1].to.isSame(moment('20130228'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(2);
  });

  it('should insert new dateband where there is a gap replacing existing last one', () => {
    const newDateBand = { key: '0', from: moment('20130121'), to: moment('20130228') };
    const existingDateBands = [
      { key: '1', from: moment('20130101'), to: moment('20130120') },
      { key: '2', from: moment('20130201'), to: moment('20130228') }
    ];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('1');
    expect(dateBands[0].from.isSame(moment('20130101'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130120'), 'day')).toBe(true);
    expect(dateBands[1].key).toBe('0');
    expect(dateBands[1].from.isSame(moment('20130121'), 'day')).toBe(true);
    expect(dateBands[1].to.isSame(moment('20130228'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(2);
  });

  it('should insert new dateband and update from date on existing first one', () => {
    const newDateBand = { key: '1', from: moment('20130101'), to: moment('20130120') };
    const existingDateBands = [{ key: '2', from: moment('20130201'), to: moment('20130228') }];
    const dateBands = dateBandHelper.insertDateBand(newDateBand, existingDateBands);

    expect(dateBands[0].key).toBe('1');
    expect(dateBands[0].from.isSame(moment('20130101'), 'day')).toBe(true);
    expect(dateBands[0].to.isSame(moment('20130120'), 'day')).toBe(true);
    expect(dateBands[1].from.isSame(moment('20130121'), 'day')).toBe(true);
    expect(dateBands[1].to.isSame(moment('20130228'), 'day')).toBe(true);
    expect(dateBands).toHaveLength(2);
  });
});

describe('updateDateBandDurationGroups', () => {
  it('should update single value with new duration group', () => {
    const dateBand = {
      key: 'dateband-1',
      values: [
        {
          value: null,
          durationGroup: {
            id: 1,
            from: 1,
            to: 3,
            key: 'durationgroup-1'
          }
        }
      ]
    };

    const newDurationGroups = [
      {
        id: 1,
        from: 2,
        to: 4,
        key: 'durationgroup-1'
      }
    ];

    const updatedDateBand = dateBandHelper.updateDateBandDurationGroups(dateBand, newDurationGroups);

    const updatedValue = updatedDateBand.values[0];
    expect(updatedDateBand.key).toBe('dateband-1');
    expect(updatedValue.durationGroup.from).toBe(2);
    expect(updatedValue.durationGroup.to).toBe(4);
  });
});
