import * as http from '../core/http/http';
import settings from '../core/settings/settings';

export function getRuleDefinitions(ruleType) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/ruledefinitions/${ruleType}`, null, true, {});
  return res;
}

export function put(rule, transactionId) {
  const base = settings.FACIT_API;

  const payload = createRulePayload(rule, transactionId);
  const res = http.put(`${base}/v1/rules/${rule.id}`, payload, true, {});
  return res;
}

export function create(rule, transactionId) {
  const base = settings.FACIT_API;
  const payload = createRulePayload(rule, transactionId);
  return http.post(`${base}/v1/rules/`, payload, true, {});
}
export function get(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/${id}`, null, true, {});
  return res;
}

export function getSelectableItems(ruleType) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/selectableitems/${ruleType}`, null, true, {});
  return res;
}

export function remove(id) {
  const base = settings.FACIT_API;
  const res = http.delete(`${base}/v1/rules/${id}`, null, true, {});
  return res;
}

export function getAssignedAccommodations(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/${id}/assignedaccommodations`, null, true, {});
  return res;
}

export function search(search, ruleTypes, criteriaValues, propertyValues, sourceMarketIds, page = 1, pageSize = 1000) {
  const base = settings.FACIT_API;
  const res = http.post(
    `${base}/v1/rules/search`,
    {
      search,
      ruleTypes,
      criteriaValues,
      propertyValues,
      sourceMarketIds,
      page,
      pageSize
    },
    true,
    {}
  );
  return res;
}

export function searchPreview(
  previewRuleTypes,
  search,
  ruleTypes,
  criteriaValues,
  propertyValues,
  page = 1,
  pageSize = 1000
) {
  const base = settings.FACIT_API;
  const res = http.post(
    `${base}/v1/rules/search/preview`,
    {
      previewRuleTypes,
      searchInput: {
        search,
        ruleTypes,
        criteriaValues,
        propertyValues,
        page,
        pageSize
      }
    },
    true,
    {}
  );
  return res;
}

export function getAssignedProducts(ruleId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/${ruleId}/assignedproducts`, null, true, {});
  return res;
}

export function getPhasingReferenceCurve(data) {
  const base = settings.FACIT_API;

  const input = {
    maxCommitmentPercentage: data.selectedMaxCommitmentPercentage,
    seasonIds: data.season,
    countryIds: data.country,
    destinationIds: data.destination,
    resortIds: data.resort,
    accommodationIds: data.accommodationcode,
    classificationIds: data.classification,
    conceptIds: data.concept,
    labelIds: data.label,
    contractLevelIds: data.contractlevel,
  };
  const res = http.post(`${base}/v1/accommodation/costs/phasingreference`, input, true);
  return res;
}

export function simulateRuleMatching(input) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/rules/simulation`, input, true);

  return res;
}

export function validateRule(ruleType, rule) {
  const base = settings.FACIT_API;
  const input = rule;
  const res = http.post(`${base}/v1/rules/validate/${ruleType}`, createRulePayload(input), true);
  return res;
}

const createRulePayload = (rule, transactionId) => {
  const flatCriterias = [];
  rule.matchingCriterias.forEach(mc => {
    mc.values.forEach(v => {
      flatCriterias.push({ criteria: mc.criteriaKey, value: v.id, name: v.name, code: v.code });
    });
  });

  let payload = {
    ...rule,
    matchingCriterias: flatCriterias,
    configurations: rule.configurations.map(configuration => {
      return {
        ...configuration,
        dateBands: configuration.dateBands.map(dateBand => convertDateBandToBackendFormat(dateBand)),
        SourceMarketIds: configuration.sourceMarkets ? configuration.sourceMarkets.map(sm => sm.id) : []
      };
    }),
    transactionId
  };
  return payload;
};

const convertDateBandToBackendFormat = dateBand => {
  return {
    From: dateBand.from.format('YYYY-MM-DD'),
    To: dateBand.to.format('YYYY-MM-DD'),
    Values: dateBand.values.map(v => {
      return {
        ValueDefinitionId: v.valueDefinitionId,
        Value: v.value,
        From: v.durationGroup ? v.durationGroup.from : null,
        To: v.durationGroup ? v.durationGroup.to : null
      };
    })
  };
};