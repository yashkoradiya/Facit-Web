export const getSelectedMatchingCriteriaDefinitions = (marginTemplateDefinitions, definitionId) => {
  const templateIndex = marginTemplateDefinitions.findIndex(mtd => mtd.get('id') === definitionId);
  return marginTemplateDefinitions.getIn([templateIndex, 'matchingCriteriaDefinitions']);
};
