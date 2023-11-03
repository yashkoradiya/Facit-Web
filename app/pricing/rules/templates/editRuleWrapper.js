import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Flexbox, PageHeader } from '../../../components/styled/Layout';
import ConfirmButton from '../../../components/ConfirmButton';
import EditRule from '../components/EditRule/editRule';
import { FlightRuleTemplates, getMatchingCriteriaDefinitionValues, parseDynamicAccommValues } from '../templates/utils';
import { mapPropertiesFromBackend } from './utils';
import * as rulesApi from '../../../apis/rulesApi';
import * as matchingCriteriasApi from '../../../apis/matchingCriteriasApi';
import { fromJS, List } from 'immutable';
import {
  ruleTypes,
  ruleTabs,
  getRuleTypeEditCreateCopy,
  getRuleRoute,
  DynamicContractRuleTypes
} from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import { addSpecificValidationToValueDefinition } from '../../utils/validators';
import { TextButton } from '../../../components/styled/Button';
import DefaultConfigurationsEditor from '../components/DefaultConfigurationsEditor/DefaultConfigurationsEditor';
import PhasingConfigurationsEditor from '../components/phasingReference/PhasingConfigurationsEditor';
import { addRandomKeyToElements } from './addRandomKeyToElements';
import { getFlighProductTypes } from 'packaging/packaging-utils';
import MatchingCriteriaValue from './../../utils/MatchingCriteriaValue';

class EditRuleWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: null,
      applicability: List(),
      selectableSourceMarkets: [],
      selectableProperties: [],
      selectableDurationGroups: [],
      transactionId: null,
      createdTransactionId: null,
      saveSuccess: false,
      validationFunc: null
    };
  }

  componentDidMount() {
    const ruleId = this.props.match.params.id;

    if (ruleId) {
      rulesApi.get(ruleId).then(response => {
        let rule = response.data;
        const createdTransactionId = this.props.match.params.transactionId;
        if (createdTransactionId) {
          rule.createdTransactionId = createdTransactionId;
        }

        rule.configurations = this.mapRuleConfigurations(rule);

        const valueDefinitionsWithSpecificValidation = addSpecificValidationToValueDefinition(
          rule.ruleType,
          rule.valueDefinitions
        );
        rule.valueDefinitions = fromJS(valueDefinitionsWithSpecificValidation);
        rule.associatedProductIds = fromJS(rule.associatedProductIds);

        const matchingCriteriaDefinitions = fromJS(rule.criteriaDefinitions);
        const activeRuleType = rule.ruleType;
        const matchingCriteriaKeys = this.configureMatchingCriteriaKeys(matchingCriteriaDefinitions, activeRuleType);

        this.processRuleState(matchingCriteriaDefinitions, matchingCriteriaKeys, activeRuleType, ruleId, rule);
      });
    }
  }

  mapRuleConfigurations = rule => {
    return rule.configurations.map(configuration => {
      const updatedDurationGroups = addRandomKeyToElements(configuration.durationGroups);
      return {
        ...configuration,
        dateBands: configuration.dateBands.map(dateBand => {
          const valuesWithMappedDurationGroup = dateBand.values.map(v => ({
            ...v,
            durationGroup: updatedDurationGroups.find(
              x => x.from === v.durationGroup.from && x.to === v.durationGroup.to
            )
          }));

          return {
            key: uuidv4(),
            from: moment(dateBand.from),
            to: moment(dateBand.to),
            values: valuesWithMappedDurationGroup
          };
        }),
        durationGroups: updatedDurationGroups
      };
    });
  };

  /**
   * This function returns matchingCriteriaKeys based on the current rule type
   * @param {*} matchingCriteriaDefinitions
   * @param {*} activeRuleType
   * @returns Array
   */
  configureMatchingCriteriaKeys = (matchingCriteriaDefinitions, activeRuleType) => {
    let matchingCriteriaKeys = matchingCriteriaDefinitions.map(x => x.get('criteriaKey'));
    if (matchingCriteriaKeys.includes('resort')) {
      matchingCriteriaKeys = matchingCriteriaKeys.filter(item => item !== 'resort');
    }

    if (matchingCriteriaKeys.includes('accommodationcode') && DynamicContractRuleTypes.includes(activeRuleType)) {
      matchingCriteriaKeys = matchingCriteriaKeys.filter(item => item !== 'accommodationcode');
    }

    return matchingCriteriaKeys;
  };

  processRuleState = (matchingCriteriaDefinitions, matchingCriteriaKeys, activeRuleType, ruleId, rule) => {
    const promises = [
      matchingCriteriasApi.get(matchingCriteriaKeys),
      rulesApi.getSelectableItems(activeRuleType),
      rulesApi.getAssignedProducts(ruleId)
    ];

    Promise.all(promises).then(responses => {
      let criteriaDefinitionValues = responses[0].data;
      if (FlightRuleTemplates.includes(activeRuleType)) {
        criteriaDefinitionValues = responses[0].data.map(item => {
          if (item.key === 'producttype') {
            return { ...item, values: getFlighProductTypes(item.values) };
          }
          return item;
        });
      }

      const data = {
        applicability: getMatchingCriteriaDefinitionValues(
          criteriaDefinitionValues,
          matchingCriteriaDefinitions,
          activeRuleType
        ),
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        selectableAssociatedProducts: responses[1].data.associatedProducts,
        assignedProducts: !rule.createdTransactionId ? responses[2].data : null
      };
      this.setState({
        applicability: data.applicability,
        selectableProperties: data.selectableProperties,
        selectableSourceMarkets: data.selectableSourceMarkets,
        selectableAssociatedProducts: data.selectableAssociatedProducts,
        assignedProducts: data.assignedProducts,
        rule
      });
    });
  };

  componentDidUpdate() {
    const { resortsList, dynamicAccommodation } = this.props;
    const { applicability } = this.state;
    const resortOptionsIdx = applicability?.findIndex(item => item.get('criteriaKey') === 'resort');
    const dynamicAccommOptionsIdx = applicability?.findIndex(item => item.get('criteriaKey') === 'accommodationcode');

    if (
      resortOptionsIdx >= 0 &&
      resortsList?.length &&
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

  getBackUrl = ruleType => {
    switch (ruleType) {
      case ruleTypes.phasingReference:
        return `/cost/rules/overview/${this.getRuleKey(ruleType)}`;
      case ruleTypes.discount:
        return `/settings/discounts/`;
      default:
        return `/pricing/rules/overview/${this.getRuleKey(ruleType)}`;
    }
  };

  getDuplicateUrl = ruleType => {
    switch (ruleType) {
      case ruleTypes.phasingReference:
        return `/cost/rules/templates/create/${getRuleRoute(ruleType)}`;
      case ruleTypes.discount:
        return `/settings/discounts/create`;
      default:
        return `/pricing/rules/templates/create/${getRuleRoute(ruleType)}`;
    }
  };

  get header() {
    const ruleType = this.state.rule ? this.state.rule.ruleType : null;
    return getRuleTypeEditCreateCopy(ruleType);
  }

  getRuleKey = ruleType => {
    switch (ruleType) {
      case ruleTypes.accommodationComponent:
      case ruleTypes.accommodationOnly:
      case ruleTypes.overOccupancy:
      case ruleTypes.underOccupancy:
      case ruleTypes.boardUpgrade:
      case ruleTypes.mandatorySupplement:
        return ruleTabs.accommodation;
      case ruleTypes.ancillary:
        return ruleTabs.accommodation;
      case ruleTypes.miscellaneousCost:
        return ruleTabs.miscellaneousCost;
      case ruleTypes.guaranteeFundAccomMiscCost:
        return ruleTabs.miscellaneousCost;
      case ruleTypes.guaranteeFundFlightMiscCost:
        return ruleTabs.miscellaneousCost;
      case ruleTypes.distributionCost:
        return ruleTabs.distributionCost;
      case ruleTypes.flightDistributionCost:
        return ruleTabs.distributionCost;
      case ruleTypes.transferDistributionCost:
        return ruleTabs.distributionCost;
      case ruleTypes.transferVat:
        return ruleTabs.vat;
      case ruleTypes.transferMarginComponent:
        return ruleTabs.transfers;
      case ruleTypes.dynamicCruise:
        return ruleTabs.dynamicCruise;
      case ruleTypes.vat:
        return ruleTabs.vat;
      case ruleTypes.minMax:
        return ruleTabs.minMax;
      case ruleTypes.flightVat:
        return ruleTabs.vat;
      default:
        return '';
    }
  };

  handleSave = (completeRule, transactionId) => {
    return rulesApi
      .put(completeRule, transactionId)
      .then(() => {
        this.setState({
          saveSuccess: true
        });
      })
      .catch(() => {
        this.setState({ saveSuccess: false });
      });
  };

  getAssignedRules = ruleId => {
    rulesApi.getAssignedProducts(ruleId).then(response => {
      this.setState({ assignedProducts: response.data });
    });
  };

  handleSaveAndReturn = (completeRule, transactionId) => {
    this.handleSave(completeRule, transactionId).then(() => {
      this.props.history.push(this.getBackUrl(this.state.rule.ruleType));
    });
  };

  handleDelete = () => {
    rulesApi.remove(this.state.rule.id).then(response => {
      if (response.status === 202) {
        this.props.history.push(this.getBackUrl(this.state.rule.ruleType));
      }
    });
  };

  handleDuplicate = () => {
    const { rule } = this.state;

    this.props.history.push({
      pathname: this.getDuplicateUrl(this.state.rule.ruleType),
      state: {
        ruleDefinitionId: rule.ruleDefinitionId,
        configurations: JSON.stringify(rule.configurations),
        currency: rule.currency,
        properties: rule.properties
      }
    });
  };

  handleOnRuleEdited = rule => {
    this.setState({ saveSuccess: false, rule });
  };

  render() {
    const {
      rule,
      applicability,
      selectableProperties,
      selectableSourceMarkets,
      selectableDurationGroups,
      selectableAssociatedProducts,
      saveSuccess,
      assignedProducts
    } = this.state;

    if (!rule) {
      return null;
    }

    if (!canAccessRule(rule.ruleType, this.props.access)) {
      return null;
    }

    const deleteButton = (
      <ConfirmButton
        onClick={this.handleDelete}
        confirmTitle={'Delete template'}
        confirmButtonText={'Delete template'}
        confirmContent={
          <span>
            &quot;{rule.name}&quot; affects {assignedProducts} products, are you sure you want to delete it?
          </span>
        }
      >
        Delete
      </ConfirmButton>
    );

    const duplicateButton = (
      <TextButton onClick={this.handleDuplicate}>
        <i className="material-icons">file_copy</i>
        <span>Duplicate template</span>
      </TextButton>
    );

    return (
      <Flexbox direction="column" alignItems="flex-start">
        <Flexbox marginBottom="10px" alignItems="center">
          <Link
            style={{
              height: 21
            }}
            onClick={e => {
              e.stopPropagation();
            }}
            to={this.getBackUrl(this.state.rule.ruleType)}
          >
            <i className="material-icons">navigate_before</i>
          </Link>
          <PageHeader>{this.header}</PageHeader>
        </Flexbox>
        <EditRule
          readOnly={!canEditRule(rule.ruleType, this.props.access)}
          rule={rule}
          ruleDefinitionId={rule.ruleDefinitionId}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableDurationGroups={selectableDurationGroups}
          selectableAssociatedProducts={selectableAssociatedProducts}
          applicability={applicability}
          showCurrency={rule.showCurrency}
          onSave={(completeRule, transactionId) => this.handleSave(completeRule, transactionId)}
          onRuleEdited={this.handleOnRuleEdited}
          onCancel={() => this.props.history.push(this.getBackUrl(this.state.rule.ruleType))}
          onJobCompleted={() => this.getAssignedRules(rule.id)}
          assignedProducts={assignedProducts}
          saveSuccess={saveSuccess}
          onSaveAndReturn={this.handleSaveAndReturn}
          deleteButton={deleteButton}
          validationFunc={ruleValidationFunctions[rule.ruleType]}
          duplicateButton={duplicateButton}
          ConfigurationsEditorComponent={
            rule.ruleType === ruleTypes.phasingReference ? PhasingConfigurationsEditor : DefaultConfigurationsEditor
          }
        />
      </Flexbox>
    );
  }
}

EditRuleWrapper.propTypes = {};

EditRuleWrapper.defaultProps = {};

const mapStateToProps = state => {
  return {
    access: state.appState.user.access,
    resortsList: state.appState.resortsList,
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
};

export default connect(mapStateToProps)(EditRuleWrapper);

const canEditRule = (ruleType, access) => {
  switch (ruleType) {
    case ruleTypes.accommodationComponent:
      return access.componenttemplates.accommodationcomponents.write;
    case ruleTypes.overOccupancy:
      return access.componenttemplates.overoccupancy.write;
    case ruleTypes.underOccupancy:
      return access.componenttemplates.underoccupancy.write;
    case ruleTypes.roomUpgrade:
      return access.componenttemplates.roomupgrade.write;
    case ruleTypes.boardUpgrade:
      return access.componenttemplates.boardupgrade.write;
    case ruleTypes.mandatorySupplement:
      return access.componenttemplates.mandatorysupplement.write;
    case ruleTypes.miscellaneousCost:
      return access.componenttemplates.misccost.write;
    case ruleTypes.distributionCost:
      return access.componenttemplates.distributioncost.write;
    case ruleTypes.vat:
      return access.componenttemplates.vat.write;
    case ruleTypes.ancillary:
      return access.componenttemplates.ancillary.write;
    case ruleTypes.charterFlightComponent:
      return access.componenttemplates.flightsupplements.write;
    case ruleTypes.dynamicCruise:
      return access.componenttemplates.dynamiccruise.write;
    case ruleTypes.charterPackage:
      return access.packagetemplates.charterpackage.write;
    case ruleTypes.accommodationOnly:
      return access.packagetemplates.accommodationonly.write;
    case ruleTypes.bulkAdjustment:
      return access.packagetemplates.bulkadjustment.write;
    case ruleTypes.minMax:
      return access.packagetemplates.minmax.write;
    case ruleTypes.phasingReference:
      return access.phasing.templates.write;
    case ruleTypes.discount:
      return access.settings.discounts.write;
    case ruleTypes.flightDistributionCost:
      return access.componenttemplates.flightdistributioncost.write;
    case ruleTypes.transferDistributionCost:
      return access.componenttemplates.transferdistributioncost.write;
    case ruleTypes.transferVat:
      return access.componenttemplates.transfervat.write;
    case ruleTypes.transferMarginComponent:
      return access.componenttemplates.transfermargincomponent.write;
    case ruleTypes.flightVat:
      return access.componenttemplates.flightvat.write;
    case ruleTypes.guaranteeFundAccomMiscCost:
      return access.componenttemplates.guaranteefundaccom.write;
    case ruleTypes.guaranteeFundFlightMiscCost:
      return access.componenttemplates.guaranteefundflight.write;
    case ruleTypes.accomReverse:
      return access.componenttemplates.reversecharge.write;

    default:
      throw Error(`Invalid ruletype: ${ruleType}`);
  }
};

const canAccessRule = (ruleType, access) => {
  switch (ruleType) {
    case ruleTypes.accommodationComponent:
      return access.componenttemplates.accommodationcomponents.read;
    case ruleTypes.overOccupancy:
      return access.componenttemplates.overoccupancy.read;
    case ruleTypes.underOccupancy:
      return access.componenttemplates.underoccupancy.read;
    case ruleTypes.roomUpgrade:
      return access.componenttemplates.roomupgrade.read;
    case ruleTypes.boardUpgrade:
      return access.componenttemplates.boardupgrade.read;
    case ruleTypes.mandatorySupplement:
      return access.componenttemplates.mandatorysupplement.read;
    case ruleTypes.miscellaneousCost:
      return access.componenttemplates.misccost.read;
    case ruleTypes.distributionCost:
      return access.componenttemplates.distributioncost.read;
    case ruleTypes.vat:
      return access.componenttemplates.vat.read;
    case ruleTypes.ancillary:
      return access.componenttemplates.ancillary.read;
    case ruleTypes.charterFlightComponent:
      return access.componenttemplates.flightsupplements.read;
    case ruleTypes.dynamicCruise:
      return access.componenttemplates.dynamiccruise.read;
    case ruleTypes.charterPackage:
      return access.packagetemplates.charterpackage.read;
    case ruleTypes.accommodationOnly:
      return access.packagetemplates.accommodationonly.read;
    case ruleTypes.bulkAdjustment:
      return access.packagetemplates.bulkadjustment.read;
    case ruleTypes.minMax:
      return access.packagetemplates.minmax.read;
    case ruleTypes.phasingReference:
      return access.phasing.templates.read;
    case ruleTypes.discount:
      return access.settings.discounts.read;
    case ruleTypes.flightDistributionCost:
      return access.componenttemplates.flightdistributioncost.read;
    case ruleTypes.transferDistributionCost:
      return access.componenttemplates.transferdistributioncost.read;
    case ruleTypes.transferVat:
      return access.componenttemplates.transfervat.read;
    case ruleTypes.transferMarginComponent:
      return access.componenttemplates.transfermargincomponent.read;
    case ruleTypes.flightVat:
      return access.componenttemplates.flightvat.read;
    case ruleTypes.guaranteeFundAccomMiscCost:
      return access.componenttemplates.guaranteefundaccom.read;
    case ruleTypes.guaranteeFundFlightMiscCost:
      return access.componenttemplates.guaranteefundflight.read;
    case ruleTypes.accomReverse:
      return access.componenttemplates.reversecharge.read;

    default:
      throw Error(`Invalid ruletype: ${ruleType}`);
  }
};
