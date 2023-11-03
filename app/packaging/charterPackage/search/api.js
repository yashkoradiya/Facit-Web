import * as http from '../../../core/http/http';
import settings from '../../../core/settings/settings';
import { getDateFormat } from '../../../helpers/dateHelper';

export function search(searchData) {
  const base = settings.FACIT_API;
  const payload = createSearchPayload(searchData);
  const res = http.post(`${base}/v1/packaging/charterpackages/search/`, payload, true, {});
  return res;
}

export function searchPreview(searchData) {
  const base = settings.FACIT_API;
  const payload = createSearchPayload(searchData);
  const res = http.post(`${base}/v1/packaging/charterpackages/preview/`, payload, true, {});
  return res;
}

export function getReview(accommodationIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/packaging/charterpackages/review/`, accommodationIds, true, {});
  return res;
}

export function getEvaluateReview(accommodationIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/packaging/charterpackages/reviews/`, accommodationIds, true, {});
  return res;
}

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

const createSearchPayload = searchData => {
  return {
    page: searchData.page,
    from: searchData.fromDate ? searchData.fromDate.format(getDateFormat(4)) : '',
    to: searchData.toDate ? searchData.toDate.format(getDateFormat(4)) : '',
    sourceMarketIds: searchData.sourcemarket ?? [],
    countryIds: searchData.country ?? [],
    destinationIds: searchData.destination ?? [],
    resortIds: searchData.resort ?? [],
    accommodationIds: searchData.accommodationcode ?? [],
    seasonIds: searchData.season ?? [],
    classifications: searchData.classification ?? [],
    productTypes: searchData.producttype ?? [],
    roomCodes: searchData.roomcode ?? [],
    onlyBaseRooms: searchData.baseRoomSelected,
    onlyUnpublished: searchData.onlyUnpublished
  };
};
