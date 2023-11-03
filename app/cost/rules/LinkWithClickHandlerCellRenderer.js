import React from 'react';

export default function LinkWithClickHandlerCellRenderer({ value, data }) {
  if (!value) return null;

  const { name, handler } = value;
  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault();
        handler(data.id);
      }}
    >
      {name}
    </a>
  );
}
