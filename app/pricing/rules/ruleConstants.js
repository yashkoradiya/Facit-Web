export const ruleTabs = {
  accommodation: 'accommodation',
  flight: 'flight',
  transfers: 'transfers',
  charterPackage: 'charter-package',
  miscellaneousCost: 'miscellaneous-cost',
  distributionCost: 'distribution-cost',
  dynamicCruise: 'dynamic-cruise',
  vat: 'vat',
  roomUpgrade: 'room-upgrade',
  bulkAdjustment: 'bulk-adjustment',
  minMax: 'min-max'
};

export const valueTypes = {
  percentage: 'Percentage',
  absolute: 'Absolute',
  minThreshold: 'MinThreshold',
  maxThreshold: 'MaxThreshold',
  minRelativity: 'MinRelativity',
  maxRelativity: 'MaxRelativity'
};

export const ruleTypes = {
  accommodationComponent: 'accommodation_component',
  accommodationOnly: 'accommodation_only',
  distributionCost: 'distribution_cost',
  miscellaneousCost: 'miscellaneous_cost',
  dynamicCruise: 'dynamic_cruise',
  vat: 'vat',
  overOccupancy: 'over_occupancy',
  underOccupancy: 'under_occupancy',
  boardUpgrade: 'board_upgrade',
  mandatorySupplement: 'mandatory_supplement',
  ancillary: 'ancillary',
  charterFlightComponent: 'charter_flight_component',
  transferMarginComponent: 'transfer_margin_component',
  transfersComponent: 'transfers_component',
  charterPackage: 'charter_package',
  phasingReference: 'phasing_reference',
  roomUpgrade: 'room_upgrade',
  bulkAdjustment: 'bulk_adjustment',
  minMax: 'min_max',
  discount: 'discount',
  flightDistributionCost: 'charter_flight_distcostcomponent',
  transferDistributionCost: 'transfer_distribution_cost',
  guaranteeFundAccomMiscCost: 'guaranteefund_accom_misccostcomponent',
  guaranteeFundFlightMiscCost: 'guaranteefund_flight_misccostcomponent',
  flightVat: 'charter_flight_vat',
  transferVat: 'transfer_vat',
  accomReverse: 'reverse_charge'
};

export const ruleRoutes = {
  accommodationComponent: 'accommodation-component',
  accommodationOnly: 'accommodation-only',
  distributionCost: 'distribution-cost',
  miscellaneousCost: 'miscellaneous-cost',
  dynamicCruise: 'dynamic-cruise',
  vat: 'vat',
  overOccupancy: 'over-occupancy',
  underOccupancy: 'under-occupancy',
  boardUpgrade: 'board-upgrade',
  mandatorySupplement: 'mandatory-supplement',
  ancillary: 'ancillary',
  charterFlightComponent: 'charter-flight-component',
  transferMarginComponent: 'transfers-margin',
  charterPackage: 'charter-package',
  phasingReference: 'phasing',
  roomUpgrade: 'room-upgrade',
  bulkAdjustment: 'bulk-adjustment',
  minMax: 'min-max',
  flightVat: 'flight-vat',
  discount: 'discount',
  flightDistributionCost: 'flight-distribution-cost',
  transferDistribution: 'transfer-distribution-cost',
  transferVat: 'transfer-vat',
  guaranteeFundAccomMiscCost: 'guaranteefund-accom-misccostcomponent',
  guaranteeFundFlightMiscCost: 'guaranteefund-flight-misccostcomponent',
  reverseCharge: 'reverse-charge'
};

export const getRuleRoute = ruleType => {
  switch (ruleType) {
    case ruleTypes.accommodationComponent:
      return ruleRoutes.accommodationComponent;
    case ruleTypes.accommodationOnly:
      return ruleRoutes.accommodationOnly;
    case ruleTypes.miscellaneousCost:
      return ruleRoutes.miscellaneousCost;
    case ruleTypes.distributionCost:
      return ruleRoutes.distributionCost;
    case ruleTypes.dynamicCruise:
      return ruleRoutes.dynamicCruise;
    case ruleTypes.vat:
      return ruleRoutes.vat;
    case ruleTypes.overOccupancy:
      return ruleRoutes.overOccupancy;
    case ruleTypes.underOccupancy:
      return ruleRoutes.underOccupancy;
    case ruleTypes.boardUpgrade:
      return ruleRoutes.boardUpgrade;
    case ruleTypes.mandatorySupplement:
      return ruleRoutes.mandatorySupplement;
    case ruleTypes.ancillary:
      return ruleRoutes.ancillary;
    case ruleTypes.charterFlightComponent:
      return ruleRoutes.charterFlightComponent;
    case ruleTypes.charterPackage:
      return ruleRoutes.charterPackage;
    case ruleTypes.phasingReference:
      return ruleRoutes.phasingReference;
    case ruleTypes.roomUpgrade:
      return ruleRoutes.roomUpgrade;
    case ruleTypes.discount:
      return ruleRoutes.discount;
    case ruleTypes.bulkAdjustment:
      return ruleRoutes.bulkAdjustment;
    case ruleTypes.minMax:
      return ruleRoutes.minMax;
    case ruleTypes.flightVat:
      return ruleRoutes.flightVat;
    case ruleTypes.flightDistributionCost:
      return ruleRoutes.flightDistributionCost;
    case ruleTypes.transferDistributionCost:
      return ruleRoutes.transferDistribution;
    case ruleTypes.transferVat:
      return ruleRoutes.transferVat;
    case ruleTypes.transferMarginComponent:
      return ruleRoutes.transferMarginComponent;
    case ruleTypes.guaranteeFundAccomMiscCost:
      return ruleRoutes.guaranteeFundAccomMiscCost;
    case ruleTypes.guaranteeFundFlightMiscCost:
      return ruleRoutes.guaranteeFundFlightMiscCost;
    case ruleTypes.accomReverse:
      return ruleRoutes.reverseCharge;
    default:
      return '';
  }
};

export const getRuleTypeDisplayName = ruleType => {
  if (ruleType === 'accommodation_component') {
    return 'Acc. component';
  }
  if (ruleType === 'accommodation_only') {
    return 'Acc. only';
  }
  if (ruleType === 'charter_package') {
    return 'Package';
  }
  if (ruleType === 'over_occupancy') {
    return 'Over occupancy';
  }
  if (ruleType === 'under_occupancy') {
    return 'Under occupancy';
  }
  if (ruleType === 'board_upgrade') {
    return 'Board upgrade';
  }
  if (ruleType === 'mandatory_supplement') {
    return 'Mandatory supplement';
  }
  if (ruleType === 'ancillary') {
    return 'Ancillary';
  }
  if (ruleType === 'bulk_adjustment') {
    return 'Bulk adjustment';
  }
  if (ruleType === 'discount') {
    return 'Discount';
  }
  return 'Invalid rule type';
};

export const getRuleTypeEditCreateCopy = ruleType => {
  switch (ruleType) {
    case ruleTypes.accommodationComponent:
      return 'Accommodation Component Margin Template';
    case ruleTypes.accommodationOnly:
      return 'Accommodation Only Margin Template';
    case ruleTypes.overOccupancy:
      return 'Over Occupancy Margin Template';
    case ruleTypes.underOccupancy:
      return 'Under Occupancy Margin Template';
    case ruleTypes.miscellaneousCost:
      return 'Miscellaneous Cost Template';
    case ruleTypes.distributionCost:
      return 'Distribution Cost Margin Template';
    case ruleTypes.dynamicCruise:
      return 'Dynamic Cruise component Margin Template';
    case ruleTypes.vat:
      return 'VAT Margin Template';
    case ruleTypes.boardUpgrade:
      return 'Board Upgrade Margin Template';
    case ruleTypes.mandatorySupplement:
      return 'Mandatory Supplement Margin Template';
    case ruleTypes.ancillary:
      return 'Ancillary Margin Template';
    case ruleTypes.charterFlightComponent:
      return 'Charter Flight Margin Template';
    case ruleTypes.transferMarginComponent:
      return 'Transfers Margin Template';
    case ruleTypes.charterPackage:
      return 'Durational Accom Template';
    case ruleTypes.phasingReference:
      return 'Phasing Reference Template';
    case ruleTypes.roomUpgrade:
      return 'Room Upgrade Template';
    case ruleTypes.bulkAdjustment:
      return 'Bulk adjustment Template';
    case ruleTypes.minMax:
      return 'Min/Max Template';
    case ruleTypes.discount:
      return 'Discount Template';
    case ruleTypes.flightDistributionCost:
      return 'Distribution Cost Flight Template';
    case ruleTypes.transferDistributionCost:
      return 'Distribution Cost Transfer Template';
    case ruleTypes.guaranteeFundAccomMiscCost:
      return 'Guarantee Fund - Accom';
    case ruleTypes.guaranteeFundFlightMiscCost:
      return 'Guarantee Fund - Flight';
    case ruleTypes.flightVat:
      return 'Vat Flight Template';
    case ruleTypes.transferVat:
      return 'VAT Transfer Template';
    case ruleTypes.accomReverse:
      return 'Accom Reverse Charge Template';
    default:
      return 'Margin Template';
  }
};

export const getMatchingCriteriaTitle = key => {
  switch (key) {
    case 'season':
      return 'Planning period';
    case 'country':
      return 'Country';
    case 'destination':
      return 'Destination';
    case 'sourcemarket':
      return 'Source market';
    case 'resort':
      return 'Resort';
    case 'accommodation':
      return 'Accommodation';
    case 'commissionmarker':
      return 'Commission Marker';
    case 'classification':
      return 'Classification';
    case 'concept':
      return 'Concept';
    case 'label':
      return 'Label';
    case 'cost_label':
      return 'Cost label';
    case 'cruiseline':
      return 'Cruise line';
    case 'cruiseregion':
      return 'Cruise region';
    case 'destinationairport':
      return 'Destination airport';
    case 'contractlevel':
      return 'Contract level';
    case 'roomtypecategory':
      return 'Room category';
    case 'roomcode':
      return 'Room code';
    case 'contractstatus':
      return 'Status';
    case 'discount_type':
      return 'Discount Type';
    case 'departureairport':
      return 'Departure airport';
    case 'airline':
      return 'Airline';
    case 'weekday':
      return 'Weekday';
    case 'flight_template_type':
      return 'Template types';
    case 'producttype':
    case 'package_type':
    case 'product_type_for_vat':
    case 'product_type_for_distcost':
      return 'Product type';
    case 'area':
      return 'Area';
    case 'airport':
      return 'Airport';
    case 'transfer_type':
      return 'Transfer type';
    case 'value_type':
      return 'Value type';
    case 'transfer_direction':
      return 'Direction';
    default:
      return key;
  }
};

export const TransferTypeRules = [
  ruleTypes.transferDistributionCost,
  ruleTypes.transferMarginComponent,
  ruleTypes.transferVat
];

/**
 * An array of Dynamic rule type constants
 */
export const DynamicContractRuleTypes = [ruleTypes.miscellaneousCost, ruleTypes.distributionCost];
