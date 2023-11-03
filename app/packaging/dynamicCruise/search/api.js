import * as http from 'core/http/http';
import settings from 'core/settings/settings';

export function search(searchData) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/offerings/dynamiccruise/search`, searchData, true, {});
  return res;
}

export function searchPreview(searchData) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/offerings/dynamiccruise/search/preview/`, searchData, true, {});
  return res;
}

export function getCruiseFilters() {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/products/cruise/filters/`, null, true, {});
  return res;
}

export function publishPrices(cruiseIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/offerings/dynamiccruise/review/publish/`, cruiseIds, true, {});
  return res;
}
