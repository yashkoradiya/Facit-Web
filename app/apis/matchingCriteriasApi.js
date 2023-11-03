import * as http from '../core/http/http';
import settings from '../core/settings/settings';

const base = settings.FACIT_API;
export function get(keys) {
  let query = '?';
  keys.forEach(key => (query = query + 'key=' + key + '&'));

  if (settings.IS_MULTITENANT_ENABLED) {
    const res = http.get(`${base}/v1/matchingcriteria/multitenant/${query}`, null, true, {});
    return res;
  } else {
    const res = http.get(`${base}/v1/matchingcriteria${query}`, null, true, {});
    return res;
  }
}

export function getCommissionMarker() {
  return http.get(`${base}/v1/matchingcriteria/commissionmarker`, null, true, {});
}
