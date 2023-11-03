import React from 'react';
import { Link } from 'react-router-dom';
import { Flexbox, PageHeader } from 'components/styled/Layout';

export default function Header({ goBackUrl, title }) {
  return (
    <Flexbox marginBottom="10px">
      <Link
        style={{
          height: 21
        }}
        onClick={e => {
          e.stopPropagation();
        }}
        to={goBackUrl}
      >
        <i className="material-icons">navigate_before</i>
      </Link>
      <PageHeader>{title}</PageHeader>
    </Flexbox>
  );
}
