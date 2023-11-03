import React from 'react';
import { Flexbox } from 'components/styled/Layout';

export default function PublishStatusCellRenderer({ value, getStatus }) {
  const { icon, text, color } = getStatus(value);

  return (
    <Flexbox>
      <i className="material-icons" style={{ fontSize: 14, marginRight: 4, color: color }}>
        {icon}
      </i>
      {text}
    </Flexbox>
  );
}
