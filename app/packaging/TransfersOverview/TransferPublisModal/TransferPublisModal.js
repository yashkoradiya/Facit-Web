import React, { useState, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import TransferReviewPrices from '../TransferReviewPrices';
import { getDateFormat } from '../../../helpers/dateHelper';
import moment from 'moment';
import {
  getProductTypeCount,
  getProductTypeTooltip,
  getProductTypeValues
} from 'packaging/packaging-utils';
import * as api from '../api';

export default function TransferPublishModal(props) {
  
  const [reviewData, setReviewData] = useState(null);
  const { showModal, onClose, allRows, productType, onPublished } = props;

  useEffect(() => {
    const distinctTransferIds = allRows.reduce((acc, item) => {
      if (acc.some(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId)) return acc;
      return [
        ...acc,
        { id: item.id, sourceMarketId: item.sourceMarketId, productType: getProductTypeValues(productType) }
      ];
    }, []);

    //review api call
    api.getReview(distinctTransferIds).then(response => {
      const reviewdata = response.data.map(item => {
        const transfer = allRows.find(
          x => x.saleableUnitId == item.saleableUnitId && x.sourceMarketId === item.sourceMarketId
        );

        const { lastPublishedAO, lastPublishedFS } = item.lastPublished || {};

        return {
          key: `${transfer.saleableUnitId}_${transfer.sourceMarketId}`,
          id: transfer.id,
          saleableUnitId: transfer.saleableUnitId,
          sourceMarketId: transfer.sourceMarketId,
          productType: item.productType,
          transferType: item.category,
          planningPeriod: item.seasonId,
          departurePoint: item.transferTo,
          arrivalPoint: item.transferFrom,
          lastPublishedBy: item.lastPublished,
          publishedBy: item.publishedBy,
          publishStatus: {
            lastPublishedAO: lastPublishedAO
              ? moment(lastPublishedAO).utcOffset(4, true).format(getDateFormat(3))
              : 'Not published',
            lastPublishedFS: lastPublishedFS
              ? moment(lastPublishedFS).utcOffset(4, true).format(getDateFormat(3))
              : 'Not published'
          }
        };
      });

      setReviewData(reviewdata);
    });
  }, [allRows, productType]);

  if (!reviewData) return null;
  let columnValues = reviewData.map(columnItem => {
    return [
      { value: columnItem.key, hasTooltip: false },
      { value: columnItem.id, hasTooltip: false },
      { value: columnItem.saleableUnitId, hasTooltip: false },
      { value: columnItem.sourceMarketId, hasTooltip: false },
      { value: columnItem.planningPeriod, hasTooltip: false},
      { value: columnItem.transferType, hasTooltip: false},
      { value: columnItem.departurePoint, hasTooltip: false},
      { value: columnItem.arrivalPoint, hasTooltip: false}, 
      {
        value: getProductTypeCount(productType, columnItem.productType),
        hasTooltip: true,
        tooltipData: getProductTypeTooltip(productType, columnItem.productType, columnItem.key)
      },
      { value: columnItem.publishedBy, hasTooltip: false},
      { value: { productType: columnItem.productType, publishStatus: columnItem.publishStatus }, hasTooltip: false }
    ];
  });

  return (
    <ModalBase
        show={showModal}
        onRequestClose={onClose}
        width={'1000px'}
        title={'Review and publish'}
      >
      {reviewData && (
        <TransferReviewPrices
          onClose={onClose}
          reviewData={reviewData}
          onPublishPrices={api.publishPrices}
          onPublished={onPublished}
          headerColumnDefinition={[
            'SaleableUnitId',
            'Source market',
            'Planning Period',
            'Transfer type',
            'Departure point',
            'Arrival point',
            'Product type',
            'Published by',
            'Last published'
          ]}
          bodyColumnValues={columnValues}
          jobType="transfers"
          productType={productType}
        />
      )}
    </ModalBase>
  );
}
