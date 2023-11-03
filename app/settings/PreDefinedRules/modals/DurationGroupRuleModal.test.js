import React from 'react';
import { render, cleanup } from 'test-utils';
import DurationGroupRuleModal from './DurationGroupRuleModal';
import userEvent from '@testing-library/user-event';

const spyOnConfirmWindow = jest.spyOn(window, 'confirm');
spyOnConfirmWindow.mockImplementation(() => {});

let user;
describe('DurationGroupRuleModal', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    spyOnConfirmWindow.mockClear();
    cleanup();
  });

  it('should render name input', () => {
    const { getByRole, queryByText } = render(<DurationGroupRuleModal show={true} onClose={() => {}} />);

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(queryByText(/updating an existing/i)).toBeNull();
  });

  it('should render duration group editor', () => {
    const { getByTestId } = render(<DurationGroupRuleModal show={true} onClose={() => {}} />);

    expect(getByTestId('test-duration-groups-editor')).toBeInTheDocument();
  });

  it('should disable save button before entering name and after saving', async () => {
    const { getByText, getByRole } = render(
      <DurationGroupRuleModal show={true} onClose={() => {}} onSave={() => {}} />
    );

    const saveButton = getByText(/save/i);
    expect(saveButton).toBeDisabled();

    await user.type(getByRole('textbox'), 'name');

    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should call onClose callback when clicking cancel with no changes', async () => {
    const onCloseHandler = jest.fn();
    const { getByText } = render(<DurationGroupRuleModal show={true} onClose={onCloseHandler} />);

    await user.click(getByText(/cancel/i));

    expect(spyOnConfirmWindow).toHaveBeenCalledTimes(0);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
  });

  it('should show confirm window when clicking cancel with changes', async () => {
    const onCloseHandler = jest.fn();
    const { getByText, getByRole } = render(<DurationGroupRuleModal show={true} onClose={onCloseHandler} />);

    await user.type(getByRole('textbox'), 'name');

    await user.click(getByText(/cancel/i));

    expect(spyOnConfirmWindow).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when clicking save', async () => {
    const onSaveHandler = jest.fn();
    const { getByText, getByRole } = render(
      <DurationGroupRuleModal show={true} onSave={onSaveHandler} onClose={() => {}} />
    );

    await user.type(getByRole('textbox'), 'name');

    await user.click(getByText(/save/i));

    expect(onSaveHandler).toHaveBeenCalledTimes(1);
  });

  it('should populate a rule to edit', async () => {
    const onSaveHandler = jest.fn();
    const rule = { id: 1, name: 'test rule', durationGroups: [{ from: 1337, to: 7331 }], durations: '1337-7331' };
    const { findByText, getByRole, queryByText } = render(
      <DurationGroupRuleModal show={true} onSave={onSaveHandler} onClose={() => {}} durationGroupRule={rule} />
    );

    expect(await findByText(/^1337$/i)).toBeInTheDocument();
    expect(await findByText(/^7331$/i)).toBeInTheDocument();

    const inputName = getByRole('textbox');
    expect(inputName.value).toBe('test rule');
    expect(queryByText(/updating an existing/i)).not.toBeNull();
  });

  it('should disable input fields when read only', async () => {
    const rule = { id: 1, name: 'test rule', durationGroups: [{ from: 1337, to: 7331 }], durations: '1337-7331' };
    const { getByText, getByRole } = render(
      <DurationGroupRuleModal
        readOnly={true}
        show={true}
        onClose={() => {}}
        onSave={() => {}}
        durationGroupRule={rule}
      />
    );

    const saveButton = getByText(/save/i);
    expect(saveButton).toBeDisabled();

    const nameInput = getByRole('textbox');
    expect(nameInput).toBeDisabled();
  });
});
