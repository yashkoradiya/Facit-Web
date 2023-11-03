export const updateDateBandValue = (dateBandKey, propertyName, value, flatDateBands) => {
  return flatDateBands.map(flatDateBand => {
    if (flatDateBand.key === dateBandKey) {
      return { ...flatDateBand, [propertyName]: value };
    }
    return flatDateBand;
  });
};

export const getColumnValueByKey = (dateBandKey, propertyName, value, flatDateBands) => 
{
  return flatDateBands.filter(data => data.key === dateBandKey)
};

export const updateDateBandsWithDuration = (flatDateBands, durationGroups) => {
  if (!durationGroups) return flatDateBands;
  return flatDateBands.map(flatDateBand => {
    const propertyNames = Object.keys(flatDateBand).filter(x => x.indexOf('_') !== -1);
    const valueDefinitionIds = [];

    propertyNames.forEach(propertyName => {
      const [durationKey, valueDefinitionId] = propertyName.split('_');
      valueDefinitionIds.push(valueDefinitionId);

      if (!durationGroups.some(dg => dg.key === durationKey)) {
        delete flatDateBand[propertyName];
      }
    });

    durationGroups.forEach(durationGroup => {
      valueDefinitionIds.forEach(id => {
        const key = durationGroup.key + '_' + id;
        if (!flatDateBand[key]) {
          flatDateBand[key] = null;
        }
      });
    });

    return { ...flatDateBand };
  });
};
