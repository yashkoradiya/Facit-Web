import React from 'react';
import ValidationMessage from './validation/ValidationMessage';
import * as rulesApi from 'apis/rulesApi';
import { ruleTypes } from './ruleConstants';

export const ruleValidationFunctions = {
  accommodation_component: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('accommodation_component', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  charter_flight_distcostcomponent: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('charter_flight_distcostcomponent', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  transfer_distribution_cost: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule(ruleTypes.transferDistributionCost, rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return Promise.resolve({ isValid: validationResponse.isValid, message: messageDiv });
  },
  transfer_vat: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule(ruleTypes.transferVat, rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  transfer_margin_component: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule(ruleTypes.transferMarginComponent, rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return Promise.resolve({ isValid: validationResponse.isValid, message: messageDiv });
  },
  guaranteefund_accom_misccostcomponent: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('guaranteefund_accom_misccostcomponent', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  guaranteefund_flight_misccostcomponent: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('guaranteefund_flight_misccostcomponent', rule);
    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  charter_flight_vat: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('charter_flight_vat', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  mandatory_supplement: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('mandatory_supplement', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  miscellaneous_cost: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('miscellaneous_cost', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  over_occupancy: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('over_occupancy', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  under_occupancy: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('under_occupancy', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  accommodation_only: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('accommodation_only', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  min_max: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('min_max', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  charter_flight_component: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('charter_flight_component', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  vat: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('vat', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  charter_package: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('charter_package', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  board_upgrade: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('board_upgrade', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  bulk_adjustment: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('bulk_adjustment', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  distribution_cost: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('distribution_cost', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  dynamic_cruise: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('dynamic_cruise', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  ancillary: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule('ancillary', rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return new Promise(resolve => {
      resolve({ isValid: validationResponse.isValid, message: messageDiv });
    });
  },
  reverse_charge: async rule => {
    const { data: validationResponse } = await rulesApi.validateRule(ruleTypes.accomReverse, rule);

    let messageDiv = !validationResponse.isValid ? <ValidationMessage validationResponse={validationResponse} /> : null;
    return Promise.resolve({ isValid: validationResponse.isValid, message: messageDiv });
  }
};
