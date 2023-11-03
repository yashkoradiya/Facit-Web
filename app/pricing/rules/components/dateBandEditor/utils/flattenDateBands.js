export default function flattenDateBands(dateBands) {
  return dateBands.map(dateBand => flatDateBand(dateBand));
}

export const flatDateBand = dateBand => {
  const flatDateBand = {
    key: dateBand.key,
    from: dateBand.from,
    to: dateBand.to,
    isNewDateBand: dateBand.isNewDateBand
  };

  dateBand.values.forEach(v => {
    if (v.durationGroup) {
      flatDateBand[`${v.durationGroup.key}_${v.valueDefinitionId}`] = v.value;
    } else {
      flatDateBand[`${v.valueDefinitionId}`] = v.value;
    }
  });

  return flatDateBand;
};
