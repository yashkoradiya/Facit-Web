import * as http from '../core/http/http';
import settings from '../core/settings/settings';

export function search(sourceMarketIds, seasonIds, destinationAirportIds) {
  const base = settings.FACIT_API;
  const res = http.post(
    `${base}/v1/products/charterflights/referenceflight/search`,
    {
      sourceMarketIds,
      seasonIds,
      destinationAirportIds
    },
    true,
    {}
  );
  return res;
}
