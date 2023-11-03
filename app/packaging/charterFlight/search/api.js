import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';

export function searchFlightSeries(filters) {
  const base = settings.FACIT_API;

  const payload = getSearchPayload(filters);

  const res = http.post(`${base}/v1/products/charterflights/search`, payload, true, {});
  return res;
}

export function previewSearchFlightSeries(filters) {
  const base = settings.FACIT_API;

  const payload = getSearchPayload(filters);
  
  const res = http.post(`${base}/v1/products/charterflights/search/preview`, payload, true, {});
  return res;
}

export function getDetails(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/products/charterflights/${id}/details/`, true, {});
  return res;
}

export function getDetailsReport(filters) {
  const base = settings.FACIT_API;
  const payload = getSearchPayload(filters);
  const res = http.post(`${base}/v1/products/charterflights/report`, payload, true, {});
  return res;
}

export function createReferenceFlight(id, name) {
  const base = settings.FACIT_API;
  const res = http.post(
    `${base}/v1/products/charterflights/referenceflight`,
    { charterFlightId: id, name: name },
    true,
    {}
  );
  return res;
}

export function updateReferenceFlight(referenceFlightId, id, name) {
  const base = settings.FACIT_API;
  const res = http.put(
    `${base}/v1/products/charterflights/referenceflight/${referenceFlightId}`,
    { charterFlightId: id, name: name },
    true,
    {}
  );
  return res;
}

export function getReferenceFlightPreview(id) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/products/charterflights/referenceflight/preview/${id}`, true, {});
  return res;
}

export function publishPrices(priceIds) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/products/charterflights/review/publish`, priceIds, true, {});
  return res;
}

export function EvaluatePrices(priceIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/products/charterflights/review/evaluate`, priceIds, true, {});
  return res;
}
const getSearchPayload = filters => ({
  seasonIds: filters.seasonId,
  sourceMarketIds: filters.sourceMarketIds,
  departureAirportIds: filters.departureAirportIds,
  destinationAirportIds: filters.destinationAirportIds,
  airlineCodes: filters.airlineCodes,
  weekdays: filters.weekdays,
  fromDate: filters.fromDate,
  toDate: filters.toDate,
  onlyUnpublished: filters.onlyUnpublished,
  productTypes: filters.productTypeIds
});
