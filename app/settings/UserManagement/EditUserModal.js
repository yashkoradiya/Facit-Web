import React, { useState, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import { PrimaryButton, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';
import SearchBox from 'components/FormFields/SearchBox';
import { List, fromJS } from 'immutable';

export default function EditUserModal({ show, onClose, onSave, user, roles, regions }) {
  const [selectedRoleIds, setSelectedRoleIds] = useState(List());
  const [selectedRegionIds, setSelectedRegionIds] = useState(List());

  useEffect(() => {
    if (user) {
      setSelectedRoleIds(fromJS(user.userRoles.map(x => x.id)));
      setSelectedRegionIds(fromJS(user.userRegions.map(x => x.id)));
    }
  }, [user]);

  return (
    <ModalBase
      show={show}
      onRequestClose={onClose}
      title={`Assign roles and regions to ${user && user.name}`}
      width="500px"
      height="300px"
    >
      {show && (
        <Flexbox height="100%" direction="column" alignItems="flex-start">
          <Flexbox marginBottom="10px">
            <SearchBox
              key={`searchbox_userroles`}
              items={fromJS(roles)}
              placeholder={'Select Roles'}
              onChange={selectedItemIds => setSelectedRoleIds(selectedItemIds)}
              selectedItemIds={selectedRoleIds}
            />
            <SearchBox
              key={`searchbox_userregions`}
              items={fromJS(regions)}
              placeholder={'Select Regions'}
              onChange={selectedItemIds => setSelectedRegionIds(selectedItemIds)}
              selectedItemIds={selectedRegionIds}
            />
          </Flexbox>
          <Flexbox alignSelf="flex-end" marginTop="auto">
            <PrimaryButton marginRight="10px" onClick={() => onSave(selectedRoleIds.toJS(), selectedRegionIds.toJS())}>
              Save
            </PrimaryButton>
            <Button onClick={onClose}>Cancel</Button>
          </Flexbox>
        </Flexbox>
      )}
    </ModalBase>
  );
}
