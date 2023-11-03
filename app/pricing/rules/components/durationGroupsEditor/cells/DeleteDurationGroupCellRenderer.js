import React from 'react';
import { Flexbox } from '../../../../../components/styled/Layout';
import { IconButton } from '../../../../../components/styled/Button';
import { Clear } from '@material-ui/icons';

export default function DeleteDurationGroupCellRenderer(props) {
  if (props.data.isNew || props.context.disabled) return '';

  return (
    <Flexbox>
      <IconButton
        fontSize="16px"
        marginLeft="7px"
        marginRight="7px"
        onClick={() => props.onClick(props.data.key)}
        data-id="clear-button"
        title="Delete"
      >
        <Clear fontSize="inherit" />
      </IconButton>
    </Flexbox>
  );
}
