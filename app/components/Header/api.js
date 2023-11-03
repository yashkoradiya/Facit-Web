import * as http from '../../core/http/http';
import settings from '../../core/settings/settings';

export function publishPrices(priceIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/packaging/charterpackages/review/publish/`, priceIds, true, {});
  return res;
}

export function evaluatePrice(priceIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/packaging/charterpackages/review/evaluate/`, priceIds, true, {});
  return res;
}