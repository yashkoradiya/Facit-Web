import React from 'react';
import ModalBase from 'components/ModalBase';
import { Flexbox } from 'components/styled/Layout';

export default function RuleValidationModal({ onClose, show, title, message }) {
  return (
    <ModalBase show={show} onRequestClose={onClose} title={title} width="500px" height="500px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <Flexbox justifyContent="space-between" marginBottom="20px">
          {message}
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
