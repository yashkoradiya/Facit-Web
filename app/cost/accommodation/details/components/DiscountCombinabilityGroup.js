import React from 'react';
import styled from 'styled-components';
import { colours } from '../../../../components/styled/defaults';
import { Flexbox } from '../../../../components/styled/Layout';
import InputCheckbox from '../../../../components/FormFields/InputCheckbox';

export default function DiscountCombinabilityGroup({ combinations, onChange, disabled }) {
  const handleOnChange = (id, enabled) => {
    const updatedCombinations = [...combinations];
    const idx = updatedCombinations.findIndex(x => x.id === id);

    updatedCombinations[idx].enabled = enabled;

    onChange(updatedCombinations);
  };

  return (
    <CombinabilityGroupBox direction="column" alignItems="flex-start">
      {combinations.map(c => (
        <InputCheckbox
          disabled={disabled}
          key={c.id}
          label={c.discountName}
          checked={c.enabled}
          onChange={e => handleOnChange(c.id, e)}
        />
      ))}
    </CombinabilityGroupBox>
  );
}

const CombinabilityGroupBox = styled(Flexbox)`
  padding: 8px;
  margin-right: 4px;
  margin-bottom: 4px;
  border: 1px solid ${colours.tuiGrey200};
  border-radius: 2px;

  *:not(:last-child) {
    margin-bottom: 4px;
  }
`;
