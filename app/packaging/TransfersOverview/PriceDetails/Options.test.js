import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Options from './Options';

const onRefreshCB = jest.fn();
const ageCategoryChangeCB = jest.fn();
const categories = { adult: true, child: true, infant: true };

describe('Options', () => {
  it('Should render all the options', async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <Options ageCategorySelections={categories} onRefresh={onRefreshCB} onAgeCategoryChange={ageCategoryChangeCB} />
    );
    const adultCheckbox = getByText(/adult/i);
    await user.click(adultCheckbox);
    expect(ageCategoryChangeCB).toHaveBeenCalled();

    const childCheckbox = getByText(/child/i);
    await user.click(childCheckbox);
    expect(ageCategoryChangeCB).toHaveBeenCalled();

    const infantCheckbox = getByText(/infant/i);
    await user.click(infantCheckbox);
    expect(ageCategoryChangeCB).toHaveBeenCalled();

  });
});
