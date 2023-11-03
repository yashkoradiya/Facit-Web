import React, { PureComponent } from 'react';
import { List, fromJS } from 'immutable';
import { withRouter } from 'react-router-dom';
import { Flexbox } from '../../../components/styled/Layout';
import DropdownMenu from '../../../components/FormFields/DropdownMenu';
import PropTypes from 'prop-types';
import * as matchingCriteriasApi from '../../../apis/matchingCriteriasApi';
import * as rulesApi from '../../../apis/rulesApi';
import {
  FlightRuleTemplates,
  getMatchingCriteriaDefinitionValues,
  parseConfiguration,
  parseDynamicAccommValues
} from '../templates/utils';
import EditRule from './EditRule/editRule';
import { DropdownLabel } from '../../../components/styled/Dropdown';
import { addSpecificValidationToValueDefinition } from '../../utils/validators';
import DefaultConfigurationsEditor from './DefaultConfigurationsEditor/DefaultConfigurationsEditor';
import { DynamicContractRuleTypes, ruleTypes } from '../ruleConstants';
import { getFlighProductTypes } from 'packaging/packaging-utils';
import { connect } from 'react-redux';
import MatchingCriteriaValue from './../../utils/MatchingCriteriaValue';
import { filterCriteriasBasedOnAccommodations } from 'components/FormFields/form-fields-utils';

const getDefaultRule = props => {
  let configurations;
  if (props.selectableSourceMarkets && props.selectableSourceMarkets.length > 0) {
    configurations = [
      {
        sourceMarkets: [],
        durationGroups: props.selectableDurationGroups || [],
        dateBands: []
      }
    ];
  } else {
    configurations = [
      {
        dateBands: []
      }
    ];
  }

  return {
    currency: 'EUR',
    properties: props.defaultProperties,
    configurations,
    valueDefinitions: List(),
    selectedMargin: List(),
    selectedDefinition: props.ruleDefinitions[0] === null ? [] : props.ruleDefinitions[0],
    selectedTemplate: List(),
    flightTemplateType: '',
    distSelected: true,
    vatSelected: false,
    marginSelected: false,
    guaranteedSelected: false
  };
};

class CreateRule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ruleDefinitions: props.ruleDefinitions,
      templateMargins: props.templateMargins,
      unitTypes: props.unitTypes,
      filteredDefinitions: null,
      selectedRuleDefinition: null,
      selectedApplicability: List(),
      selectedMargins: List(),
      selectedUnitType: List(),
      defaultRule: getDefaultRule(props),
      selectedFlightTemplateType: null
    };
  }

  componentDidMount() {
    const { ruleDefinitions, defaults } = this.props;
    const { defaultRule } = this.state;

    const selectedRuleDefinitionId = defaults ? defaults.ruleDefinitionId : null;
    const defaultConfigurations = defaults ? parseConfiguration(defaults.configurations) : null;

    defaultRule.configurations = defaultConfigurations ? defaultConfigurations : defaultRule.configurations;

    defaultRule.currency = defaults ? defaults.currency : 'EUR';
    defaultRule.distSelected = true;
    defaultRule.vatSelected = false;
    defaultRule.marginSelected = false;
    defaultRule.guaranteedSelected = false;

    const tempUnitType = defaults?.properties.find(item => item.key === 'unit_type');
    const selectedUnitType = tempUnitType
      ? this.state.unitTypes?.templateTypes.find(item => item.value === tempUnitType.value)
      : this.state.unitTypes?.templateTypes[0];

    this.setState({ ruleDefinitions }, () => {
      if (selectedRuleDefinitionId) {
        this.setSelectedRuleDefinition(ruleDefinitions.find(x => x.id === selectedRuleDefinitionId));
      } else if (this.state.unitTypes) {
        const filteredDefs = this.filterTransfersRuleDefinitions(selectedUnitType.value);

        const defaultSelection = filteredDefs.find(item => item.name === 'Percentage');

        this.setSelectedRuleDefinition(defaultSelection);
      } else {
        this.setSelectedRuleDefinition(ruleDefinitions[0]);
      }
    });

    if (this.state.templateMargins != null) {
      defaultRule.selectedMargin = this.state.templateMargins.templateTypes[0];
      defaultRule.selectedTemplate = defaultRule.selectedDefinition.name;
      defaultRule.flightTemplateType = this.state.templateMargins.templateTypes[0].displayName;
      const filteredDefinition = ruleDefinitions.filter(x => x.flightTemplateType === defaultRule.selectedMargin.value);
      this.setState({ filteredDefinitions: ruleDefinitions });
      this.setState({ ruleDefinitions: filteredDefinition });
      this.setState({ selectedMargins: this.state.templateMargins.templateTypes[0] });
    } else if (this.state.unitTypes) {
      this.setState({
        selectedUnitType: selectedUnitType,
        ruleDefinitions: this.filterTransfersRuleDefinitions(selectedUnitType.value)
      });
    }

    this.setState({ defaultRule });
  }

  componentDidUpdate() {
    // TODO: Refactor this resort handling logic to existing utility method.
    const { resortsList, dynamicAccommodation } = this.props;
    const { applicability } = this.state;
    const resortOptionsIdx = applicability?.findIndex(item => item.get('criteriaKey') === 'resort');
    const dynamicAccommOptionsIdx = applicability?.findIndex(item => item.get('criteriaKey') === 'accommodationcode');

    if (
      resortOptionsIdx >= 0 &&
      resortsList.length &&
      applicability.get(resortOptionsIdx).get('values').length !== resortsList.length
    ) {
      const tempResortItem = applicability.get(resortOptionsIdx);

      const valueItems = resortsList.map(
        value =>
          new MatchingCriteriaValue({
            id: value.id,
            name: value.name,
            code: value.code,
            parentIds: value.parentIds,
            sourceMarketIds: value.sourceMarketIds,
            parentCountryIds: value.parentCountryIds,
            parentDestinationIds: value.parentDestinationIds
          })
      );

      this.setState({ applicability: applicability.set(resortOptionsIdx, tempResortItem.set('values', valueItems)) });
    }

    const dynamicAccomItem = parseDynamicAccommValues(dynamicAccommOptionsIdx, dynamicAccommodation, applicability);

    if (dynamicAccomItem) {
      this.setState({ applicability: applicability.set(dynamicAccommOptionsIdx, dynamicAccomItem) });
    }
  }

  filterTransfersRuleDefinitions = unitType => {
    const { ruleDefinitions } = this.props;

    return ruleDefinitions.filter(rule => {
      const { description } = rule;
      return description.substring(description.indexOf('-'), 0) === unitType;
    });
  };

  handleSave = (rule, transactionId) => {
    rule.ruleDefinitionId = this.state.selectedRuleDefinition.id;
    rulesApi.create(rule, transactionId).then(response => {
      if (response.status === 201) {
        this.props.history.push(this.getEditUrl(response.data.id, transactionId));
      }
    });
  };

  handleSaveAndReturnToOverview = (rule, transactionId) => {
    rule.ruleDefinitionId = this.state.selectedRuleDefinition.id;
    rulesApi.create(rule, transactionId).then(response => {
      if (response.status === 201) {
        this.returnToOverview();
      }
    });
  };

  handleDefinitionChange = selectedDefinition => {
    const { ruleDefinitions } = this.state;
    let { selectedFlightTemplateType } = this.state;
    const selectedRuleDefinition = ruleDefinitions.find(x => x.id === selectedDefinition.key);
    this.setState({ defaultRule: getDefaultRule(this.props) }, () =>
      this.setSelectedRuleDefinition(selectedRuleDefinition, selectedFlightTemplateType)
    );
  };

  setSelectedRuleDefinition = (selectedRuleDefinition, selectedFlightTemplateType) => {
    const matchingCriteriaDefinition = fromJS(selectedRuleDefinition.matchingCriteriaDefinitions);
    const { defaultRule, selectedUnitType } = this.state;

    const valueDefinitionsWithSpecificValidation = addSpecificValidationToValueDefinition(
      selectedRuleDefinition.type.ruleType,
      selectedRuleDefinition.valueDefinitions
    );
    defaultRule.valueDefinitions = fromJS(valueDefinitionsWithSpecificValidation);
    defaultRule.selectedMargin = this.state.selectedMargins;
    if (selectedFlightTemplateType !== undefined) {
      defaultRule.flightTemplateType = selectedFlightTemplateType;
    } else if (this.state.selectedMargins !== undefined && this.state.selectedMargins.displayName !== undefined) {
      defaultRule.flightTemplateType = this.state.selectedMargins.displayName;
      selectedFlightTemplateType = this.state.selectedMargins.displayName;
    } else if (selectedUnitType) {
      defaultRule.selectedDefinition = selectedRuleDefinition;
    }
    this.setState({ selectedFlightTemplateType: selectedFlightTemplateType });
    this.setState({ defaultRule });

    let matchingCriteriaKeys = selectedRuleDefinition.matchingCriteriaDefinitions.map(x => x.criteriaKey);

    if (matchingCriteriaKeys.includes('resort')) {
      matchingCriteriaKeys = matchingCriteriaKeys.filter(item => item !== 'resort');
    }

    const activeRuleType = selectedRuleDefinition.type.ruleType;
    if (matchingCriteriaKeys.includes('accommodationcode') && DynamicContractRuleTypes.includes(activeRuleType)) {
      matchingCriteriaKeys = matchingCriteriaKeys.filter(item => item !== 'accommodationcode');
    }

    matchingCriteriasApi.get(matchingCriteriaKeys).then(response => {
      const criterias = response.data;

      // Filter classification values based on available accommodations.
      filterCriteriasBasedOnAccommodations(criterias);

      const applicability = getMatchingCriteriaDefinitionValues(
        this.getTemplatedBasedFilters(criterias),
        matchingCriteriaDefinition,
        activeRuleType
      );

      this.setState({ selectedRuleDefinition, applicability });
    });
  };

  getTemplatedBasedFilters = responseData => {
    const isFlightTemplate = this.props.ruleDefinitions.every(item => FlightRuleTemplates.includes(item.type.ruleType));
    if (isFlightTemplate) {
      return responseData.map(item => {
        if (item.key === 'producttype') {
          return { ...item, values: getFlighProductTypes(item.values) };
        }
        return item;
      });
    } else {
      return responseData;
    }
  };

  handleSetSelectedMargin = margins => {
    const { templateMargins, defaultRule } = this.state;
    const selectedTemplateMargin = templateMargins.templateTypes.find(x => x.id === margins.key);
    const newDefaultRule = { ...defaultRule };
    newDefaultRule.selectedMargin = selectedTemplateMargin;
    newDefaultRule.flightTemplateType = selectedTemplateMargin.displayName;
    if (selectedTemplateMargin.displayName) {
      const newselectedFlightTemplateType = selectedTemplateMargin.displayName;
      this.setState({ selectedFlightTemplateType: newselectedFlightTemplateType });
    }
    this.setState({ defaultRule: newDefaultRule, selectedMargins: selectedTemplateMargin });
  };

  handleSelectedUnitType = unitType => {
    const { selectedRuleDefinition } = this.state;

    const filteredDefs = this.filterTransfersRuleDefinitions(unitType.value);
    const selectedDefs = filteredDefs.find(item => item.name === selectedRuleDefinition.name);

    this.setState(
      {
        ruleDefinitions: filteredDefs,
        selectedUnitType: unitType,
        defaultRule: getDefaultRule(this.props)
      },
      () => {
        this.setSelectedRuleDefinition(selectedDefs);
      }
    );
  };

  getBackUrl = () => {
    switch (this.state.selectedRuleDefinition.type.ruleType) {
      case ruleTypes.phasingReference:
        return `/cost/rules/overview/${this.props.ruleKey}`;
      case ruleTypes.discount:
        return `/settings/discounts/`;
      default:
        return `/pricing/rules/overview/${this.props.ruleKey}`;
    }
  };

  getEditUrl = (id, transactionId) => {
    switch (this.state.selectedRuleDefinition.type.ruleType) {
      case ruleTypes.phasingReference:
        return `/cost/rules/templates/edit/${id}/${transactionId}`;
      case ruleTypes.discount:
        return `/settings/discounts/edit/${id}/${transactionId}`;
      default:
        return `/pricing/rules/templates/edit/${id}/${transactionId}`;
    }
  };

  returnToOverview = () => {
    this.props.history.push(`${this.getBackUrl()}`);
  };

  getRuleSpecificDropdown = ruleType => {
    const { templateMargins, selectedMargins, unitTypes, selectedUnitType } = this.state;

    switch (ruleType) {
      case ruleTypes.charterFlightComponent:
        return (
          <div>
            <DropdownLabel>Select Margin Type</DropdownLabel>
            <DropdownMenu
              width="420px"
              defaultValue={`${selectedMargins.displayName}`}
              onChange={this.handleSetSelectedMargin}
              items={templateMargins?.templateTypes.map(templatetype => {
                return {
                  key: templatetype.id,
                  value: `${templatetype.displayName}`
                };
              })}
            />
          </div>
        );
      case ruleTypes.transferDistributionCost:
      case ruleTypes.transferVat:
      case ruleTypes.transferMarginComponent:
        return (
          <div>
            <DropdownLabel>Unit type</DropdownLabel>
            <DropdownMenu
              width="220px"
              defaultValue={`${selectedUnitType.value}`}
              onChange={this.handleSelectedUnitType}
              items={unitTypes?.templateTypes.map(unitType => {
                return {
                  key: unitType.id,
                  value: `${unitType.displayName}`
                };
              })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  allowTemplateSelection = (ruleDefinitions, ruleType) =>
    ruleDefinitions.length > 1 && ruleType !== ruleTypes.transferDistributionCost;

  render() {
    const {
      ruleDefinitions,
      templateMargins,
      filteredDefinitions,
      applicability,
      selectedRuleDefinition,
      defaultRule
    } = this.state;

    const {
      selectableSourceMarkets,
      selectableProperties,
      selectableAssociatedProducts,
      configurationsAdditionalComponentFactory,
      ConfigurationsEditorComponent
    } = this.props;

    if (!selectedRuleDefinition) {
      return null;
    }

    const activeRuleType = selectedRuleDefinition.type.ruleType;

    return (
      <Flexbox direction="column" alignItems="flex-start">
        {this.getRuleSpecificDropdown(activeRuleType)}

        {this.allowTemplateSelection(ruleDefinitions, activeRuleType) && (
          <div
            css={`
              margin-bottom: 15px;
            `}
            data-testid="template-container"
          >
            <DropdownLabel>Select template</DropdownLabel>
            <DropdownMenu
              width="420px"
              items={ruleDefinitions.map(definition => {
                return {
                  key: definition.id,
                  value: `${definition.name}`
                };
              })}
              defaultValue={`${selectedRuleDefinition.name}`}
              onChange={this.handleDefinitionChange}
              ref={c => (this.myDropdown = c)}
            />
          </div>
        )}

        <EditRule
          key={`create_definitionId_${selectedRuleDefinition.id}`}
          ruleDefinitionId={selectedRuleDefinition.id}
          rule={{ ...defaultRule, ruleType: selectedRuleDefinition.type.ruleType }}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableProperties={selectableProperties}
          selectableAssociatedProducts={selectableAssociatedProducts}
          applicability={applicability}
          onSave={this.handleSave}
          validationFunc={this.props.validationFunc}
          onSaveAndReturn={this.handleSaveAndReturnToOverview}
          onCancel={this.returnToOverview}
          showCurrency={selectedRuleDefinition.showCurrency}
          configurationsAdditionalComponentFactory={configurationsAdditionalComponentFactory}
          ConfigurationsEditorComponent={ConfigurationsEditorComponent}
          ruleType={selectedRuleDefinition.type.ruleType}
          ruleDefinitions={ruleDefinitions}
          templateMargins={templateMargins}
          selectedRuleDefinition={selectedRuleDefinition}
          filteredDefinitions={filteredDefinitions}
        />
      </Flexbox>
    );
  }
}

CreateRule.propTypes = {
  ruleDefinitions: PropTypes.array.isRequired,
  selectableSourceMarkets: PropTypes.array,
  selectableDurationGroups: PropTypes.array,
  defaultProperties: PropTypes.array,
  selectableProperties: PropTypes.array,
  selectableAssociatedProducts: PropTypes.object,
  configurationsAdditionalComponentFactory: PropTypes.func,
  ConfigurationsEditorComponent: PropTypes.any
};

CreateRule.defaultProps = {
  selectableSourceMarkets: [],
  selectableDurationGroups: [],
  defaultProperties: [],
  selectableProperties: [],
  selectableAssociatedProducts: {},
  configurationsAdditionalComponentFactory: () => {},
  ConfigurationsEditorComponent: DefaultConfigurationsEditor
};

function mapStateToProps(state) {
  return {
    resortsList: state.appState.resortsList,
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
}

export default connect(mapStateToProps)(withRouter(CreateRule));
