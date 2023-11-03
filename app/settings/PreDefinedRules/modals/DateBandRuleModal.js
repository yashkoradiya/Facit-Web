import React, { useState, useCallback, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Flexbox, TextBlock } from 'components/styled/Layout';
import { Button, PrimaryButton } from 'components/styled/Button';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import InputField from 'components/FormFields/InputField';
import DateBandsEditor from 'pricing/rules/components/dateBandEditor/DateBandsEditor';
import { ErrorBox } from 'components/styled/Layout';
import styled from 'styled-components';

const StyledErrorBox = styled(ErrorBox)`
  margin-bottom: 8px;
`;

export default function DateBandRuleModal({ title, show, onClose, onSave, planningPeriods, dateBandRule, readOnly }) {
  const [dateBands, setDateBands] = useState(
    dateBandRule
      ? dateBandRule.dateBands.map(dateBand => {
          return {
            key: uuidv4(),
            from: moment(dateBand.from),
            to: moment(dateBand.to),
            values: []
          };
        })
      : []
  );
  const [dateBandValidationMessages, setdateBandValidationMessages] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(
    dateBandRule ? planningPeriods.find(x => x.key === dateBandRule.seasonId) : null
  );
  const [name, setName] = useState(dateBandRule ? dateBandRule.name : '');
  const [dateBandRuleIsValid, setDateBandRuleIsValid] = useState(false);
  const [validationActive, setValidationActive] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleDateBandsChanged = useCallback((_dateBands, _dateBandValidationMessages) => {
    setdateBandValidationMessages(_dateBandValidationMessages);
    setDateBands(_dateBands);
    setHasChanges(true);
  }, []);

  const handleOnSave = () => {
    setHasSaved(true);
    onSave({ name, selectedSeason, dateBands });
  };

  const handleClose = () => {
    if (!hasChanges || confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
      onClose();
    }
  };

  useEffect(() => {
    let isValid = false;
    if (Object.keys(dateBandValidationMessages).length === 0 && name.length > 0 && selectedSeason) {
      isValid = true;
    }
    setDateBandRuleIsValid(isValid);
  }, [selectedSeason, name, dateBandValidationMessages]);

  const errorMessageValues = dateBandValidationMessages && Object.values(dateBandValidationMessages);
  const dateBandErrorMessage = dateBandValidationMessages && errorMessageValues.length > 0 && errorMessageValues[0];

  return (
    <ModalBase show={show} onRequestClose={handleClose} title={title} width="500px" height="500px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <Flexbox justifyContent="space-between" marginBottom="20px">
          <div style={{ marginRight: '10px' }}>
            <DropdownMenu
              disabled={readOnly}
              errorMessage={validationActive && !selectedSeason ? 'Must have selected planning period' : ''}
              items={planningPeriods}
              label="Planning period"
              defaultValue={selectedSeason ? selectedSeason.value : ''}
              onChange={e => setSelectedSeason(planningPeriods.find(x => x.key === e.key))}
            ></DropdownMenu>
          </div>
          <InputField
            disabled={readOnly}
            errorMessage={validationActive && !name ? 'Must have name' : ''}
            label="Name"
            id="date-band-rule-name"
            value={name}
            onChange={e => {
              setValidationActive(true);
              setHasChanges(true);
              setName(e.target.value);
            }}
          ></InputField>
        </Flexbox>
        <Flexbox direction="column" alignItems="flex-start" width="100%">
          {dateBandErrorMessage && (
            <StyledErrorBox>
              <i
                className="material-icons"
                style={{ marginRight: '4px', fontSize: '16px', float: 'left', color: 'rgba(255, 0, 0, 0.6)' }}
              >
                error
              </i>
              {dateBandErrorMessage}
            </StyledErrorBox>
          )}
          <DateBandsEditor
            disabled={readOnly}
            dateBands={dateBands}
            valueDefinitions={[]}
            onChange={handleDateBandsChanged}
            validationMessages={dateBandValidationMessages}
            disableFocus={true}
          />
          {dateBandRule && (
            <TextBlock style={{ marginTop: 14 }}>
              Updating an existing rule will not affect previously created date bands.
            </TextBlock>
          )}
        </Flexbox>
        <Flexbox alignSelf="flex-end" marginTop="auto">
          <PrimaryButton
            marginRight="10px"
            disabled={readOnly || !dateBandRuleIsValid || hasSaved}
            onClick={handleOnSave}
          >
            Save and return
          </PrimaryButton>
          <Button onClick={handleClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
