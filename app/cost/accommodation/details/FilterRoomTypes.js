import React from 'react';
import { fromJS } from 'immutable';
import SearchBox from '../../../components/FormFields/SearchBox';
import { Flexbox } from '../../../components/styled/Layout';

export default function FilterRoomTypes({ roomTypes, selectedIds, onChange }) {
  return (
    <Flexbox alignItems="flex-start">
      <p style={{ marginRight: '10px' }}>Filter on room types:</p>
      <SearchBox
        key={`filterRoomTypes_searchbox`}
        items={fromJS(roomTypes)}
        onChange={onChange}
        selectedItemIds={selectedIds}
        placeholder={''}
      />
    </Flexbox>
  );
}
