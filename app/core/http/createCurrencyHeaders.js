import settings from '../settings/settings';

export default function createCurrencyHeaders() {
  try {
    return {
      'X-Currencies': settings.AVAILABLE_CURRENCIES
    };
  } catch (ex) {
    console.error('createCurrencyHeaders() error: ', ex);
    return null;
  }
}
