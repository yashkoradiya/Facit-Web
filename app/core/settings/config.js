export default {
  LOCAL: {
    AVAILABLE_CURRENCIES: ['AED', 'DKK', 'EUR', 'GBP', 'MAD', 'NOK', 'SEK', 'THB', 'USD'],
    CLIENT_ID: 'facit.web',
    FACIT_API: ' http://localhost:4000/api',
    PRODUCT_INVENTORY_API: ' http://localhost:4001/api',
    SOCKETS_HUB: 'http://localhost:1004/facithub',
    LOCALE: 'sv',
    SHOW_BASEROOMS: true,
    IS_MULTITENANT_ENABLED: false,
    DROPDOWN_PAGINATION_SIZE: 2000
  },
  DEV: {
    AVAILABLE_CURRENCIES: ['AED', 'DKK', 'EUR', 'GBP', 'MAD', 'NOK', 'SEK', 'THB', 'USD'],
    CLIENT_ID: 'facit.web',
    FACIT_API: 'https://facitng-api-dev.facitng.aws.tuicloud.net/api',
    PRODUCT_INVENTORY_API: 'https://facitng-inv-dev.facitng.aws.tuicloud.net/api',
    SOCKETS_HUB: 'https://facitng-sockets-dev.facitng.aws.tuicloud.net/facithub',
    LOCALE: 'sv',
    SHOW_BASEROOMS: true,
    IS_MULTITENANT_ENABLED: false,
    DROPDOWN_PAGINATION_SIZE: 2000
  },
  SIT: {
    AVAILABLE_CURRENCIES: ['AED', 'DKK', 'EUR', 'GBP', 'MAD', 'NOK', 'SEK', 'THB', 'USD'],
    CLIENT_ID: 'facit.web',
    FACIT_API: 'https://facitng-api-sit.facitng.aws.tuicloud.net/api',
    PRODUCT_INVENTORY_API: 'https://facitng-inv-sit.facitng.aws.tuicloud.net/api',
    SOCKETS_HUB: 'https://facitng-sockets-sit.facitng.aws.tuicloud.net/facithub',
    LOCALE: 'sv',
    SHOW_BASEROOMS: true,
    IS_MULTITENANT_ENABLED: false,
    DROPDOWN_PAGINATION_SIZE: 2000
  },
  PRE_PROD: {
    AVAILABLE_CURRENCIES: ['AED', 'DKK', 'EUR', 'GBP', 'MAD', 'NOK', 'SEK', 'THB', 'USD'],
    CLIENT_ID: 'facit.web',
    FACIT_API: 'https://facitng-api-pprd.facitng.aws.tuicloud.net/api',
    PRODUCT_INVENTORY_API: 'https://facitng-inv-pprd.facitng.aws.tuicloud.net/api',
    SOCKETS_HUB: 'https://facitng-sockets-pprd.facitng.aws.tuicloud.net/facithub',
    LOCALE: 'sv',
    SHOW_BASEROOMS: true,
    IS_MULTITENANT_ENABLED: false,
    DROPDOWN_PAGINATION_SIZE: 2000
  },
  PROD: {
    AVAILABLE_CURRENCIES: ['AED', 'DKK', 'EUR', 'GBP', 'MAD', 'NOK', 'SEK', 'THB', 'USD'],
    CLIENT_ID: 'facit.web',
    FACIT_API: 'https://api.facitng.aws.tuicloud.net/api',
    PRODUCT_INVENTORY_API: 'https://inv.facitng.aws.tuicloud.net/api',
    SOCKETS_HUB: 'https://sockets.facitng.aws.tuicloud.net/facithub',
    LOCALE: 'sv',
    SHOW_BASEROOMS: true,
    PRODUCTION: true,
    IS_MULTITENANT_ENABLED: false,
    DROPDOWN_PAGINATION_SIZE: 2000
  }
};
