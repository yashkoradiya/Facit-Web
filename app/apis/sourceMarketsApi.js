import * as http from '../core/http/http';
import settings from '../core/settings/settings';

export function getSourceMarkets() {
  if(settings.IS_MULTITENANT_ENABLED)
  {
   const base = settings.PRODUCT_INVENTORY_API;
   const res = http.get(`${base}/geography/multitenant/sourcemarkets`, null, true, {});
   return res;
  }
  else
  {
   const base = settings.FACIT_API;
   const res = http.get(`${base}/v1/sourcemarkets/`, null, true, {});
   return res;
  }
}
