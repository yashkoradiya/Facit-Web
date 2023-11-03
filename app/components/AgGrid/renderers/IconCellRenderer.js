import React, { Component } from 'react';
import PropTypes from 'prop-types';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/lightGreen';
import blue from '@material-ui/core/colors/blue';
import cyan from '@material-ui/core/colors/cyan';
import amber from '@material-ui/core/colors/amber';
import orange from '@material-ui/core/colors/orange';
import blueGrey from '@material-ui/core/colors/blueGrey';

class IconCellRenderer extends Component {
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.value !== this.props.value) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }
  render() {
    const { value, colDef } = this.props;
    const fontSize =
      colDef && colDef.cellRendererParams && colDef.cellRendererParams.iconSize
        ? colDef.cellRendererParams.iconSize
        : null;
    const altText =
      colDef && colDef.cellRendererParams && colDef.cellRendererParams.altText
        ? colDef.cellRendererParams.altText
        : value;
    let icon = '';
    let color = '';

    switch (value) {
      case true:
      case 'check':
        icon = 'check';
        color = '#4caf50';
        break;
      case false:
        icon = 'warning';
        break;
      case 'dynamic_cruise_component':
      case 'cruise':
        icon = 'directions_boat';
        break;

      case 'base_room':
      case 'accommodation_component':
      case 'accommodation':
        icon = 'hotel';
        break;
      case 'accommodation_only':
        icon = 'home';
        break;
      case 'miscellaneous_cost':
        icon = 'euro_symbol';
        break;

      case 'season':
        color = purple[200];
        icon = 'flare ';
        break;
      case 'country':
        color = green[300];
        icon = 'language ';
        break;
      case 'destination':
        color = green[300];
        icon = 'panorama ';
        break;
      case 'resort':
        color = green[300];
        icon = 'beach_access ';
        break;
      case 'concept':
        color = cyan[100];
        icon = 'donut_small ';
        break;
      case 'classification':
        color = cyan[200];
        icon = 'star ';
        break;
      case 'label':
        color = cyan[300];
        icon = 'label ';
        break;
      case 'accommodation_geography':
        color = orange[200];
        icon = 'home ';
        break;
      case 'roomtypecategory':
        color = amber[200];
        icon = 'hotel ';
        break;
      case 'roomcode':
        color = orange[200];
        icon = 'meeting_room ';
        break;

      case 'airport':
        color = green[300];
        icon = 'local_airport ';
        break;
      case 'cruiseregion':
        color = blue[200];
        icon = 'language ';
        break;
      case 'cruiseline':
        color = blue[200];
        icon = 'directions_boat ';
        break;
      case 'sourcemarket':
        color = blueGrey[200];
        icon = 'flag';
        break;
      case 'contractlevel':
        color = cyan[500];
        icon = 'account_balance ';
        break;
      case 'flight':
        icon = 'flight ';
        break;
      case 'unpublished_flight':
        icon = 'airplanemode_inactive';
        break;
      case 'unpublished':
        icon = 'publish';
        break;
      case 'sourcereference':
        icon = 'text_format';
        break;
      case 'empty':
        icon = '';
        break;
      case 'commissionmarker':
        color = green[500];
        icon = 'add';
        break;
       default:
      icon = 'warning';
    }

    return (
      <div style={{ marginTop: 2, paddingLeft: 0, color: color }} title={altText}>
        <i className="material-icons" style={{ fontSize: fontSize }}>
          {icon}
        </i>
      </div>
    );
  }
}

IconCellRenderer.propTypes = {
  value: PropTypes.oneOf([
    'accommodation',
    'producttype',
    'cruise',
    'dynamic_cruise_component',
    'accommodation_component',
    'accommodation_only',
    'miscellaneous_cost',
    'season',
    'country',
    'destination',
    'resort',
    'concept',
    'classification',
    'label',
    'accommodation_geography',
    'roomtypecategory',
    'airport',
    'cruiseregion',
    'cruiseline',
    'sourcemarket',
    'board',
    'contractlevel',
    'flight',
    'unpublished_flight',
    'unpublished',
    'empty',
    'check',
    'base_room',
    'roomcode',
    'sourcereference',
    true,
    false
  ])
};

export default IconCellRenderer;
