import React, { useEffect, useState } from 'react';
import { NiceCheckbox } from '../../components/styled/Input';

const IndeterminateCheckbox = ({ checked, onChange }) => {
  const [check, setCheck] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    setCheck(checked === 'checked');
    setIndeterminate(checked === 'indeterminate');
  }, [checked]);

  return <NiceCheckbox data-testid="indeterminate-check-box" onClick={() => onChange(checked)} checked={check} indeterminate={indeterminate} />;
};

export default IndeterminateCheckbox;
