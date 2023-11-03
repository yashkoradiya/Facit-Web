import React, { useState } from 'react';
import ModalBase from '../../../../components/ModalBase';
import { PrimaryButton, Button } from '../../../../components/styled/Button';
import { Input } from '../../../../components/styled/Input';
import { isNumber } from '../../../../helpers/numberHelper';
import { Flexbox } from '../../../../components/styled/Layout';
import numeral from 'numeral';

export function AverageUnderOccupancyModal({ show, onClose, onSave, placeholder }) {
  const [underOccupancyValue, setUnderOccupancyValue] = useState('');

  const isValid = underOccupancyValue && isNumber(underOccupancyValue);

  return (
    <ModalBase show={show} onRequestClose={onClose} title={'Risk %'} width="500px" height="150px">
      <Flexbox height="100%" direction="column" alignItems="flex-start" justifyContent="space-between">
        <Flexbox>
          Risk:
          <Input
            style={{ marginLeft: '10px', marginRight: '3px' }}
            width="40px"
            onChange={e => setUnderOccupancyValue(e.target.value)}
            placeholder={numeral(placeholder).format('0.0%')}
          />
        </Flexbox>
        <Flexbox alignSelf="flex-end">
          <PrimaryButton marginRight="10px" onClick={() => onSave(underOccupancyValue)} disabled={!isValid}>
            Update risk
          </PrimaryButton>
          <Button onClick={onClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
