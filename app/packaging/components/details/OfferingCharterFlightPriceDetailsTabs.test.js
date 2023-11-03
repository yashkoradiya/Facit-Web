import { render } from '@testing-library/react';
import { getColumnDefinitions } from 'packaging/charterFlight/details/PriceDetailsForCharterFlights';
import React from 'react';
import OfferingCharterFlightPriceDetailsTabs from './OfferingCharterFlightPriceDetailsTabs';
import userEvent from '@testing-library/user-event';

describe('OfferingCharterFlightPriceDetailsTabs', () => {
  it('should render the component', () => {
    const baseGridKey = 'CharterFlightDetailedPricing';
    const comfortPriceDetailsData = [];
    const currentTab = 'price-details';
    const selectedCurrency = 'AED';
    const priceDetailsData = [
      {
        key: 'MF1256',
        masterId: 'MF1256',
        sourceMarketName: 'TUI_BE',
        ageCategoryType: 'Adult & Child',
        allotment: 148,
        calculatedCost: {
          values: {
            AED: 1026.98012,
            DKK: 2290.36903,
            EUR: 254.203,
            GBP: 216.07255,
            MAD: 279.6233,
            NOK: 1837.88769,
            SEK: 2600.49669,
            THB: 8246.34532,
            USD: 292.33345
          }
        },
        contractCost: {
          values: {
            AED: 1026.98012,
            DKK: 2290.36903,
            EUR: 254.203,
            GBP: 216.07255,
            MAD: 279.6233,
            NOK: 1837.88769,
            SEK: 2600.49669,
            THB: 8246.34532,
            USD: 292.33345
          }
        },
        distributionCost: {
          values: {
            AED: 0,
            DKK: 0,
            EUR: 0,
            GBP: 0,
            MAD: 0,
            NOK: 0,
            SEK: 0,
            THB: 0,
            USD: 0
          }
        },
        direction: 'OB',
        emptyLegFactor: 0,
        margin: {
          values: {
            AED: 205.3936,
            DKK: 458.0684,
            EUR: 50.84,
            GBP: 43.214,
            MAD: 55.924,
            NOK: 367.5732,
            SEK: 520.0932,
            THB: 1649.2496,
            USD: 58.466
          }
        },
        vat: {
          values: {
            AED: 0,
            DKK: 0,
            EUR: 0,
            GBP: 0,
            MAD: 0,
            NOK: 0,
            SEK: 0,
            THB: 0,
            USD: 0
          }
        },
        totalPrice: {
          values: {
            AED: 1380,
            DKK: 3076,
            EUR: 342,
            GBP: 291,
            MAD: 376,
            NOK: 2469,
            SEK: 3493,
            THB: 11075,
            USD: 393
          }
        },
        taxCost: {
          values: {
            AED: 146.854,
            DKK: 327.5135,
            EUR: 36.35,
            GBP: 30.8975,
            MAD: 39.985,
            NOK: 262.8105,
            SEK: 371.8605,
            THB: 1179.194,
            USD: 41.8025
          }
        },
        weekday: 'Su',
        date: '2022-04-03T13:35:00',
        tooltips: [
          {
            priceComponentType: 'component_margin',
            amount: {
              values: {
                AED: 205.3936,
                DKK: 458.0684,
                EUR: 50.84,
                GBP: 43.214,
                MAD: 55.924,
                NOK: 367.5732,
                SEK: 520.0932,
                THB: 1649.2496,
                USD: 58.466
              }
            },
            id: 4425,
            name: 'FlightMarginTemplate_1',
            sortOrder: 4
          }
        ],
        seatClassName: 'economy',
        guaranteeFundFlightCost: {
          values: {
            AED: 0,
            DKK: 0,
            EUR: 0,
            GBP: 0,
            MAD: 0,
            NOK: 0,
            SEK: 0,
            THB: 0,
            USD: 0
          }
        },
        productType: ['FLY_AND_STAY']
      }
    ];

    const screen = render(
      <OfferingCharterFlightPriceDetailsTabs
        baseGridKey={baseGridKey}
        comfortPriceDetailsData={comfortPriceDetailsData}
        currentTab={currentTab}
        selectedCurrency={selectedCurrency}
        priceDetailsColDefs={getColumnDefinitions({})}
        priceDetailsData={priceDetailsData}
      />
    );

    const economyBtn = screen.getByText(/economy/i);
    const premiumBtn = screen.getByText(/premium/i);
    const comfortBtn = screen.getByText(/comfort/i);

    expect(economyBtn).toBeInTheDocument();
    userEvent.click(economyBtn);
    expect(premiumBtn).toBeInTheDocument();
    expect(comfortBtn).toBeInTheDocument();
  });
});
