import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEnterKey } from '../../helpers/keyChecker';
import { Flexbox } from '../styled/Layout';
import InputField from './InputField';
import { IconButton } from '../styled/Button';
import { Edit, Save, Delete } from '@material-ui/icons';

class EditableLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      editState: false,
      initialName: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.id || nextProps.name !== prevState.initialName) {
      return {
        id: nextProps.id,
        name: nextProps.name,
        editState: false,
        initialName: nextProps.name
      };
    } else return null;
  }

  handleEdit = () => {
    this.setState({ editState: true });
  };

  handleChange = evt => {
    this.setState({ name: evt.target.value });
  };

  handleOnKeyUp = evt => {
    if (isEnterKey(evt.which)) this.handleSave();
  };

  handleSave = () => {
    const { id, name, initialName } = this.state;
    if (!name) {
      this.props.onDelete(id);
    } else if (name === initialName) {
      this.setState({ editState: false });
    } else {
      this.props.onSave(id, name);
    }
  };

  handleDelete = () => {
    this.props.onDelete(this.state.id);
  };

  render() {
    const { name, editState } = this.state;
    const { errorMessage, disabled } = this.props;
    return (
      <Flexbox width="100%">
        <InputField
          value={name}
          onChange={this.handleChange}
          disabled={!editState || disabled}
          onKeyUp={this.handleOnKeyUp}
          errorMessage={errorMessage}
        />

        {!disabled && !editState && (
          <IconButton marginLeft="10px" onKeyUp={this.handleEdit} onClick={this.handleEdit} title="Edit">
            <Edit fontSize="inherit" />
          </IconButton>
        )}
        {!disabled && editState && (
          <IconButton marginLeft="10px" onClick={this.handleSave} title="Save">
            <Save fontSize="inherit" />
          </IconButton>
        )}
        {!disabled && (
          <IconButton marginLeft="4px" onClick={this.handleDelete} title="Delete">
            <Delete fontSize="inherit" />
          </IconButton>
        )}
      </Flexbox>
    );
  }
}

EditableLabel.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default EditableLabel;
