import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function getPrices(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/offerings/accommodationonly/prices`, inputModels, true, {});
  return res;
}

export function saveSellingPrice(inputModels) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/offerings/accommodationonly/price/adjustment`, inputModels, true, {});
  return res;
}
