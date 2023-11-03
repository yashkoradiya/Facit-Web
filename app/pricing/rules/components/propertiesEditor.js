import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from 'components/FormFields/DropdownMenu';

function PropertiesEditor({ properties, selectableProperties, onChange, errorMessage, disabled }) {
  const handleOnChange = (key, selectedItem) => {
    const updatedProperties = [...properties];
    const idx = properties.findIndex(x => x.key === key);
    let updatedProperty;

    if (idx < 0) {
      updatedProperty = {};
      updatedProperties.push(updatedProperty);
    } else {
      updatedProperty = updatedProperties[idx];
    }
    updatedProperty.key = key;
    updatedProperty.value = selectedItem.key;
    updatedProperty.displayName = selectedItem.value;
    onChange(updatedProperties);
  };

  return selectableProperties.map(x => {
    const selectedProperty = properties.find(y => y.key === x.key);

    return (
      <DropdownMenu
        disabled={disabled}
        label={x.label}
        key={x.key}
        onChange={selectedItem => handleOnChange(x.key, selectedItem)}
        width="200px"
        defaultValue={selectedProperty?.displayName}
        errorMessage={errorMessage && errorMessage[x.key]}
        items={x.values.map(value => ({ key: value.code, value: value.label }))}
      />
    );
  });
}

PropertiesEditor.propTypes = {
  selectableProperties: PropTypes.array,
  properties: PropTypes.array,
  errorMessage: PropTypes.object
};

export default PropertiesEditor;
