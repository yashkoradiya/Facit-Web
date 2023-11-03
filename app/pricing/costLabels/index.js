import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as api from './api';
import { isEnterKey } from 'helpers/keyChecker';
import InputField from 'components/FormFields/InputField';
import EditableLabel from 'components/FormFields/EditableLabel';
import { Flexbox, PageHeader, FramedFlexbox, FramedTitle } from 'components/styled/Layout';
import { StripedList, ListItem } from 'components/styled/List';
import { PrimaryButton } from 'components/styled/Button';

class CostLabels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCostLabel: '',
      costLabels: [],
      error: null
    };
  }

  componentDidMount() {
    this.getCostLabels();
  }

  getCostLabels = () => {
    api.getCostLabels().then(response => {
      this.setState({
        costLabels: response.data,
        initialCostLabels: response.data,
        error: null
      });
    });
  };

  handleChange = evt => {
    this.setState({
      newCostLabel: evt.target.value
    });
  };

  handleKeyUp = evt => {
    if (isEnterKey(evt.which)) {
      this.handleCreate();
    }
  };

  handleUpdate = (id, value) => {
    api
      .updateCostLabel(id, value)
      .then(() => this.getCostLabels())
      .catch(error => this.setState({ error: { id, message: error.response.data } }));
  };

  handleCreate = () => {
    if (this.state.newCostLabel) {
      api
        .createCostLabel(this.state.newCostLabel)
        .then(() => this.setState({ newCostLabel: '' }))
        .then(() => this.getCostLabels())
        .catch(error => this.setState({ error: { id: 0, message: error.response.data } }));
    } else {
      this.setState({
        error: { id: 0, message: 'The value can not be empty.' }
      });
    }
  };

  handleDelete = id => {
    api.deleteCostLabel(id).then(() => this.getCostLabels());
  };

  render() {
    const { costLabels, newCostLabel, error } = this.state;
    const { access } = this.props;

    return (
      <div>
        <Flexbox marginBottom="10px">
          <PageHeader>Cost labels</PageHeader>
        </Flexbox>
        {access.componenttemplates.misccost.write && (
          <FramedFlexbox width="500px">
            <FramedTitle>Add cost label</FramedTitle>
            <Flexbox alignItems="flex-end">
              <InputField
                value={newCostLabel}
                placeholder="New cost label"
                onKeyUp={this.handleKeyUp}
                onChange={this.handleChange}
                errorMessage={error && error.id === 0 ? error.message : null}
              />
              <PrimaryButton marginLeft="10px" onClick={this.handleCreate}>
                Save
              </PrimaryButton>
            </Flexbox>
          </FramedFlexbox>
        )}

        <FramedFlexbox width="500px">
          <FramedTitle>Current cost labels</FramedTitle>
          {costLabels.length > 0 && (
            <StripedList>
              {costLabels.map(item => (
                <ListItem key={item.id}>
                  <EditableLabel
                    disabled={!access.componenttemplates.misccost.write}
                    errorMessage={error && error.id === item.id.toString() ? error.message : null}
                    id={`${item.id}`}
                    name={item.name}
                    onDelete={this.handleDelete}
                    onSave={this.handleUpdate}
                  />
                </ListItem>
              ))}
            </StripedList>
          )}
        </FramedFlexbox>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    access: state.appState.user.access
  };
};

export default connect(mapStateToProps)(CostLabels);
