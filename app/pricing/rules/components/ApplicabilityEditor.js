import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, fromJS, Map } from 'immutable';
import FilteredSearchBoxes from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import TimeRangeSelector from './TimeRangeSelector';
import { DynamicContractRuleTypes } from '../ruleConstants';
import { connect } from 'react-redux';
import * as appStateActions from '../../../appState/appStateActions';

class ApplicabilityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criterias: [],
      filteredItems: [],
      selectedApplicability: props.selectedMatchingCriterias
        ? fromJS(
            props.selectedMatchingCriterias.map(m => {
              return Map({
                criteriaKey: m.get('criteriaKey'),
                values: m.get('values')
              });
            })
          )
        : List()
    };
  }

  componentDidMount() {
    const { matchingCriteriaDefinitions, ruleDefinitionId } = this.props;

    /**
     * Obtain the ruleType of the current template by the ruleDefinition.
     * If the ruleDefinition contains the {id} property, then it's assumed
     * it's in the template edit phase else new template phase
     */
    const ruleType = ruleDefinitionId?.id
      ? ruleDefinitionId.ruleType
      : ruleDefinitionId.selectedDefinition.type.ruleType;

    const criterias = this.parseMatchingCriterias(matchingCriteriaDefinitions);

    // Set the redux state for dynamicAccommodation for DynamicRule types.
    this.props.setDynamicAccommodation({
      dynamicAccommodationEnabled: DynamicContractRuleTypes.includes(ruleType),
      selectedContractTypes: criterias
        .find(item => item.criteriaKey === 'contracttype')
        ?.values.map(item => item.get('code'))
    });

    this.setState({ criterias, filteredItems: criterias });
  }

  componentDidUpdate(prevProps) {
    const { matchingCriteriaDefinitions } = this.props;
    if (prevProps.matchingCriteriaDefinitions !== matchingCriteriaDefinitions) {
      const criterias = this.parseMatchingCriterias(matchingCriteriaDefinitions);
      // TODO: Refactor this resort handling logic to existing utility method.
      const resortCriteriaIdx = criterias.findIndex(item => item.criteriaKey === 'resort');
      if (resortCriteriaIdx >= 0) {
        const { filteredItems } = this.state;
        const filteredResortIdx = filteredItems.findIndex(item => item.criteriaKey === 'resort');

        if (filteredResortIdx >= 0) {
          filteredItems.splice(filteredResortIdx, 1, criterias[resortCriteriaIdx]);

          this.setState({ filteredItems: [...filteredItems] });
        } else {
          this.setState({ filteredItems: [...filteredItems, criterias[resortCriteriaIdx]] });
        }
      }

      this.setState({ criterias });
    }
  }

  componentWillUnmount() {
    this.props.setDynamicAccommodation({
      dynamicAccommodationEnabled: false
    });
  }

  parseMatchingCriterias = matchingCriteriaDefinitions => {
    let criterias = [];

    matchingCriteriaDefinitions.forEach(definition => {
      const allValues = fromJS(
        definition.get('values').map(value => {
          //Temporary and bad way to solve the issue of code missing visually.. sometimes
          let label = value.name;
          if (definition.get('criteriaKey') !== 'contracttype' && value.code && value.name.indexOf('(') === -1) {
            label = `${label} (${value.code})`;
          }
          return {
            id: value.id,
            name: label,
            code: value.code,
            parentIds: value.parentIds,
            sourceMarketIds: value.sourceMarketIds,
            parentCountryIds: value.parentCountryIds,
            parentDestinationIds: value.parentDestinationIds
          };
        })
      );

      criterias = [
        ...criterias,
        {
          id: definition.get('id'),
          criteriaKey: definition.get('criteriaKey'),
          title: definition.get('title'),
          values: allValues
        }
      ];
    });

    return criterias;
  };

  handleSelectedApplicabilityChange = (selectedItems, filteredItems) => {
    const { dynamicAccommodation, setDynamicAccommodation } = this.props;

    // If dynamic accommodation is enabled, then store the selected contract types in redux store.
    if (dynamicAccommodation.get('dynamicAccommodationEnabled')) {
      const selectedContractTypes = selectedItems.find(item => item.get('criteriaKey') === 'contracttype');
      const contractTypeValues = filteredItems.find(item => item.criteriaKey === 'contracttype')?.values;

      let contractTypeCodes;

      if (selectedContractTypes) {
        contractTypeCodes = contractTypeValues
          ?.filter(cValue => selectedContractTypes.get('values').includes(cValue.get('id')))
          .map(item => item.get('code'));
      } else {
        contractTypeCodes = contractTypeValues?.map(item => item.get('code'));
      }

      setDynamicAccommodation({
        dynamicAccommodationEnabled: dynamicAccommodation.get('dynamicAccommodationEnabled'),
        selectedContractTypes: contractTypeCodes
      });
    }

    if (selectedItems === this.state.selectedApplicability) {
      this.setState({ filteredItems });
    } else {
      this.setState({ selectedApplicability: selectedItems, filteredItems }, () => {
        this.props.applicabilityChanged(this.state.selectedApplicability);
      });
    }
  };

  handleTimeRangeChange = (fromTime, toTime) => {
    const { selectedApplicability } = this.state;
    const index = selectedApplicability.findIndex(x => x.get('criteriaKey') === 'departuretime');

    let updatedSelectedApplicability = selectedApplicability;
    const values = [];
    if (fromTime) values.push(fromTime);
    if (toTime) values.push(toTime);

    if (!fromTime && !toTime) {
      updatedSelectedApplicability = selectedApplicability.delete(index);
    } else if (index === -1) {
      updatedSelectedApplicability = updatedSelectedApplicability.push(
        Map({
          criteriaKey: 'departuretime',
          values: fromJS(values)
        })
      );
    } else {
      updatedSelectedApplicability = selectedApplicability.setIn([index, 'values'], fromJS(values));
    }

    this.setState(
      {
        selectedApplicability: updatedSelectedApplicability
      },
      () => {
        this.props.applicabilityChanged(this.state.selectedApplicability);
      }
    );
  };

  render() {
    const { criterias, selectedApplicability, filteredItems } = this.state;
    const filteredSearchBoxes = criterias.filter(x => x.criteriaKey !== 'departuretime');
    const departureTimeCriteria = criterias.find(x => x.criteriaKey === 'departuretime');
    const filteredItemsWithoutDepartureTimeCriteria = filteredItems.filter(x => x.criteriaKey !== 'departuretime');
    const selectedDepartureTime = selectedApplicability.find(x => x.get('criteriaKey') === 'departuretime');
    const selectedFromTime = selectedDepartureTime?.get('values').sort().get(0);
    const selectedToTime = selectedDepartureTime?.get('values').sort().get(1);
    
    return (
      <React.Fragment>
        {filteredSearchBoxes && (
          <FilteredSearchBoxes
            key={`FilteredSearchBoxes_${filteredSearchBoxes.map(x => x.id).join('_')}`}
            disabled={this.props.disabled}
            items={filteredSearchBoxes}
            filteredItems={filteredItemsWithoutDepartureTimeCriteria}
            selectedItemIds={selectedApplicability}
            onChange={this.handleSelectedApplicabilityChange}
            errorMessage={this.props.errorMessage && this.props.errorMessage.applicability}
            selectedSourceMarkets={this.props.selectedSourceMarkets}
          />
        )}
        {departureTimeCriteria && (
          <TimeRangeSelector
            disabled={this.props.disabled}
            selectedFromTime={selectedFromTime}
            selectedToTime={selectedToTime}
            onChange={this.handleTimeRangeChange}
            errorMessage={this.props.errorMessage}
            hours={departureTimeCriteria.values.toJS().map(x => ({ key: x.id, value: x.name }))}
          ></TimeRangeSelector>
        )}
      </React.Fragment>
    );
  }
}

ApplicabilityEditor.propTypes = {
  matchingCriteriaDefinitions: PropTypes.instanceOf(List),
  applicabilityChanged: PropTypes.func.isRequired,
  selectedMatchingCriterias: PropTypes.instanceOf(List),
  errorMessage: PropTypes.object
};
ApplicabilityEditor.defaultProps = {
  matchingCriteriaDefinitions: List(),
  selectedMatchingCriterias: List()
};

function mapStateToProps(state) {
  return {
    dynamicAccommodation: state.appState.dynamicAccommodation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDynamicAccommodation: status => dispatch(appStateActions.setDynamicAccommodation(status))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicabilityEditor);
