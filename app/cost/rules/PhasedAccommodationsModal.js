import React from 'react';
import numeral from 'numeral';
import { StickyResponsiveTableHeader, ResponsiveTableCell, Gridbox, Flexbox } from 'components/styled/Layout';
import { Button } from 'components/styled/Button';
import ModalBase from 'components/ModalBase';

export default function PhasedAccommodationsModal({ phasedAccommodations, show, onRequestClose }) {
  return (
    <ModalBase show={show} title={'Phased accommodations'} width="600px" onRequestClose={onRequestClose}>
      <Flexbox direction="column">
        <Gridbox
          style={{
            width: '100%',
            marginBottom: '25px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          columnDefinition={'auto auto auto auto auto'}
          border
        >
          <StickyResponsiveTableHeader>Contr.acc.code</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Destination</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Resort</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Accommodation</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Commitment</StickyResponsiveTableHeader>
          {phasedAccommodations.length > 0 &&
            phasedAccommodations.map((x, index) => {
              return (
                <React.Fragment key={`${x.code}_${index}`}>
                  <ResponsiveTableCell>{x.code}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.destination}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.resort}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.accommodationName}</ResponsiveTableCell>
                  <ResponsiveTableCell>{numeral(x.commitmentLevel).format('0.0%')}</ResponsiveTableCell>
                </React.Fragment>
              );
            })}
        </Gridbox>
        <Flexbox justifyContent="flex-end" width="100%">
          <Button onClick={onRequestClose}>Close</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
