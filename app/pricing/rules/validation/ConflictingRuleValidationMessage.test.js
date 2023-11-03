import React from 'react';
import { render, screen } from 'test-utils';
import ConflictingRuleValidationMessage from './ConflictingRuleValidationMessage';
import userEvent from '@testing-library/user-event';

describe('ConflictingRuleValidationMessage Component', () => {
  test('Should render ConflictingRuleValidationMessage component with the correct message', async () => {
    const user = userEvent.setup();

    render(<ConflictingRuleValidationMessage validationResponse={validationResponseMock} />);

    const conflictingRuleNameLink = screen.getByText('Conflicting Rule 1');
    expect(conflictingRuleNameLink).toBeInTheDocument();
    expect(conflictingRuleNameLink.getAttribute('href')).toBe('/pricing/rules/templates/edit/1');

    const datePeriodText = screen.getByText(/Conflicting date period/i);
    const sourceMarketText = screen.getByText('Conflicting source market: Source Market 1');
    const costLabelText = screen.getByText('Conflicting cost Label: Cost Label 1');
    const flightMarginText = screen.getByText('Conflicting margin: Flight Margin 1');
    const directionText = screen.getByText('Conflicting direction: Direction 1');
    const seasonText = screen.getByText('Conflicting planning period: Season 1');
    const countryText = screen.getByText('Conflicting country: Country 1');
    const destinationText = screen.getByText('Conflicting destination: Destination 1');
    const resortText = screen.getByText('Conflicting resort: Resort 1');
    const conceptText = screen.getByText('Conflicting concept: Concept 1');
    const classificationText = screen.getByText('Conflicting classification: Classification 1');
    const accommodationCodeText = screen.getByText('Conflicting accommodation: Accommodation Code 1');
    const contractTypeText = screen.getByText('Conflicting contracttype: Contract Type 1');
    const roomTypeCategoryText = screen.getByText('Conflicting room type category: Room Type Category 1');
    const roomTypeCodeText = screen.getByText('Conflicting room type code: Room Type Code 1');

    expect(datePeriodText).toBeInTheDocument();
    expect(sourceMarketText).toBeInTheDocument();
    expect(costLabelText).toBeInTheDocument();
    expect(flightMarginText).toBeInTheDocument();
    expect(directionText).toBeInTheDocument();
    expect(seasonText).toBeInTheDocument();
    expect(countryText).toBeInTheDocument();
    expect(destinationText).toBeInTheDocument();
    expect(resortText).toBeInTheDocument();
    expect(conceptText).toBeInTheDocument();
    expect(classificationText).toBeInTheDocument();
    expect(accommodationCodeText).toBeInTheDocument();
    expect(contractTypeText).toBeInTheDocument();
    expect(roomTypeCategoryText).toBeInTheDocument();
    expect(roomTypeCodeText).toBeInTheDocument();
    await user.click(conflictingRuleNameLink);
  });
});

export const validationResponseMock = {
  conflictingRuleId: 1,
  conflictingRuleName: 'Conflicting Rule 1',
  conflictingRuleProperties: {
    datePeriod: [{ from: '2023-07-31', to: '2023-08-15' }],
    sourceMarket: 'Source Market 1',
    costLabel: 'Cost Label 1',
    flightMargin: 'Flight Margin 1',
    direction: 'Direction 1',
    season: 'Season 1',
    country: 'Country 1',
    destination: 'Destination 1',
    resort: 'Resort 1',
    concept: 'Concept 1',
    classification: 'Classification 1',
    accommodationcode: 'Accommodation Code 1',
    contracttype: 'Contract Type 1',
    roomtypecategory: 'Room Type Category 1',
    roomtypecode: 'Room Type Code 1'
  }
};
