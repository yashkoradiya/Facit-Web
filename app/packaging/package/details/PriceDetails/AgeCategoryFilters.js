import React from 'react';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import { Flexbox } from 'components/styled/Layout';

export function AgeCategoryFilters(props) {
  const checkboxStyles = { marginTop: 3, marginBottom: 3 };
  return (
    <Flexbox direction="column" alignItems="normal">
      <InputCheckbox
        style={checkboxStyles}
        label="Adult"
        checked={props.ageCategorySelections.adult}
        onChange={check => props.onAgeCategoryChange('adult', check)}
      />
      <InputCheckbox
        style={checkboxStyles}
        label="Child"
        checked={props.ageCategorySelections.child}
        onChange={check => props.onAgeCategoryChange('child', check)}
      />
    </Flexbox>
  );
}
