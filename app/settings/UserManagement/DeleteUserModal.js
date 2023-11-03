import React from 'react';
import ModalBase from 'components/ModalBase';
import { PrimaryButton, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';

export default function DeleteUserModal({ show, onClose, onDelete, user }) {
  return (
    <ModalBase
      show={show}
      onRequestClose={onClose}
      title={`Confirm deletion of user ${user && user.name}`}
      width="500px"
      height="180px"
    >
      {show && (
        <Flexbox height="100%" direction="column" alignItems="flex-start">
          <Flexbox marginBottom="10px">{`Are you sure you want to delete user ${user && user.name}?`}</Flexbox>
          <Flexbox alignSelf="flex-end" marginTop="auto">
            <PrimaryButton marginRight="10px" onClick={() => onDelete(user)}>
              Delete
            </PrimaryButton>
            <Button onClick={onClose}>Cancel</Button>
          </Flexbox>
        </Flexbox>
      )}
    </ModalBase>
  );
}
