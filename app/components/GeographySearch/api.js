import * as http from '../../core/http/http';
import settings from '../../core/settings/settings';

export function getSourceMarkets() {
  const base = settings.PRODUCT_INVENTORY_API;

  return http.get(`${base}/geography/multitenant/sourcemarkets`, null, true, {});
}

export function getCountries() {
  const base = settings.PRODUCT_INVENTORY_API;
  return http.get(`${base}/geography/multitenant/countries`, null, true, {});
}

export function getDestinations() {
  const base = settings.PRODUCT_INVENTORY_API;
  return http.get(`${base}/geography/multitenant/destinations`, null, true, {});
}

export function getResorts() {
  const base = settings.PRODUCT_INVENTORY_API;
  return http.get(`${base}/geography/multitenant/resorts`, null, true, {});
}

export function getAccommodations() {
  const base = settings.PRODUCT_INVENTORY_API;
  return http.get(`${base}/geography/multitenant/accommodations`, null, true, {});
}

export function getMultitenantGeoData(sourceMarketIds) {
  const base = settings.PRODUCT_INVENTORY_API;
  return http.post(`${base}/geography/multitenant/all`, sourceMarketIds, true, {});
}

export function getPaginatedResorts(pageNo = 1, searchText = '', destinationIds = [], selectedIds = []) {
  const base = settings.FACIT_API;
  const paginationSize = settings.DROPDOWN_PAGINATION_SIZE;

  return http.post(
    `${base}/v1/geography/multitenant/resortpagination`,
    {
      pageSize: paginationSize,
      pageNo,
      searchText,
      parentIds: destinationIds,
      selectedIds
    },
    true,
    {}
  );
}

export function getDynamicAccom(pageNo = 1, searchText = '', resortIds = [], selectedIds = [], contractType = []) {
  const base = settings.FACIT_API;
  const paginationSize = settings.DROPDOWN_PAGINATION_SIZE;

  return http.post(
    `${base}/v1/geography/multitenant/accommodationpagination`,
    {
      pageSize: paginationSize,
      pageNo,
      searchText,
      parentIds: resortIds,
      selectedIds,
      contractType
    },
    true,
    {}
  );
}
