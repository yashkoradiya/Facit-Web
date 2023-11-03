import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import { PrimaryButton, Button } from '../../components/styled/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Flexbox } from '../../components/styled/Layout';

export default function ReviewPricesFooter({
  publishing,
  saveSuccess,
  disablePublish,
  errors,
  onPublishPrices,
  onClose
}) {
  return (
    <Flexbox width="100%" justifyContent="space-between">
      <div className="empty-div-so-space-between-works-before-publishing" />
      {publishing && (
        <Flexbox>
          <CircularProgress style={{ marginRight: 12 }} size={20} />
          <p style={{ display: 'inline', margin: 0 }}>Publishing prices...</p>
        </Flexbox>
      )}
      {saveSuccess && !publishing && !errors && (
        <Flexbox>
          <DoneIcon style={{ color: 'green', fontSize: 24, marginRight: 12 }} />
          <p style={{ display: 'inline', margin: 0 }}>Publish completed</p>
        </Flexbox>
      )}
      {saveSuccess && !publishing && errors > 0 && (
        <Flexbox>
          <DoneIcon style={{ color: 'red', fontSize: 24, marginRight: 12 }} />
          <p style={{ display: 'inline', margin: 0 }}>Publish completed with {errors} errors</p>
        </Flexbox>
      )}
      <Flexbox>
        <PrimaryButton
          disabled={publishing || saveSuccess || disablePublish}
          onClick={onPublishPrices}
          style={{ marginRight: '15px' }}
        >
          Publish selected prices
        </PrimaryButton>
        <Button disabled={publishing || saveSuccess} onClick={onClose}>
          Cancel
        </Button>
      </Flexbox>
    </Flexbox>
  );
}
