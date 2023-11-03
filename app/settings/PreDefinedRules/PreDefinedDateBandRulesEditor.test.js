import React from 'react';
import { render, waitFor } from 'test-utils';
import PreDefinedDateBandRulesEditor from './PreDefinedDateBandRulesEditor';
import userEvent from '@testing-library/user-event';

import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
jest.mock('settings/PreDefinedRules/api');
preDefinedRulesApi.getPlanningPeriods.mockResolvedValue({
  data: [{ id: 'PERIOD-000000014', name: 'Summer 19' }]
});
preDefinedRulesApi.deleteDateBand.mockResolvedValue({
  status: 200
});

let user;
describe('PreDefinedDateBandRulesEditor', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    preDefinedRulesApi.getDateBands.mockClear();
  });

  it('should render date bands table', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 9,
          name: 'test date band rule',
          seasonId: 'PERIOD-000000014',
          seasonName: 'Summer 19',
          dateBands: [
            {
              from: '01-31-2020 00:00:00',
              to: '02-22-2020 00:00:00'
            }
          ],
          startDate: '01-31-2020 00:00:00',
          endDate: '02-22-2020 00:00:00',
          periods: 1337
        }
      ]
    });

    const { findByText } = render(<PreDefinedDateBandRulesEditor />);

    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    expect(await findByText(/Summer 19/i)).toBeInTheDocument();
    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    expect(await findByText(/1337/i)).toBeInTheDocument();
  });

  it('should remove date band when clicking on delete', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 9,
          name: 'test date band rule',
          seasonId: 'PERIOD-000000014',
          seasonName: 'Summer 19',
          dateBands: [
            {
              from: '01-31-2020 00:00:00',
              to: '02-22-2020 00:00:00'
            }
          ],
          startDate: '01-31-2020 00:00:00',
          endDate: '02-22-2020 00:00:00',
          periods: 1337
        }
      ]
    });

    const { findByText, findAllByRole, queryByText } = render(<PreDefinedDateBandRulesEditor />);
    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    const deleteButton = (await findAllByRole('button'))[1];

    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: []
    });

    await user.click(deleteButton);
    expect(preDefinedRulesApi.deleteDateBand).toHaveBeenCalled();

    await waitFor(() => expect(preDefinedRulesApi.getDateBands).toHaveBeenCalledTimes(2));

    expect(await queryByText(/test date band rule/i)).toBeNull();
  });

  it('should open modal when clicking add new dateband', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: []
    });

    const { getByText, findByText } = render(<PreDefinedDateBandRulesEditor dateBandRule={null} />);

    await user.click(getByText(/add new/i));
    expect(await findByText(/^date bands$/i)).toBeVisible();
  });

  it('should open modal when clicking on existing dateband', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 9,
          name: 'test date band rule',
          seasonId: 'PERIOD-000000014',
          seasonName: 'Summer 19',
          dateBands: [
            {
              from: '01-31-2020 00:00:00',
              to: '02-22-2020 00:00:00'
            }
          ],
          startDate: '01-31-2020 00:00:00',
          endDate: '02-22-2020 00:00:00',
          periods: 1337
        }
      ]
    });

    const { findByText, findAllByRole } = render(<PreDefinedDateBandRulesEditor />);
    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    const button = (await findAllByRole('button'))[0];

    await user.click(button);
    expect(await findByText(/^date bands$/i)).toBeVisible();
  });

  it('should open modal when clicking on existing dateband when read only', async () => {
    preDefinedRulesApi.getDateBands.mockResolvedValueOnce({
      data: [
        {
          id: 9,
          name: 'test date band rule',
          seasonId: 'PERIOD-000000014',
          seasonName: 'Summer 19',
          dateBands: [
            {
              from: '01-31-2020 00:00:00',
              to: '02-22-2020 00:00:00'
            }
          ],
          startDate: '01-31-2020 00:00:00',
          endDate: '02-22-2020 00:00:00',
          periods: 1337
        }
      ]
    });

    const { findByText, findAllByRole } = render(<PreDefinedDateBandRulesEditor readOnly={true} />);
    expect(await findByText(/test date band rule/i)).toBeInTheDocument();
    const button = (await findAllByRole('button'))[0];

    await user.click(button);
    expect(await findByText(/^date bands$/i)).toBeVisible();
  });
});
