import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function getPackagePrices(inputModels) {
  console.log('inputModels');
  console.log(inputModels);
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/packaging/charterpackages/pricedetails`, inputModels, true, {});
  return res;
}

export function saveSellingPrice(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/packaging/charterpackages/price/adjustment`, inputModels, true, {});
  return res;
}
export function getFlightPrices(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/products/charterflights/${id}/detailsV1/`, true, {});
  return res;
}