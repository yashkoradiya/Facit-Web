import { render } from '@testing-library/react';
import React from 'react';
import PriceDetailToolTipRenderer from './PriceDetailTooltipRenderer';

describe('Price Detail Tooltip Renderer', () => {
  it('Should render the price value', () => {
    const screen = render(
      <PriceDetailToolTipRenderer
        displayValueGetter={param => param.value}
        priceComponentTypes={['component_margin']}
        forceKeepOpen={true}
        currency="AED"
        data={{
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
          ]
        }}
        value={205.3936}
      />
    );

    expect(screen.getByText(/205.3936/i)).toBeInTheDocument();
  });
});
