import * as http from 'core/http/http';
import settings from 'core/settings/settings';

export const getDiscountGroups = () => {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/accommodation/discount/group`, null, true, {});
  return res;
};

export const saveDiscountGroups = discountGroups => {
  const base = settings.FACIT_API;
  const res = http.put(`${base}/v1/accommodation/discount/group`, { discountGroups }, true, {});
  return res;
};
