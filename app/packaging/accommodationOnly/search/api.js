import * as http from 'core/http/http';
import settings from 'core/settings/settings';
import { getDateFormat } from '../../../helpers/dateHelper';

export function search(searchData) {
  const base = settings.FACIT_API;
  const payload = createSearchPayload(searchData);
  const res = http.post(`${base}/v1/offerings/accommodationonly/search`, payload, true, {});
  return res;
}

export function searchPreview(searchData) {
  const base = settings.FACIT_API;

  const payload = createSearchPayload(searchData);
  const res = http.post(`${base}/v1/offerings/accommodationonly/search/preview/`, payload, true, {});
  return res;
}

export function getReview(accommodationIds) {
  const base = settings.FACIT_API;

  const res = http.post(`${base}/v1/offerings/accommodationonly/review/`, accommodationIds, true, {});
  return res;
}

export function publishPrices({ id, sourceMarketId }) {
  const base = settings.FACIT_API;

  const res = http.post(
    `${base}/v1/offerings/accommodationonly/${id}/publish?sourceMarketId=${sourceMarketId}`,
    null,
    true,
    {}
  );
  return res;
}

const createSearchPayload = searchData => {
  return {
    page: searchData.page,
    from: searchData.fromDate ? searchData.fromDate.format(getDateFormat()) : '',
    to: searchData.toDate ? searchData.toDate.format(getDateFormat()) : '',
    seasonIds: searchData.season ?? [],
    sourceMarketIds: searchData.sourcemarket ?? [],
    countryIds: searchData.country ?? [],
    destinationIds: searchData.destination ?? [],
    resortIds: searchData.resort ?? [],
    accommodationIds: searchData.accommodationcode ?? [],
    classificationIds: searchData.classification ?? [],
    roomCodes: searchData.roomcode ?? [],
    onlyBaseRooms: searchData.baseRoomSelected ,
    onlyUnpublished: searchData.onlyUnpublished 
  };
};
