import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartTile from './ChartTile';

const onTileSelectedCB = jest.fn();

describe('Chart Tile', () => {
  it('Should render the tile', () => {
    const { getByText } = render(
      <ChartTile items={datasetsTD} onTileSelected={onTileSelectedCB} selectedChartIds={[]} />
    );
    expect(getByText(/test record/i)).toBeInTheDocument();
  });
  it('Should be able to select the tile', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <ChartTile items={datasetsTD} onTileSelected={onTileSelectedCB} selectedChartIds={[]} />
    );
    const summaryContainer = getByTestId('chart-tile-container');
    const tile = summaryContainer.childNodes[0];
    await user.click(tile);
    expect(onTileSelectedCB).toHaveBeenCalled();
  });
});

const datasetsTD = [
  {
    key: 'a6a59a6f',
    masterId: 1326,
    id: 'Test record',
    label: 'Test record',
    data: [
      {
        date: '04/01/2022 00:00:00',
        transferPrice: {
          values: {
            USD: 115,
            SEK: 1023,
            NOK: 723,
            MAD: 110,
            GBP: 85,
            EUR: 100,
            DKK: 901,
            AED: 404,
            THB: 3244
          }
        },
        transferCost: {
          values: {
            USD: 57.5,
            SEK: 511.5,
            NOK: 361.5,
            MAD: 55,
            GBP: 42.5,
            EUR: 50,
            DKK: 450.5,
            AED: 202,
            THB: 1622
          }
        }
      }
    ],
    selected: true,
    metadata: {
      ageCategoryType: 'Adult',
      sourceMarketName: 'TUI Netherlands',
      sourceMarketId: 'TUI_NL'
    }
  }
];
