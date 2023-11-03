import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ModalBase from '../../../components/ModalBase';
import ReviewPricesFooter from '../../components/ReviewPricesFooter';
import { Gridbox, StickyResponsiveTableHeader, ResponsiveTableCell, Flexbox } from '../../../components/styled/Layout';
import IndeterminateCheckbox from '../../components/IndeterminateCheckbox';
import InputCheckbox from '../../../components/FormFields/InputCheckbox';
import { MoneyLabel } from '../../../components/MoneyLabels';
import * as api from './api';
import { getDateFormat } from '../../../helpers/dateHelper';

export default function ReviewCharterFlightPrices({ allRows, onClose, onPublished, showModal, currency }) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [selectedFlightSeries, setSelectedFlightSeries] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [durations] = useState([0, 7, 14, 21, 28]);
  const [hasError] = useState(false);

  useEffect(() => {
    const data = allRows.map(flightSeries => {
      return {
        key: `${flightSeries.id}_${flightSeries.sourceMarketId}`,
        transportCode: flightSeries.transportCode,
        masterId: flightSeries.id,
        flightSeriesName: `${flightSeries.departureAirport} - ${flightSeries.arrivalAirport}`,
        sourceMarketName: flightSeries.sourceMarket,
        sourceMarketId: flightSeries.sourceMarketId,
        averageCost: flightSeries.averageCost,
        averageMargin: flightSeries.averageMargin,
        planningPeriod: flightSeries.season,
        lastPublished: flightSeries.lastPublished,
        productType: flightSeries.productType
      };
    });
    setReviewData(data);

    const selected = data.map(m => {
      return { key: m.key, checked: true };
    });
    setSelectedFlightSeries(selected);
  }, [allRows]);

  useEffect(() => {
    setSaveSuccess(false);
  }, [selectedFlightSeries]);

  const handleIndeterminateChange = checked => {
    setSelectedFlightSeries(
      selectedFlightSeries.map(x => ({
        ...x,
        checked: checked !== 'checked'
      }))
    );
  };

  const evaluateReviewDataCheckedStatus = () => {
    if (selectedFlightSeries.every(x => x.checked)) return 'checked';
    if (selectedFlightSeries.some(x => x.checked)) return 'indeterminate';
    return 'unchecked';
  };

  const handleCheckboxChanged = flightSeries => {
    const updatedSelectedFlightSeries = [...selectedFlightSeries];
    const target = updatedSelectedFlightSeries.find(x => x.key === flightSeries.key);
    target.checked = !target.checked;
    setSelectedFlightSeries(updatedSelectedFlightSeries);
  };

  const handlePublishPrices = () => {
    const selectedFlightSeriesIds = selectedFlightSeries.filter(x => x.checked).map(m => m.key);
    const publishInputModel = reviewData
      .filter(x => selectedFlightSeriesIds.some(y => y === x.key))
      .map(x => {
        return {
          id: x.masterId,
          sourceMarketId: x.sourceMarketId,
          durations: durations
        };
      });

    setPublishing(true);

    Promise.all(
      publishInputModel.map(
        input => api.publishPrices(input)
        // .then(response => {
        //   // const approvalId = response.data;
        // })
      )
    ).then(() => {
      setPublishing(false);
      setSaveSuccess(true);

      setTimeout(() => {
        return onPublished();
      }, 4000);
    });
  };

  return (
    <ModalBase show={showModal} onRequestClose={onClose} width={'950px'} title={'Review and publish'}>
      <Flexbox direction="column" width="100%" alignItems="flex-start">
        <Gridbox
          style={{
            width: '100%',
            marginBottom: '5px',
            marginTop: '5px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          columnDefinition={'35px 120px 100px auto 65px 120px 120px 120px 120px'}
          border
        >
          <StickyResponsiveTableHeader>
            <IndeterminateCheckbox onChange={handleIndeterminateChange} checked={evaluateReviewDataCheckedStatus()} />
          </StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Transport Code</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Source market</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>FlightSeries</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Avg. Cost</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Avg. Margin</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Planning Period</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Last published</StickyResponsiveTableHeader>
          <StickyResponsiveTableHeader>Product type</StickyResponsiveTableHeader>
          {selectedFlightSeries.length > 0 &&
            reviewData.map(x => {
              const checked = selectedFlightSeries.find(sa => sa.key === x.key).checked;
              return (
                <React.Fragment key={x.key}>
                  <ResponsiveTableCell>
                    <InputCheckbox onChange={() => handleCheckboxChanged(x)} checked={checked} />
                  </ResponsiveTableCell>
                  <ResponsiveTableCell>{x.transportCode}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.sourceMarketName}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.flightSeriesName}</ResponsiveTableCell>
                  <ResponsiveTableCell>
                    <MoneyLabel value={x.averageCost.values[currency]} />
                  </ResponsiveTableCell>
                  <ResponsiveTableCell>{x.averageMargin}</ResponsiveTableCell>
                  <ResponsiveTableCell>{x.planningPeriod}</ResponsiveTableCell>
                  <ResponsiveTableCell>
                    {x.lastPublished
                      ? moment(x.lastPublished)
                          .utcOffset(4) // will this work with summer/winter time?
                          .format(getDateFormat(3))
                      : ''}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell>{x.productType}</ResponsiveTableCell>
                </React.Fragment>
              );
            })}
        </Gridbox>
        <p style={{ marginTop: '0px' }}>{`${selectedFlightSeries.filter(a => a.checked).length} selected`}</p>
        <ReviewPricesFooter
          saveSuccess={saveSuccess}
          publishing={publishing}
          errors={false}
          onPublishPrices={handlePublishPrices}
          onClose={onClose}
          disablePublish={hasError}
        />
      </Flexbox>
    </ModalBase>
  );
}
