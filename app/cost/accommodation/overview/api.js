import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function searchAccommodationDefinitions(searchData) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/accommodation/definitions/search`, searchData, true, {});
  return res;
}

export function previewSearchAccommodationDefinitions(searchData) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/accommodation/definitions/search/preview`, searchData, true, {});
  return res;
}

export function getContractStatus() {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/accommodation/definitions/contractstatus`);
  return res;
}
