import React, { Component } from 'react';
import settings from 'core/settings/settings';
import { Content } from 'components/styled/Content';

export default class CurrentConfig extends Component {
  render() {
    const configKeys = Object.keys(settings);

    return (
      <Content>
        <h2>Current configuration</h2>
        <ul>
          {configKeys.map(key => {
            return (
              <li key={key}>
                {key} - {settings[key]}
              </li>
            );
          })}
        </ul>
      </Content>
    );
  }
}
