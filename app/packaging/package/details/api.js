import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function getPackagePrices(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/packaging/charterpackages/pricedetails`, inputModels, true, {});
  return res;
}

export function getPackagePricesV2(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/packaging/charterpackages/pricedetails/v2`, inputModels, true, {});
  return res;
}

export function saveSellingPrice(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/packaging/charterpackages/price/adjustment`, inputModels, true, {});
  return res;
}