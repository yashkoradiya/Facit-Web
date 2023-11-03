import React from 'react';
import ModalBase from 'components/ModalBase';
import { PrimaryButton, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';

export default function ConfirmationBox({ show, onCancel, title, onConfirmation }) {
  return (
    <ModalBase show={show} onRequestClose={onCancel} title={title} width="500px" height="250px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <p>
          The new currency exchange rate till effect price calculations. are you sure you want to create a new exchange
          rate?
        </p>
        <Flexbox alignSelf="flex-end" marginTop="auto">
          <PrimaryButton marginRight="10px" onClick={() => onConfirmation()}>
            Yes, Create exchange rate
          </PrimaryButton>
          <Button onClick={onCancel}>No, Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
