import React from 'react';
import numeral from 'numeral';

export default function PercentageLabel({ value }) {
  return <span className="percentage-cell-renderer pull-right">{numeral(value).format('0.0%')}</span>;
}
