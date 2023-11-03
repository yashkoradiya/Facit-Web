import React from 'react';
import ConflictingRuleValidationMessage from './ConflictingRuleValidationMessage';

export default function ValidationMessage({ validationResponse }) {
  return (
    <div>
      A template with the same applicability criteria and date period already exists:
      <ConflictingRuleValidationMessage validationResponse={validationResponse} />
      In order to save your new template, please change the applicability criteria or the date period.
    </div>
  );
}
