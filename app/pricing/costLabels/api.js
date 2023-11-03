import * as http from 'core/http/http';
import settings from 'core/settings/settings';

export function getCostLabels() {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/costlabels`, null, true, {});
  return res;
}

export function updateCostLabel(id, name) {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/rules/costlabels/${id}`, { name }, true, {});
  return res;
}

export function createCostLabel(name) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/rules/costlabels`, { name }, true, {});
  return res;
}

export function deleteCostLabel(id) {
  const base = settings.FACIT_API;
  const res = http.delete(`${base}/v1/rules/costlabels/${id}`, null, true, {});
  return res;
}
