import React, { Component } from 'react';
import { Button } from '../styled/Button';
import PropTypes from 'prop-types';

class SettingsToolPanel extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <span>
          <dl style={{ fontSize: 'medium', padding: '30px 40px 10px 30px' }}>
            <dt>Settings</dt>
            <dt>
              <Button marginTop="10px" onClick={this.props.Click}>
                Reset columns
              </Button>
            </dt>
          </dl>
        </span>
      </div>
    );
  }
}

SettingsToolPanel.propTypes = {
  Click: PropTypes.func.isRequired
};

export default SettingsToolPanel;
