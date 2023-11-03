import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import FilteredSearchBoxes from '../../components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { Flexbox } from '../../components/styled/Layout';
import { LightBlueButton } from '../../components/styled/Button';
import { NavLink } from 'react-router-dom';
import ButtonList from '../../components/FormFields/ButtonList';
import AgGridInfinite from '../../components/AgGrid/AgGridInfinite';

class RuleTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialData: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialData !== prevState.initialData) {
      return {
        initialData: nextProps.initialData
      };
    }
    return null;
  }

  handleCreateTemplateButtonOnClick = createUrl => {
    this.props.history.push(createUrl);
  };

  render() {
    const { data, searchBoxData, createButtons, filteredSearchBoxData, selectedFilterIds, onFilterChanged, userRoles } =
      this.props;

    const filteredCreateButtons = createButtons.filter(b => !b.roles || b.roles.some(role => userRoles.includes(role)));
    const { initialData } = this.state;
    return (
      initialData &&
      selectedFilterIds && (
        <Flexbox direction="column" alignItems="start">
          <Flexbox width="100%" justifyContent="space-between" marginBottom="20px">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {searchBoxData && (
                <FilteredSearchBoxes
                  key={`FilteredSearchBoxes_${searchBoxData.map(x => `${x.criteriaKey}_${x.values.size}`).join('_')}`}
                  items={searchBoxData}
                  filteredItems={filteredSearchBoxData}
                  selectedItemIds={selectedFilterIds}
                  onChange={onFilterChanged}
                />
              )}
            </div>
            <div style={{ marginTop: '20px' }}>
              {filteredCreateButtons.length === 1 ? (
                <LightBlueButton
                  onClick={() => this.handleCreateTemplateButtonOnClick(filteredCreateButtons[0].createUrl)}
                >
                  New Template
                </LightBlueButton>
              ) : (
                <ButtonList title="New Template">
                  {filteredCreateButtons.map(button => {
                    return (
                      <NavLink
                        key={button.createUrl}
                        to={{
                          pathname: button.createUrl,
                          packageType: button.packageType || null
                        }}
                      >
                        {button.label}
                      </NavLink>
                    );
                  })}
                </ButtonList>
              )}
            </div>
          </Flexbox>
          <AgGridInfinite
            columnDefinitions={this.props.columnDefinition}
            dataSet={data}
            agGridKey={this.props.agGridKey}
          />
        </Flexbox>
      )
    );
  }
}

RuleTab.propType = {
  onFilterChanged: PropTypes.func.isRequired,
  searchBoxData: PropTypes.array.isRequired,
  filteredSearchBoxData: PropTypes.array.isRequired,
  columnDefinition: PropTypes.array.isRequired,
  agGridKey: PropTypes.string.isRequired,
  data: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  }),
  buttons: PropTypes.array
};
const mapStateToProps = state => {
  return {
    userRoles: state.appState.user.roles
  };
};
export default connect(mapStateToProps)(withRouter(RuleTab));
