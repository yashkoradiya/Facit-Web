import React from 'react';
import { Flexbox } from 'components/styled/Layout';
import { Button } from 'components/styled/Button';

export default function ButtonCellRenderer(props) {
  return (
    <Flexbox data-testid="button-cell-renderer">
      {props.value && (
        <Button padding="0px 10px" height="18px" onClick={() => props.onClick(props.data)}>
          {props.title}
        </Button>
      )}
    </Flexbox>
  );
}
