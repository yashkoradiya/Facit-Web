import * as http from '../core/http/http';
import settings from '../core/settings/settings';

const removeSlashApi = string => {
  return string.slice(0, -4);
};

export const getServiceVersions = () => {
  const baseApi = settings.FACIT_API;
  const base = removeSlashApi(baseApi);
  const res = http.get(`${base}/versions`, null, true, {});
  return res;
};
