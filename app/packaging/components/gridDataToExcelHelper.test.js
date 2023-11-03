import { mapData } from './gridDataToExcelHelper';

describe('gridDataToExcelHelper', () => {
  describe('mapData', () => {
    it('should map simple properties', () => {
      const columnDefinitions = [
        {
          field: 'sourceMarketName',
          headerName: 'SM'
        }
      ];
      const data = [
        {
          sourceMarketName: 'tui-se'
        }
      ];
      const actual = mapData(data, columnDefinitions);
      const expected = [
        {
          SM: 'tui-se'
        }
      ];
      expect(actual).toEqual(expected);
    });

    it('should map money properties', () => {
      const columnDefinitions = [
        {
          headerName: 'Calc. price',
          field: 'calcPrice'
        }
      ];
      const data = [
        {
          calcPrice: {
            values: {
              EUR: 410,
              DKK: 3053,
              NOK: 4152,
              SEK: 4385
            }
          }
        }
      ];
      const currency = 'EUR';
      const actual = mapData(data, columnDefinitions, currency);
      const expected = [
        {
          'Calc. price': 410
        }
      ];
      expect(actual).toEqual(expected);
    });

    it('should map and format date properties', () => {
      const columnDefinitions = [
        {
          headerName: 'Date',
          field: 'date'
        }
      ];
      const data = [
        {
          date: '30-04-2020 00:00'
        }
      ];

      const actual = mapData(data, columnDefinitions);
      const expected = [
        {
          Date: '30-04-2020 00:00'
        }
      ];
      expect(actual).toEqual(expected);
    });

    it('should use column order from columndefinitions', () => {
      const columnDefinitions = [
        {
          headerName: 'One',
          field: 'one'
        },
        {
          headerName: 'Two',
          field: 'two'
        },
        {
          headerName: 'Three',
          field: 'three'
        }
      ];

      const data = [
        {
          one: 'one',
          three: 'three',
          two: 'two'
        }
      ];

      const actual = mapData(data, columnDefinitions);

      const expected = [
        {
          One: 'one',
          Two: 'two',
          Three: 'three'
        }
      ];

      const actualKeys = Object.keys(actual[0]);
      const expectedKeys = Object.keys(expected[0]);

      expect(actualKeys[0]).toEqual(expectedKeys[0]);
      expect(actualKeys[1]).toEqual(expectedKeys[1]);
      expect(actualKeys[2]).toEqual(expectedKeys[2]);
    });
  });
});
