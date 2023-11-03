import React from 'react';
import { List } from 'immutable';
import DefaultConfigurationsEditor from './DefaultConfigurationsEditor';
import { propTD } from './test-data';
import userEvent from '@testing-library/user-event';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
import { render } from 'test-utils/index';

jest.mock('settings/PreDefinedRules/api');

const onChangeCB = jest.fn();
const onSaveCB = jest.fn();
const saveAndReturnCB = jest.fn();
const onCancelCB = jest.fn();
const updatePropCB = jest.fn();

describe('Default Configurations Editor', () => {
  beforeEach(() => {
    preDefinedRulesApi.getDateBands.mockResolvedValue({ data: [] });
  });

  it('Should render title and select source market', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByRole, getByPlaceholderText } = render(
      <DefaultConfigurationsEditor
        configurations={propTD.configurations}
        valueDefinitions={List(propTD.valueDefinitions)}
        selectedApplicability={List(propTD.selectedApplicability)}
        durationGroups={propTD.durationGroups}
        ruleDefinitionId={propTD.ruleDefinitionId}
        onChange={onChangeCB}
        onCancel={onCancelCB}
        onSave={onSaveCB}
        onSaveAndReturn={saveAndReturnCB}
        editButtonsDisabled={false}
        sourceMarkets={propTD.sourceMarkets}
        currency={propTD.currency}
        updateProperties={updatePropCB}
      />
    );

    const heading = getByRole('heading', {
      name: /date bands/i
    });
    expect(heading).toBeInTheDocument();

    const sourceMarketTB = getByPlaceholderText('Please type');
    expect(sourceMarketTB).toBeInTheDocument();

    await user.click(sourceMarketTB);

    const options = getAllByRole('option');

    await user.click(options[0]);
  });
});
