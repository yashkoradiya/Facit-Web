import * as http from '../core/http/http';
import settings from '../core/settings/settings';

export function getProductTypes() {
   const base = settings.PRODUCT_INVENTORY_API;
   const res = http.get(`${base}/BrandProductTypeCombinations/GetProductTypes`, null, true, {});
   return res;
 }

