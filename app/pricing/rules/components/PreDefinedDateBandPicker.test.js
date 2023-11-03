import React from 'react';
import { render, wait } from 'test-utils';
import PreDefinedDateBandPicker from './PreDefinedDateBandsPicker';
import userEvent from '@testing-library/user-event';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
import { fromJS } from 'immutable';
jest.mock('settings/PreDefinedRules/api');

let user;
describe('PreDefinedDateBandPicker.test', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should render button for pre-defined Date Band rule', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Test Date Band Rule',
          seasonId: 'PERIOD-000000014',
          dateBands: [{ from: '2020-01-31T23:00:00', to: '2020-02-13T23:00:00' }]
        }
      ]
    });
    const { findByText, findByRole } = render(<PreDefinedDateBandPicker></PreDefinedDateBandPicker>);

    await user.click(await findByRole('button'));

    expect(await findByText(/Test Date Band Rule/i)).toBeInTheDocument();
  });

  it('should filter buttons based on selected season ids', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Test Date Band Rule 1',
          seasonId: 'PERIOD-000000014',
          dateBands: [{ from: '2020-01-31T23:00:00', to: '2020-02-13T23:00:00' }]
        },
        {
          id: 2,
          name: 'Test Date Band Rule 2',
          seasonId: 'PERIOD-000000015',
          dateBands: [{ from: '2020-01-31T23:00:00', to: '2020-02-13T23:00:00' }]
        }
      ]
    });
    const { findAllByText, findByRole } = render(
      <PreDefinedDateBandPicker selectedSeasonIds={fromJS(['PERIOD-000000014'])}></PreDefinedDateBandPicker>
    );

    await user.click(await findByRole('button'));

    expect(await findAllByText(/Test Date Band Rule/i)).toHaveLength(1);
  });

  it('should call onClick handler when selecting date band rule in button list', async () => {
    const input = {
      id: 1,
      name: 'Test Date Band Rule',
      seasonId: 'PERIOD-000000014',
      dateBands: [{ from: '2020-01-31T23:00:00', to: '2020-02-13T23:00:00' }]
    };
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [input]
    });
    const clickHandler = jest.fn();
    const { findByText, findByRole } = render(
      <PreDefinedDateBandPicker onClick={clickHandler}></PreDefinedDateBandPicker>
    );

    await user.click(await findByRole('button'));
    await user.click(await findByText(/Test Date Band Rule/i));

    expect(clickHandler).toHaveBeenCalledWith(input.dateBands, input.id);
  });

  it('should not render anything when data is empty', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: []
    });

    const { queryByRole } = render(<PreDefinedDateBandPicker/>);

    expect(preDefinedRulesApi.getDateBands).toHaveBeenCalled();

    expect(queryByRole('button')).toBeNull();
  });
});
