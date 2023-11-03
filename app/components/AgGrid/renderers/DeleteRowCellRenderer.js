import React from 'react';
import { Flexbox } from 'components/styled/Layout';
import { IconButton } from 'components/styled/Button';
import { Clear } from '@material-ui/icons';

export default function DeleteRowCellRenderer(props) {
  return (
    <Flexbox>
      {!props.disable && (
        <IconButton
          fontSize="16px"
          marginLeft="7px"
          marginRight="7px"
          onClick={() => props.onClick(props.data)}
          data-testid="clear-button"
        >
          <Clear fontSize="inherit" />
        </IconButton>
      )}
    </Flexbox>
  );
}
