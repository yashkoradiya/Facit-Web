export default function unflattenDateBands(flatDateBands, durationGroups) {
  return flatDateBands
    .filter(x => !x.isNewDateBand)
    .map(flatDateBand => {
      const dateBand = {
        key: flatDateBand.key,
        from: flatDateBand.from,
        to: flatDateBand.to,
        values: []
      };

      const ignoreProperties = ['isNewDateBand'];
      Object.keys(flatDateBand).forEach(key => {
        if (key in dateBand || ignoreProperties.some(x => x === key)) return;

        if (key.includes('_')) {
          const [durationKey, valueDefinitionId] = key.split('_');
          const durationGroup = durationGroups.find(x => x.key === durationKey);

          dateBand.values.push({
            valueDefinitionId: parseInt(valueDefinitionId),
            value: flatDateBand[key],
            durationGroup: durationGroup
          });
        } else {
          dateBand.values.push({
            valueDefinitionId: parseInt(key),
            value: flatDateBand[key]
          });
        }
      });

      return dateBand;
    });
}
