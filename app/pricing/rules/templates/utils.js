import { List, Map } from 'immutable';
import MatchingCriteriaValue from '../../utils/MatchingCriteriaValue';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import settings from 'core/settings/settings';
import { DynamicContractRuleTypes, ruleTypes } from './../ruleConstants';

/**
 * Adding ruleType parameter for including Dynamic accommodation for Misc cost template.
 * @param {*} matchingCriterias
 * @param {*} matchingCriteriaDefinitions
 * @param {*} ruleType
 * @returns matching criteria list
 */
export const getMatchingCriteriaDefinitionValues = (matchingCriterias, matchingCriteriaDefinitions, ruleType = '') => {
  let matchingCriterasWithValues = [];
  matchingCriterias.forEach(mc => {
    const key = mc.key;
    const values = mc.values.map(value => {
      if (settings.IS_MULTITENANT_ENABLED) {
        return new MatchingCriteriaValue({
          id: value.id,
          name: value.name,
          code: value.code,
          parentIds: value.parentIds,
          sourceMarketIds: value.sourceMarketIds,
          parentCountryIds: value.parentCountryIds,
          parentDestinationIds: value.parentDestinationIds
        });
      } else {
        return new MatchingCriteriaValue({
          id: value.id,
          name: value.name,
          code: value.code,
          parentIds: value.parentId,
          sourceMarketIds: value.sourceMarketIds,
          parentCountryIds: value.parentCountryIds,
          parentDestinationIds: value.parentDestinationIds
        });
      }
    });

    let matchingCriteriaDefinition = matchingCriteriaDefinitions.find(o => o.get('criteriaKey') === key);
    matchingCriteriaDefinition = matchingCriteriaDefinition.set('values', values);
    matchingCriterasWithValues.push(matchingCriteriaDefinition);

    let resortCriteriaDefinition = matchingCriteriaDefinitions.find(o => o.get('criteriaKey') === 'resort');
    if (key === 'destination' && resortCriteriaDefinition?.size) {
      resortCriteriaDefinition = resortCriteriaDefinition.set('values', []);
      matchingCriterasWithValues.push(resortCriteriaDefinition);
    }

    let accommCriteriaDefinition = matchingCriteriaDefinitions.find(o => o.get('criteriaKey') === 'accommodationcode');

    // Add the dynamic accommodation criteria after the 'Classification' criteria
    if (key === 'classification' && DynamicContractRuleTypes.includes(ruleType) && accommCriteriaDefinition?.size) {
      accommCriteriaDefinition = accommCriteriaDefinition.set('values', []);
      matchingCriterasWithValues.push(accommCriteriaDefinition);
    }
  });
  return List(matchingCriterasWithValues);
};

export const mapPropertiesFromBackend = properties => {
  return properties.map(property => {
    return {
      key: property.key,
      label: property.label,
      multiChoice: property.multiChoice,
      values: property.values.map(value => {
        return {
          label: value.displayName,
          value: value.value,
          code: value.value
        };
      })
    };
  });
};

export const parseConfiguration = input => {
  const configurations = JSON.parse(input);
  return configurations.map(configuration => {
    return {
      ...configuration,
      dateBands: configuration.dateBands.map(dateBand => {
        return {
          key: uuidv4(),
          from: moment(dateBand.from),
          to: moment(dateBand.to),
          values: dateBand.values
        };
      })
    };
  });
};

/**Returns a list of charter flight related rule type constants */
export const FlightRuleTemplates = [
  ruleTypes.charterFlightComponent,
  ruleTypes.guaranteeFundFlightMiscCost,
  ruleTypes.flightDistributionCost,
  ruleTypes.flightVat
];

/**
 * This verifies whether the dynamic accommodation is enabled and applicability contains dynamic accommodation values.
 * If it fails it returns undefined else it returns the Dynamic Accommodation Items with patched options.
 *
 * @param {Number} dynamicAccommOptionsIdx
 * @param {Map} dynamicAccommodation redux state
 * @param {List} applicability
 * @returns Immutable Map
 */
export const parseDynamicAccommValues = (
  dynamicAccommOptionsIdx,
  dynamicAccommodation = Map(),
  applicability = List()
) => {
  if (dynamicAccommodation.get('dynamicAccommodationEnabled') && dynamicAccommOptionsIdx > -1) {
    const dynamicAccommOptions = dynamicAccommodation.get('dynamicAccomList');

    const appAccommsItems = applicability
      .get(dynamicAccommOptionsIdx)
      .get('values')
      .map(i => i.id);

    const dynamicAccomItems = dynamicAccommOptions?.map(dI => dI.id);

    if (dynamicAccommOptions?.length && dynamicAccomItems?.filter(i => !appAccommsItems.includes(i)).length) {
      const dynamicAccommItem = applicability.get(dynamicAccommOptionsIdx);
      const valueItems = dynamicAccommOptions.map(
        value =>
          new MatchingCriteriaValue({
            id: value.id,
            name: value.name,
            code: value.code,
            parentIds: value.parentIds,
            sourceMarketIds: value.sourceMarketIds,
            parentCountryIds: value.parentCountryIds,
            parentDestinationIds: value.parentDestinationIds
          })
      );

      return dynamicAccommItem.set('values', valueItems);
    }
  }
};
