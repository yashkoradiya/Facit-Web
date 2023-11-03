import React from 'react';
import { render, waitFor } from 'test-utils';
import PreDefinedDurationGroupPicker from './PreDefinedDurationGroupPicker';
import userEvent from '@testing-library/user-event';

import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
jest.mock('settings/PreDefinedRules/api');

let user;
describe('PreDefinedDurationGroupPicker.test', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should render button for pre-defined Date Band rule', async () => {
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: [
        {
          id: 20,
          name: 'Test Duration Group Rule',
          durationGroups: [
            {
              from: 1,
              to: 1
            }
          ],
          durations: '1-1'
        }
      ]
    });
    const { findByText, findByRole } = render(<PreDefinedDurationGroupPicker></PreDefinedDurationGroupPicker>);

    await user.click(await findByRole('button'));

    expect(await findByText(/Test Duration Group Rule/i)).toBeInTheDocument();
  });

  it('should receive correct input date for passed onClick function', async () => {
    const input = {
      id: 20,
      name: 'Test Duration Group Rule',
      durationGroups: [
        {
          from: 1,
          to: 1
        }
      ],
      durations: '1-1'
    };
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: [input]
    });
    const clickHandler = jest.fn();
    const { findByText, findByRole } = render(
      <PreDefinedDurationGroupPicker onClick={clickHandler}></PreDefinedDurationGroupPicker>
    );

    await user.click(await findByRole('button'));
    await user.click(await findByText(/Test Duration Group Rule/i));

    expect(clickHandler).toHaveBeenCalledWith(input);
  });

  it('should not render anything when data is empty', async () => {
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: []
    });

    const { queryByRole } = render(<PreDefinedDurationGroupPicker></PreDefinedDurationGroupPicker>);

    await waitFor(() => expect(preDefinedRulesApi.getDurationGroups).toHaveBeenCalled());

    expect(queryByRole('button')).toBeNull();
  });
});
