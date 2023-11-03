import React from 'react';
import { render, screen } from 'test-utils';
import ValidationMessage from './ValidationMessage';
import { validationResponseMock } from './ConflictingRuleValidationMessage.test';

describe('ValidationMessage Component', () => {
  it('Should render ValidationMessage component with the correct message and ConflictingRuleValidationMessage', () => {
    render(<ValidationMessage validationResponse={validationResponseMock} />);

    const validationMessageText = screen.getByText(
      /A template with the same applicability criteria and date period already exists/i
    );
    expect(validationMessageText).toBeInTheDocument();
  });
});
