import * as http from 'core/http/http';
import settings from 'core/settings/settings';

const base = settings.FACIT_API;

export function getPlanningPeriods() {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/exchangerates/planningperiods`, null, true, {});

  return res;
}

export function getExchangeRates(planningPeriodId) {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/exchangerates/planningperiods/${planningPeriodId}/versions`, null, true, {});

  return res;
}

export function getEnabledCurrencies() {
  const base = settings.FACIT_API;
  const res = http.get(`${base}/v1/currency/enabled`, null, true, {});

  return res;
}

export function saveExchangeRate(planningPeriodId, rates) {
  const base = settings.FACIT_API;
  const res = http.post(`${base}/v1/exchangerates/planningperiods/${planningPeriodId}/versions`, rates, true, {});

  return res;
}

export function getExchangeRatesByDate(payload) {
  return http.post(`${base}/v1/exchangeratesbydate/ratesBydate/getversions`, payload, true, {});
}

export function saveExchangeRateByDates(payload) {
  return http.post(`${base}/v1/exchangeratesbydate/ratesBydate/createversions`, payload, true, {});
}

export function getExchangeRatesByDatePeriod() {
  return http.get(`${base}/v1/exchangeratesbydate/dateperiod`, null, true, {});
}
