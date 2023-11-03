import React from 'react';
import { render, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import PreDefinedDurationGroupRulesEditor from './PreDefinedDurationGroupRulesEditor';

import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
jest.mock('settings/PreDefinedRules/api');
preDefinedRulesApi.deleteDurationGroup.mockResolvedValue({
  status: 200
});

describe('PreDefinedDurationGroupRulesEditor', () => {
  afterEach(() => {
    preDefinedRulesApi.getDurationGroups.mockClear();
  });

  it('should render duration groups table', async () => {
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'duration group rule',
          durationGroups: [{ from: 1, to: 2 }],
          durations: '1-2'
        }
      ]
    });

    const { findByText } = render(<PreDefinedDurationGroupRulesEditor />);

    expect(await findByText(/duration group rule/i)).toBeInTheDocument();
    expect(await findByText(/1-2/i)).toBeInTheDocument();
  });

  it('should remove duration group when clicking on delete', async () => {
    const user = userEvent.setup();
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'duration group rule',
          durationGroups: [{ from: 1, to: 2 }],
          durations: '1-2'
        }
      ]
    });

    const { findByText, findAllByRole, queryByText } = render(<PreDefinedDurationGroupRulesEditor />);
    await waitFor(async () => expect(await findByText(/duration group rule/i)).toBeInTheDocument());
    const deleteButton = (await findAllByRole('button'))[1];

    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: []
    });

    await user.click(deleteButton);
    expect(preDefinedRulesApi.deleteDurationGroup).toHaveBeenCalled();

    await waitFor(() => expect(preDefinedRulesApi.getDurationGroups).toHaveBeenCalledTimes(2));

    expect(await queryByText(/duration group rule/i)).toBeNull();
  });

  it('should open modal when clicking add new duration group', async () => {
    const user = userEvent.setup();
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: []
    });

    const { getByText, findByText } = render(<PreDefinedDurationGroupRulesEditor />);

    await user.click(getByText(/add new/i));
    expect(await findByText(/^duration groups$/i)).toBeVisible();
  });

  it('should open modal when clicking add new duration group when read only', async () => {
    const user = userEvent.setup();
    preDefinedRulesApi.getDurationGroups.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'duration group rule',
          durationGroups: [{ from: 1, to: 2 }],
          durations: '1-2'
        }
      ]
    });

    const { findByText } = render(<PreDefinedDurationGroupRulesEditor readOnly />);

    const rule = await findByText(/duration group rule/i);
    await user.click(rule);

    expect(await findByText(/^duration groups$/i)).toBeVisible();
  });
});
