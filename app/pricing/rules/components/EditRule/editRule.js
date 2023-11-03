import React, { Component } from 'react';
import { Prompt } from 'react-router';
import { List, fromJS } from 'immutable';
import { PropTypes } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import settings from '../../../../core/settings/settings';
import Feedback from './../../../../core/Feedback';
import JobStatus from './../../../components/JobStatus';
import { Flexbox, SubHeader, TextBlock, ErrorMessage } from '../../../../components/styled/Layout';
import { colours } from '../../../../components/styled/defaults';
import DropdownMenu from '../../../../components/FormFields/DropdownMenu';
import InputField from '../../../../components/FormFields/InputField';
import { InputBox, InputLabel } from 'components/styled/Input';
import ApplicabilityEditor from '../ApplicabilityEditor';
import PropertiesEditor from '../propertiesEditor';
import SearchBox from '../../../../components/FormFields/SearchBox';
import DefaultConfigurationsEditor from '../DefaultConfigurationsEditor/DefaultConfigurationsEditor';
import DurationGroupsEditor from '../durationGroupsEditor/DurationGroupsEditor';
import * as dateBandHelper from '../dateBandHelper';
import PreDefinedDurationGroupPicker from '../PreDefinedDurationGroupPicker';
import { addRandomKeyToElements } from '../../templates/addRandomKeyToElements';
import RuleValidationModal from '../RuleValidationModal';
import { Button } from 'components/styled/Button';
import { FlightRuleTemplates } from '../../templates/utils';
import { TransferTypeRules } from '../../ruleConstants';

class EditRule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rule: props.rule,
      initialApplicability: props.rule.matchingCriterias ? fromJS(props.rule.matchingCriterias) : List(),
      selectedApplicability: props.rule.matchingCriterias ? fromJS(props.rule.matchingCriterias) : List(),
      validationErrors: {},
      configurationsEditorHasErrors: false,
      hasUnsavedData: false,
      hasUnsavedApplicability: false,
      jobId: props.rule.createdTransactionId !== null ? props.rule.createdTransactionId : null,
      selectedAssociatedProductIds: props.rule.associatedProductIds ? fromJS(props.rule.associatedProductIds) : List(),
      additionalComponent: null,
      showRuleValidationModal: false,
      ruleValidationErrorMessage: null,
      days: 365,
      ruleType: props.ruleType != null ? props.ruleType : props.rule.ruleType,
      ruleDefinitions: props.ruleDefinitions,
      templateType: null,
      Edit: null,
      templateMargins: props.templateMargins,
      selectedRuleDefinition: props.selectedRuleDefinition,
      filteredDefinition: props.filteredDefinitions
    };
    this.doValidation = false;
  }

  componentDidMount() {
    this.invokeConfigurationsAdditionalComponentFactory();
    this.setState({ Edit: this.props.deleteButton });
  }

  componentDidUpdate(prevProps) {
    this.verifyRuleChange(prevProps);
    if (this.state.hasUnsavedData) {
      window.addEventListener('beforeunload', this.handleUnload);
    } else {
      window.removeEventListener('beforeunload', this.handleUnload);
    }
  }

  /**
   * Verifies the rule property for any changes.
   * if there are changes, then it updates the rule property in the state variable
   * @param {any} prevProps
   */
  verifyRuleChange(prevProps) {
    const prevRule = fromJS(prevProps.rule);
    const currRule = fromJS(this.props.rule);

    if (!prevRule.equals(currRule)) {
      this.setState({ rule: this.props.rule });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  handleUnload = event => {
    const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave this page?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  handlePreDefinedDurationGroupPickerClick = d => {
    const durationGroups = this.state.rule.configurations[0].durationGroups;
    const showWarning = !(durationGroups.length === 1 && durationGroups[0].from === 1 && durationGroups[0].to === 1);

    const durationGroupsWithKey = addRandomKeyToElements(d.durationGroups);

    if (!showWarning) {
      this.handleDurationGroupUpdate(durationGroupsWithKey);
      return;
    }

    if (confirm('Are you sure you want to replace existing duration groups?')) {
      this.handleDurationGroupUpdate(durationGroupsWithKey);
    }
  };

  handleNameChanged = e => {
    const { rule } = this.state;
    rule.name = e.target.value;
    const validationErrors = this.validate(rule, this.state.selectedApplicability);
    this.setState({ rule, validationErrors, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleDayChange = value => {
    this.setState({ days: value });
  };

  handleAddDays = () => {
    const newconfigurations = this.state.rule.configurations.map(conf => {
      return {
        ...conf,
        dateBands: conf.dateBands.map(dateband => {
          return {
            ...dateband,
            from: dateband.from.add(this.state.days, 'days'),
            to: dateband.to.add(this.state.days, 'days')
          };
        })
      };
    });

    const rule = { ...this.state.rule, configurations: newconfigurations };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleSetSelectedCurrency = currency => {
    const rule = { ...this.state.rule, currency: currency.value };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handlePropertiesChanged = properties => {
    const rule = { ...this.state.rule, properties };
    const validationErrors = this.validate(rule, this.state.selectedApplicability);
    this.setState({ rule, validationErrors, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleAssociatedProductsChanged = associatedProductIds => {
    const rule = { ...this.state.rule, associatedProductIds };
    const validationErrors = this.validate(rule, this.state.selectedApplicability);
    this.setState(
      { rule, validationErrors, hasUnsavedData: true, selectedAssociatedProductIds: associatedProductIds },
      () => this.props.onRuleEdited(rule)
    );
  };

  handleApplicabilityChanged = selectedApplicability => {
    const { rule } = this.state;
    const validationErrors = this.validate(rule, selectedApplicability);
    this.setState(
      { selectedApplicability, validationErrors, hasUnsavedApplicability: true, hasUnsavedData: true },
      () => {
        this.props.onRuleEdited(rule);
        this.invokeConfigurationsAdditionalComponentFactory();
      }
    );
  };

  invokeConfigurationsAdditionalComponentFactory = () => {
    const { rule, selectedApplicability } = this.state;
    const additionalComponent = this.props.configurationsAdditionalComponentFactory(rule, selectedApplicability);

    this.setState({
      additionalComponent: additionalComponent
    });
  };

  handleSave = (onSave, validationFunc) => {
    this.doValidation = true;
    const { rule, selectedApplicability, selectedAssociatedProductIds } = this.state;
    const filteredApplicability = selectedApplicability.filter(f => f.get('criteriaKey') !== 'sourcemarket');
    const validationErrors = this.validate(rule, filteredApplicability);
    if (Object.keys(validationErrors).length === 0) {
      const extendedApplicability = this.extendApplicability(filteredApplicability);
      const completeRule = {
        ...rule,
        matchingCriterias: extendedApplicability,
        associatedProductIds: selectedAssociatedProductIds
      };

      completeRule.configurations = completeRule.configurations.map(c => {
        c.dateBands = c.dateBands.map(d => {
          d.values = d.values.filter(v => v.value !== undefined && v.value !== null);
          return d;
        });

        return c;
      });

      const withSucess = () => {
        const transactionId = uuidv4();
        if (!selectedApplicability.equals(this.state.initialApplicability)) {
          this.setState({ jobId: transactionId, initialApplicability: selectedApplicability });
        }
        completeRule.ruleType = this.state.ruleType;
        this.setState({ hasUnsavedData: false });
        onSave(completeRule, transactionId);
      };

      if (validationFunc) {
        validationFunc(completeRule).then(x => {
          if (!x.isValid) {
            this.setState({ ruleValidationErrorMessage: x.message, showRuleValidationModal: true });
            return;
          }
          withSucess();
        });
      } else {
        withSucess();
      }
    } else {
      this.setState({ validationErrors });
    }
  };

  extendApplicability = selectedApplicability => {
    return selectedApplicability.toArray().map(a => {
      const currentCriteriaKey = a.get('criteriaKey');
      return {
        criteriaKey: currentCriteriaKey,
        values: a
          .get('values')
          .toArray()
          .map(v => {
            const applicability = this.props.applicability.find(app => app.get('criteriaKey') === currentCriteriaKey);
            const value = applicability.get('values').find(av => av.get('id') === v);
            return {
              id: v,
              name: value === undefined ? '' : value.get('name'),
              code: value === undefined ? '' : value.get('code')
            };
          })
      };
    });
  };

  validate = (rule, selectedApplicability) => {
    if (!this.doValidation) return;
    const validation = {};
    const propertiesErrors = this.getValidationErrorsForProperties(rule);
    const applicabilityErrors = this.getValidationErrorsForMissingApplicability(selectedApplicability);
    const departureTimeErrors = this.getValidationErrorsForDepartureTime(selectedApplicability);
    const datebandErrors = this.getValidationErrorsForDatebands(rule);
    const soureMarketErrors = this.getValidationErrorsForSourceMarket(rule);
    const productTypeError = this.getValidationErrorForProductType(selectedApplicability);
    if (!rule.name) {
      validation.name = 'Please write a template name';
    }
    if (Object.keys(propertiesErrors).length > 0) {
      validation.properties = propertiesErrors;
    }
    if (applicabilityErrors) {
      validation.applicability = applicabilityErrors;
    }
    if (departureTimeErrors) {
      validation.departureTime = departureTimeErrors;
    }
    if (datebandErrors && this.state.ruleType !== 'phasing_reference') {
      validation.datebands = datebandErrors;
    }
    if (soureMarketErrors && this.state.ruleType !== 'phasing_reference') {
      validation.datebands = soureMarketErrors;
    }
    if (this.state.configurationsEditorHasErrors) {
      validation.testError = 'Errors in datebands';
    }
    if (productTypeError) {
      validation.productTypeError = productTypeError;
    }
    return validation;
  };

  validateDateBands = rule => {
    const validation = {};
    const datebandErrors = this.getValidationErrorsForDatebands(rule);

    if (datebandErrors) {
      validation.datebands = datebandErrors;
    }
    return validation;
  };

  getValidationErrorsForProperties = rule => {
    return rule.properties
      .filter(prop => !prop.value && prop.key !== 'package_type')
      .reduce((errors, prop) => {
        return { ...errors, [prop.key]: 'Please select a value' };
      }, {});
  };

  getValidationErrorsForMissingApplicability = selectedApplicability => {
    let hasValues = false;
    selectedApplicability.forEach(item => {
      const values = item.get('values');

      if (item.get('criteriaKey') === 'departuretime') {
        hasValues = hasValues || (values && values.size === 2);
      } else {
        hasValues = hasValues || (values && values.size > 0);
      }
    });
    return hasValues ? null : 'At least one applicability must be selected';
  };

  getValidationErrorForProductType = selectedApplicability => {
    if (FlightRuleTemplates.includes(this.state.ruleType)) return null;
    if (this.props.applicability.find(item => item.get('title') === 'Product Type')) {
      const productType = selectedApplicability.find(item => item.get('criteriaKey') === 'producttype');
      return productType ?? productType?.isEmpty() ? null : 'Please select the Product Type.';
    }
  };
  getValidationErrorsForDepartureTime = selectedApplicability => {
    const departureTime = selectedApplicability.find(x => x.get('criteriaKey') === 'departuretime');
    if (!departureTime) return null;

    const values = departureTime.get('values');
    return values && values.size === 2 ? null : 'Both from and to time have to be selected';
  };

  getValidationErrorsForDatebands = rule => {
    const missingDatebands = rule.configurations.filter(x => x.dateBands.length === 0);

    if (missingDatebands.length > 0) {
      return 'A rule can not be added without datebands.';
    }

    const dateBands = rule.configurations.flatMap(x => x.dateBands);
    // value is allowed to be 0 so have to check explicitly for null and undefined value!
    if (!dateBands.every(d => d.values.some(v => v.value !== null && v.value !== undefined))) {
      return 'Every date band has to have at least one value';
    }

    return '';
  };
  getValidationErrorsForSourceMarket = rule => {
    const missingSourceMarket = rule.configurations.filter(x => x.sourceMarkets.length === 0);
    if (missingSourceMarket.length > 0) {
      return 'A rule can not be added without sourcemarket.';
    }
  };

  updateRuleConfiguration = (configurations, hasErrors) => {
    const rule = { ...this.state.rule, configurations };

    this.setState(
      {
        rule,
        hasUnsavedData: true,
        configurationsEditorHasErrors: hasErrors
      },
      () => this.props.onRuleEdited(rule)
    );
  };

  handleDurationGroupUpdate = durationGroups => {
    const oldRule = this.state.rule;
    const rule = {
      ...oldRule,
      configurations: oldRule.configurations.map(c => {
        return {
          ...c,
          durationGroups: [...durationGroups],
          dateBands: c.dateBands.map(db => {
            return dateBandHelper.updateDateBandDurationGroups(db, durationGroups);
          })
        };
      })
    };

    this.setState(
      {
        rule,
        hasUnsavedData: true
      },
      () => this.props.onRuleEdited(rule)
    );
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleJobCompleted = () => {
    this.setState({ jobId: null, hasUnsavedApplicability: false }, this.props.onJobCompleted);
  };

  handleDistributionChange = () => {
    const rule = { ...this.state.rule, distSelected: !this.state.rule.distSelected };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleVatChange = () => {
    const rule = { ...this.state.rule, vatSelected: !this.state.rule.vatSelected };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleGuaranteeChange = () => {
    const rule = { ...this.state.rule, guaranteedSelected: !this.state.rule.guaranteedSelected };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  handleMarginChange = () => {
    const rule = { ...this.state.rule, marginSelected: !this.state.rule.marginSelected };
    this.setState({ rule, hasUnsavedData: true }, () => this.props.onRuleEdited(rule));
  };

  render() {
    const {
      applicability,
      selectableProperties,
      saveSuccess,
      assignedProducts,
      selectableAssociatedProducts,
      showCurrency,
      ConfigurationsEditorComponent,
      ruleDefinitionId,
      readOnly
    } = this.props;
    const {
      rule,
      selectedApplicability,
      validationErrors,
      hasUnsavedData,
      jobId,
      hasUnsavedApplicability,
      selectedAssociatedProductIds,
      additionalComponent,
      days
    } = this.state;
    const defaultDurationGroups = rule.configurations[0].durationGroups;

    return (
      rule &&
      applicability && (
        <div data-testid="edit-rule-container">
          <Prompt when={hasUnsavedData} message="You have unsaved changes. Are you sure you want to leave this page?" />
          <Feedback />
          {!readOnly && <Flexbox justifyContent="flex-end">{this.props.duplicateButton}</Flexbox>}
          <Flexbox alignItems="flex-start" wrap="wrap" childrenMarginRight="20px" marginBottom="15px">
            {this.props.deleteButton != null && this.state.rule.ruleType == 'charter_flight_component' && (
              <div>
                <InputField
                  disabled
                  label={'Margin Type'}
                  onChange={this.handleNameChanged}
                  value={rule.flightTemplateType || 'Flight Margin'}
                  width="200px"
                  errorMessage={validationErrors && validationErrors.flightTemplateTypeName}
                />
              </div>
            )}
            {this.props.deleteButton != null && TransferTypeRules.includes(this.state.rule.ruleType) && (
              <div>
                <InputField
                  disabled
                  label={'Unit Type'}
                  onChange={this.handleNameChanged}
                  value={rule.properties.find(x => x.key === 'unit_type').value}
                  width="200px"
                />
              </div>
            )}
            <InputField
              disabled={readOnly}
              label={'Name'}
              onChange={this.handleNameChanged}
              value={rule.name || ''}
              width="420px"
              errorMessage={validationErrors && validationErrors.name}
            />
            {showCurrency && (
              <DropdownMenu
                disabled={readOnly}
                label={'Currency'}
                onChange={this.handleSetSelectedCurrency}
                width={'200px'}
                defaultValue={rule.currency}
                items={settings.AVAILABLE_CURRENCIES.map(currency => ({
                  key: currency,
                  value: currency
                }))}
              />
            )}

            <InputBox width={'80px'} marginRight="0px">
              <InputLabel>Add days</InputLabel>
              <InputField type="number" onChange={e => this.handleDayChange(e.target.value)} value={days || 0} />
            </InputBox>

            <Button height={'26px'} marginTop="22px" onClick={this.handleAddDays}>
              Add
            </Button>

            {selectableAssociatedProducts.values && (
              <SearchBox
                disabled={readOnly}
                items={fromJS(
                  selectableAssociatedProducts.values.map(v => ({
                    id: v.value,
                    name: v.displayName
                  }))
                )}
                placeholder={selectableAssociatedProducts.label}
                onChange={this.handleAssociatedProductsChanged}
                selectedItemIds={selectedAssociatedProductIds}
                errorMessage={validationErrors && validationErrors.associatedProductError}
              />
            )}

            <PropertiesEditor
              disabled={readOnly}
              errorMessage={validationErrors && validationErrors.properties}
              properties={rule.properties}
              selectableProperties={selectableProperties}
              onChange={this.handlePropertiesChanged}
            />

            {this.state.ruleType == 'miscellaneous_cost' && (
              <div style={{ marginTop: '25px' }}>
                <label style={{ fontSize: '11px' }}>
                  <input
                    type="checkbox"
                    onChange={this.handleMarginChange}
                    defaultChecked={this.state.rule.marginSelected}
                  />
                  Apply Margin
                </label>

                <label style={{ fontSize: '11px' }}>
                  <input
                    type="checkbox"
                    onChange={this.handleDistributionChange}
                    defaultChecked={this.state.rule.distSelected}
                  />
                  Apply Dist. Cost
                </label>
                <label style={{ fontSize: '11px' }}>
                  <input type="checkbox" onChange={this.handleVatChange} defaultChecked={this.state.rule.vatSelected} />
                  Apply VAT
                </label>
                <label style={{ fontSize: '11px' }}>
                  <input
                    type="checkbox"
                    onChange={this.handleGuaranteeChange}
                    defaultChecked={this.state.rule.guaranteedSelected}
                  />
                  Apply Guarantee Fund
                </label>
              </div>
            )}
          </Flexbox>

          <Flexbox alignItems={'flex-end'}>
            <SubHeader marginRight={'10px'}>Applicability</SubHeader>

            <JobStatus
              jobId={jobId}
              onJobCompleted={this.handleJobCompleted}
              content={
                <TextBlock color={hasUnsavedApplicability ? colours.grey2 : 'black'}>
                  (Currently applies to {!assignedProducts ? 0 : assignedProducts} products)
                </TextBlock>
              }
            />
          </Flexbox>

          <Flexbox data-testid="applicability-container" wrap="wrap" marginBottom="15px">
            <ApplicabilityEditor
              disabled={readOnly}
              ruleDefinitionId={rule}
              errorMessage={
                validationErrors && {
                  applicability: validationErrors.applicability,
                  departureTime: validationErrors.departureTime
                }
              }
              matchingCriteriaDefinitions={applicability}
              applicabilityChanged={this.handleApplicabilityChanged}
              selectedMatchingCriterias={selectedApplicability}
              selectedSourceMarkets={rule.configurations[0].sourceMarkets}
            />
          </Flexbox>
          {validationErrors?.productTypeError && <p className="error">{validationErrors?.productTypeError}</p>}
          {defaultDurationGroups && defaultDurationGroups.length > 0 && (
            <Flexbox direction="column" alignItems="flex-start">
              <SubHeader style={{ marginBottom: '10px' }}>Duration groups</SubHeader>
              {!readOnly && (
                <PreDefinedDurationGroupPicker
                  onClick={this.handlePreDefinedDurationGroupPickerClick}
                ></PreDefinedDurationGroupPicker>
              )}
              <DurationGroupsEditor
                disabled={readOnly}
                durationGroups={defaultDurationGroups}
                key={`DurationGroupsEditor-${defaultDurationGroups.length}`} // TODO fix this work around which fixes bug where editor didn't receive correct props
                onChange={this.handleDurationGroupUpdate}
              />
            </Flexbox>
          )}

          <ErrorMessage>{validationErrors && validationErrors.datebands}</ErrorMessage>

          <ConfigurationsEditorComponent
            disabled={readOnly}
            errorMessage={validationErrors && validationErrors.datebands}
            configurations={rule.configurations}
            valueDefinitions={rule.valueDefinitions}
            selectedApplicability={selectedApplicability}
            ruleType={rule.ruleType}
            durationGroups={defaultDurationGroups}
            ruleDefinitionId={ruleDefinitionId}
            onChange={this.updateRuleConfiguration}
            deleteButton={this.props.deleteButton}
            onSave={() => this.handleSave(this.props.onSave, this.props.validationFunc)}
            onSaveAndReturn={() => this.handleSave(this.props.onSaveAndReturn, this.props.validationFunc)}
            editButtonsDisabled={!this.state.hasUnsavedData || this.state.configurationsEditorHasErrors}
            onCancel={this.handleCancel}
            saveSuccess={saveSuccess}
            sourceMarkets={this.props.selectableSourceMarkets}
            currency={rule.currency}
            additionalComponent={additionalComponent}
            updateProperties={this.handlePropertiesChanged}
            properties={rule.properties}
          />
          <RuleValidationModal
            title="Warning"
            onClose={() => this.setState({ showRuleValidationModal: false })}
            show={this.state.showRuleValidationModal}
            message={this.state.ruleValidationErrorMessage}
          ></RuleValidationModal>
        </div>
      )
    );
  }
}

EditRule.propTypes = {
  selectableProperties: PropTypes.array,
  selectableSourceMarkets: PropTypes.array,
  selectableAssociatedProducts: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    values: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        displayName: PropTypes.string
      })
    )
  }),
  applicability: PropTypes.instanceOf(List),
  rule: PropTypes.object,
  ruleDefinitionId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  deleteButton: PropTypes.object,
  onSaveAndReturn: PropTypes.func.isRequired,
  onRuleEdited: PropTypes.func,
  onCancel: PropTypes.func,
  onJobCompleted: PropTypes.func,
  showCurrency: PropTypes.bool.isRequired,
  configurationsAdditionalComponentFactory: PropTypes.func,
  ConfigurationsEditorComponent: PropTypes.any,
  validationFunc: PropTypes.func,
  ruleType: PropTypes.string,
  ruleDefinitions: PropTypes.any,
  templateMargins: PropTypes.any,
  selectedDefinition: PropTypes.any,
  distChecked: PropTypes.any,
  marginChecked: PropTypes.any,
  vatChecked: PropTypes.any
};

EditRule.defaultProps = {
  selectableProperties: [],
  templateMargins: [],
  selectableSourceMarkets: [],
  selectableAssociatedProducts: {},
  deleteButton: null,
  onRuleEdited: () => {},
  onCancel: () => {},
  onJobCompleted: () => {},
  configurationsAdditionalComponentFactory: () => {},
  ConfigurationsEditorComponent: DefaultConfigurationsEditor,
  ruleType: null,
  selectedRuleDefinition: [],
  filteredDefinition: [],
  distributionChecked: true,
  marginChecked: false,
  vatChecked: false
};
export default EditRule;
