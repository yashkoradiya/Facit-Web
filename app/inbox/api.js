import * as http from 'core/http/http';
import settings from 'core/settings/settings';

export function getRejectedProducts(filters) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/rejected`, filters, true, {});
}

export function getNonContractedDiscounts(filters) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/publish-status/discounts/noncontracted`, filters, true, {});
}

export function getUnpublishedAccommodations(filters) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/unpublished`, filters, true, {});
}

export function getFailedExports(filters) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/failed-exports`, filters, true, {});
}

export function getChangedOfferings(filters) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/modified`, filters, true, {});
}

export function getPublishStatus(filters) {
  const base = settings.FACIT_API;
  return http.post(
    `${base}/v1/inbox/publish-status`,
    {
      destinationIds: filters.destination,
      seasonIds: filters.season,
      sourceMarketIds: filters.sourcemarket,
      accommodationIds: filters.accommodationcode,
      packageTypes: filters['package_type'],
      filterOnUser: filters.filterOnUser
    },
    true,
    {}
  );
}

export function republishOfferings(offerings) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/publish-status/republish`, offerings, true, {});
}

export function reevaluate(payload) {
  const base = settings.FACIT_API;
  return http.post(`${base}/v1/inbox/reevaluate`, payload, true, {});
}

export const packageOverviewUrlFromType = packageType => {
  switch (packageType) {
    case 'Accommodation only':
      return 'packaging/accommodation-only/search';
    case 'Charter package':
      return '/packaging/charter-package/search';
    case 'Dynamic cruise':
    case 'Charter flight':
    default:
      return '';
  }
};
