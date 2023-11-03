import React from 'react';
import { render } from 'test-utils';
import userEvent from '@testing-library/user-event';
import FailedExports from './FailedExports';
import * as inboxApi from '../api';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
jest.mock('../api');
inboxApi.getFailedExports.mockResolvedValue({
  data: []
});
inboxApi.getPublishStatus.mockResolvedValue({
  data: []
});
jest.mock('apis/sourceMarketsApi');
sourceMarketsApi.getSourceMarkets.mockResolvedValue({
  data: []
});
jest.mock('apis/matchingCriteriasApi');
matchingCriteriasApi.get.mockResolvedValue({
  data: []
});

describe('FailedExports', () => {
  it('should render publish status button', async () => {
    const { findByText } = render(<FailedExports />);

    expect(await findByText(/View pending and failed package publishing status/i)).toBeInTheDocument();
  });

  it('should be able to open and close publish status modal', async () => {
    const user = userEvent.setup();
    const { findByText, findAllByText } = render(<FailedExports />);

    await user.click(await findByText(/View pending and failed package publishing status/i));
    expect(await findByText(/^Pending and failed publishing status$/)).toBeVisible();

    const closeButtons = await findAllByText(/^close$/i);
    await user.click(closeButtons[1]);

    expect(await findByText(/^Pending and failed publishing status$/)).not.toBeVisible();
  });
});
