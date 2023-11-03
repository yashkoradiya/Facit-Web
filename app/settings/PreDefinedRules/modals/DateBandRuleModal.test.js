import React from 'react';
import { render } from 'test-utils';
import userEvent from '@testing-library/user-event';
import DateBandRuleModal from './DateBandRuleModal';

const spyOnConfirmWindow = jest.spyOn(window, 'confirm');
spyOnConfirmWindow.mockImplementation(() => {});

describe('DateBandRuleModal', () => {
  afterEach(() => {
    spyOnConfirmWindow.mockClear();
  });

  it('should render inputs', () => {
    const { getByLabelText, getByRole, queryByText } = render(<DateBandRuleModal show={true} onClose={() => {}} />);

    expect(
      getByRole('textbox', {
        name: /planning period/i
      })
    ).toBeInTheDocument();
    expect(getByLabelText(/name/i)).toBeInTheDocument();
    expect(queryByText(/updating an existing/i)).toBeNull();
  });

  it('should call onClose callback when clicking cancel with no changes', async () => {
    const user = userEvent.setup();
    const onCloseHandler = jest.fn();
    const { getByText } = render(<DateBandRuleModal show={true} onClose={onCloseHandler} />);

    await user.click(getByText(/cancel/i));

    expect(spyOnConfirmWindow).toHaveBeenCalledTimes(0);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
  });

  it('should show confirm close window when clicking cancel with changes', async () => {
    const user = userEvent.setup();
    const onCloseHandler = jest.fn();
    const { getByText, getByLabelText, getByPlaceholderText } = render(
      <DateBandRuleModal show={true} onClose={onCloseHandler} />
    );

    await user.type(getByLabelText(/name/i), 'a new name');

    const fromDateInput = getByPlaceholderText(/add/i);
    user.type(fromDateInput, '2019');
    fromDateInput.blur();

    await user.click(getByText(/cancel/i));

    expect(spyOnConfirmWindow).toHaveBeenCalledTimes(1);
  });

  it('should be able to save after entering all data', async () => {
    const user = userEvent.setup();
    const onSaveHandler = jest.fn();
    const { getByLabelText, getByText, getByPlaceholderText, container, getByRole } = render(
      <DateBandRuleModal
        show={true}
        onClose={() => {}}
        onSave={onSaveHandler}
        planningPeriods={[
          {
            key: 'P1',
            value: 'Winter 2021'
          }
        ]}
        dateBandRule={{ name: 'name', dateBands: [{ from: '2019-01-01T00:00:00', to: '2020-01-01T00:00:00' }] }}
      />
    );
    const saveButton = getByText(/save/i);
    expect(saveButton).toBeDisabled();

    await user.click(
      getByRole('textbox', {
        name: /planning period/i
      })
    );
    await user.click(getByText('Winter 2021'));

    await user.type(getByLabelText(/name/i), 'a new name');

    const fromDateInput = getByPlaceholderText(/add/i);
    await user.type(fromDateInput, '2019');
    fromDateInput.blur();
    const toDateInput = container.querySelector('[data-colindex="2"][data-rowindex="1"]');
    await user.type(toDateInput, '2020');
    toDateInput.blur();
    fromDateInput.focus(); // This makes sure the onBlur event from react-datepicker is called

    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);

    expect(onSaveHandler).toHaveBeenCalledTimes(1);

    const onSaveCallResult = onSaveHandler.mock.calls[0][0];

    expect(onSaveCallResult.name).toBe('namea new name');
    expect(onSaveCallResult.selectedSeason).toEqual({
      key: 'P1',
      value: 'Winter 2021'
    });

    expect(onSaveCallResult.dateBands).toHaveLength(1);
    const dateBand = onSaveCallResult.dateBands[0];
    expect(dateBand.key).toEqual(expect.any(String));
    expect(dateBand.values).toHaveLength(0);
    expect(dateBand.from.format('YYYY-MM-DD')).toBe('2019-01-01');
    expect(dateBand.to.format('YYYY-MM-DD')).toBe('2020-01-01');
  });

  it('should populate a rule to edit', async () => {
    const onCloseHandler = jest.fn();
    const rule = {
      id: 1337,
      name: 'test rule',
      seasonId: 'P1',
      seasonName: 'Winter 2021',
      dateBands: [{ from: '2020-03-06T00:00:00', to: '2020-04-05T00:00:00' }],
      startDate: '2020-03-06T00:00:00',
      endDate: '2020-04-05T00:00:00',
      periods: 7331
    };
    const { getByPlaceholderText, container, queryByText } = render(
      <DateBandRuleModal
        show={true}
        onClose={onCloseHandler}
        dateBandRule={rule}
        planningPeriods={[
          {
            key: 'P1',
            value: 'Winter 2021'
          }
        ]}
      />
    );
    const inputName = container.querySelector('#date-band-rule-name');
    expect(inputName.value).toBe('test rule');
    expect(getByPlaceholderText(/Winter 2021/i)).toBeInTheDocument();

    const fromDateInput = container.querySelector('[data-colindex="1"][data-rowindex="1"]');
    expect(fromDateInput.value).toBe('06-03-2020');
    const toDateInput = container.querySelector('[data-colindex="2"][data-rowindex="1"]');
    expect(toDateInput.value).toBe('05-04-2020');
    expect(queryByText(/updating an existing/i)).not.toBeNull();
  });

  it('should disable data input when read only', () => {
    const onSaveHandler = jest.fn();
    const { getByLabelText, getByText, getByPlaceholderText, container, getByRole } = render(
      <DateBandRuleModal
        readOnly={true}
        show={true}
        onClose={() => {}}
        onSave={onSaveHandler}
        planningPeriods={[
          {
            key: 'P1',
            value: 'Winter 2021'
          }
        ]}
      />
    );
    const saveButton = getByText(/save/i);
    expect(saveButton).toBeDisabled();

    const planningPeriodInput = getByRole('textbox', {
      name: /planning period/i
    });
    expect(planningPeriodInput).toBeDisabled();

    const nameInput = getByLabelText(/name/i);
    expect(nameInput).toBeDisabled();

    const fromDateInput = getByPlaceholderText(/add/i);
    expect(fromDateInput).toBeDisabled();

    const toDateInput = container.querySelector('[data-colindex="2"][data-rowindex="1"]');
    expect(toDateInput).toBeDisabled();
  });
});
