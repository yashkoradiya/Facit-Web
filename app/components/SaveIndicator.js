import React, { useState, useEffect } from 'react';
import { Flexbox } from './styled/Layout';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';

export default function SaveIndicator({ saving }) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (saving) {
      setDirty(true);
    }
  }, [saving]);

  if (!dirty) return null;

  return saving ? (
    <Flexbox>
      <span style={{ marginRight: '8px' }}>Saving</span>
      <CircularProgress style={{ marginRight: 12 }} size={15} />
    </Flexbox>
  ) : (
    <Flexbox>
      <span style={{ marginRight: '4px' }}>Saved</span>
      <DoneIcon style={{ color: 'green', fontSize: 15 }} />
    </Flexbox>
  );
}
