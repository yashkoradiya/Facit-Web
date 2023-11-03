import React, { Component } from 'react';
import InputField from 'components/FormFields/InputField';

class index extends Component {
  state = {
    value: ''
  };

  handleChange = value => {
    this.setState({ value });
  };
  render() {
    return (
      <div>
        <InputField
          label={'Duration'}
          value={this.state.value || 7}
          onChange={e => this.handleChange(e.target.value)}
          type={'number'}
          width={'60px'}
          min="1"
          debounceTimeout={250}
        />
      </div>
    );
  }
}

export default index;
