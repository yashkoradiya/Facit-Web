import React from 'react';
import InputCheckbox from 'components/FormFields/InputCheckbox';
import { Flexbox } from 'components/styled/Layout';
import { Button } from 'components/styled/Button';
import PropTypes from 'prop-types';

Options.proptypes = {
  onRefresh: PropTypes.func.isRequired,
  ageCategorySelections: PropTypes.object.isRequired
};

Options.defaultProps = {
  onRefresh: () => null,
  ageCategorySelections: { adult: true, child: true, infant: true }
};

export default function Options(props) {
  const checkboxStyles = { marginTop: 3, marginBottom: 3 };
  return (
    <Flexbox width="50%" justifyContent="space-between">
      <Flexbox direction="column" alignItems="normal" data-testid="age-category-container">
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
        <InputCheckbox
          style={checkboxStyles}
          label="Infant"
          checked={props.ageCategorySelections.infant}
          onChange={check => props.onAgeCategoryChange('infant', check)}
        />
      </Flexbox>
      <Button onClick={props.onRefresh}>Refresh</Button>
    </Flexbox>
  );
}
