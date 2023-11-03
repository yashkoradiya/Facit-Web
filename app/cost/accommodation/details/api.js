import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function getAccommodationCostDetails(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}`, { definitionId }, true, {});
  return res;
}

export function getAccommodationRoomTypeBaseCosts(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/basecost`, { definitionId }, true, {});
  return res;
}

export function getAccommodationRoomTypeOccupancy(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/occupancy`, { definitionId }, true, {});
  return res;
}

export function getAccommodationChildCosts(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/childcost`, { definitionId }, true, {});
  return res;
}

export function getAccommodationUnderOccupancyCosts(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/underoccupancy`, { definitionId }, true, {});
  return res;
}

export function getAccommodationOverOccupancyCosts(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/overoccupancy`, { definitionId }, true, {});
  return res;
}

export function getMandatorySupplements(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/mandatorysupplement`, { definitionId }, true, {});
  return res;
}

export function getAncillaries(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/ancillaries`, { definitionId }, true, {});
  return res;
}

export function getBoardUpgrade(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/boardupgrade`, { definitionId }, true, {});
  return res;
}

export function getAllotmentData(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/allotment`, { definitionId }, true, {});
  return res;
}

export function getDiscounts(id, definitionId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/discount`, { definitionId }, true, {});
  return res;
}

export function getContractVersions(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/contractVersions`, null, true, {});
  return res;
}

export function getComments(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/cost/accommodation/details/${id}/comments`, null, true, {});
  return res;
}

export function updateComment(id, input) {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/cost/accommodation/details/${id}/comments`, input, true, {});
  return res;
}

export function addComment(id, input) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/cost/accommodation/details/${id}/comments`, input, true, {});
  return res;
}

export function deleteComment(id, commentId) {
  const base = settings.FACIT_API;
  const res = http.delete(`${base}/v1/cost/accommodation/details/${id}/comments/${commentId}`, null, true, {});
  return res;
}

export function updateAverageUnderOccupancy(id, value) {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/cost/accommodation/details/${id}/averageunderoccupancy`, { value: value }, true, {});
  return res;
}

export function updateCostPhasingOverride(id, setting) {
  const base = settings.FACIT_API;
  const res = http.put(
    `${base}/v1/cost/accommodation/details/${id}/updatecostphasingoverride`,
    { overrideSetting: setting },
    true,
    {}
  );
  return res;
}

export function updateBaseRooms(id, input) {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/cost/accommodation/details/${id}/baserooms`, input, true, {});
  return res;
}


export function updateCalculationMethod(id, setting) {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/accommodation/${id}/setting/calculationmethod`, { setting }, true, {});
  return res;
}
