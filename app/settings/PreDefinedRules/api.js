import * as http from 'core/http/http';
import settings from 'core/settings/settings';

export const getDateBands = () => {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/predefinedrules/datebands`, true, {});
  return res;
};

export const getDurationGroups = () => {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/predefinedrules/durationgroups`, true, {});
  return res;
};

export const createPreDefinedDateBandRule = preDefinedDateBandRule => {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/rules/predefinedrules/datebands`, preDefinedDateBandRule, true, {});
  return res;
};

export const updatePreDefinedDateBandRule = (id, preDefinedDateBandRule) => {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/rules/predefinedrules/datebands/${id}`, preDefinedDateBandRule, true, {});
  return res;
};

export const getPlanningPeriods = () => {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/rules/predefinedrules/planning-periods`, true, {});
  return res;
};

export const deleteDateBand = id => {
  const base = settings.FACIT_API;
  const res = http.delete(`${base}/v1/rules/predefinedrules/datebands/${id}`, true, {});
  return res;
};

export const createDurationGroup = durationGroup => {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/rules/predefinedrules/durationgroups`, durationGroup, true, {});
  return res;
};

export const updateDurationGroup = (id, durationGroup) => {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/rules/predefinedrules/durationgroups/${id}`, durationGroup, true, {});
  return res;
};

export const deleteDurationGroup = id => {
  const base = settings.FACIT_API;
  const res = http.delete(`${base}/v1/rules/predefinedrules/durationgroups/${id}`, true, {});
  return res;
};
