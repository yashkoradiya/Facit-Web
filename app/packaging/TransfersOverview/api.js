import * as http from '../../core/http/http';
import settings from '../../core/settings/settings';

const base = settings.FACIT_API;

export function search(payload) {
  return http.post(`${base}/v1/packaging/transfers/search/`, payload, true, {});
}

export function transfersPreview(payload) {
  return http.post(`${base}/v1/packaging/transfers/preview/`, payload, true, {});
}

export function getReview(transferIds) {
  return http.post(`${base}/v1/packaging/transfers/review/`, transferIds, true, {});
}
export function getEvaluateReview(transferIds){
  return http.post(`${base}/v1/packaging/transfers/reviews/`, transferIds, true, {});
}

export function publishPrices(priceIds) {
  return http.post(`${base}/v1/packaging/transfers/review/publish/`, priceIds, true, {});
}
export function evaluatePrices(priceIds){
  return http.post(`${base}/v1/packaging/transfers/review/evaluate/`, priceIds,true, {});
}

export function getTransferPricesAPI(id = '', productType = '') {
  return http.post(
    `${base}/v1/packaging/transfers/pricedetails`,
    {
      transferId: id,
      productType
    },
    true,
    {}
  );
}
