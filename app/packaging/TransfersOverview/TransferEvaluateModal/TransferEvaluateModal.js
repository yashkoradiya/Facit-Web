import React, { useState, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import TransferEvaluatePrices from '../TransferEvaluatePrices';
import { getDateFormat } from '../../../helpers/dateHelper';
import moment from 'moment';
import {
  getProductTypeCount,
  getProductTypeTooltip,
  getProductTypeValues
} from 'packaging/packaging-utils';
import * as api from '../api'

export default function TransferEvaluateModal(props) {
    const [reviewData, setReviewData] = useState(null);
    const { showModal, onClose, allRows, productType, onEvaluated } = props;

  
  useEffect(() => {
    const distinctTransferIds = allRows.reduce((acc, item) => {
      if (acc.some(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId)) return acc;
      return [
        ...acc,
        { id: item.id, sourceMarketId: item.sourceMarketId, productType: getProductTypeValues(productType) }
      ];
    }, []);

//evaluate api call
    api.getEvaluateReview(distinctTransferIds).then(response => {
        const reviewdata = response.data.map(item => {
            const transfer = allRows.find(
              x => x.saleableUnitId == item.saleableUnitId && x.sourceMarketId === item.sourceMarketId
            );
            const { lastEvaluatedAO, lastEvaluatedFS } = item.lastEvaluated || {};
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
            lastEvaluated: item.lastEvaluated,
            evaluatedBy: item.evaluatedBy,
            evaluateStatus: {
                lastEvaluatedAO: lastEvaluatedAO
                  ? moment(lastEvaluatedAO).utcOffset(4, true).format(getDateFormat(3))
                  : 'Not evaluated',
                  lastEvaluatedFS: lastEvaluatedFS
                  ? moment(lastEvaluatedFS).utcOffset(4, true).format(getDateFormat(3))
                  : 'Not evaluated'
              }
            };
          });
          setReviewData(reviewdata);
      });

    },[allRows, productType]);


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
      { value: columnItem.evaluatedBy, hasTooltip: false},
      { value: { productType: columnItem.productType, evaluateStatus: columnItem.evaluateStatus }, hasTooltip: false }
    ];
  });

    return (
      <ModalBase
        show={showModal}
        onRequestClose={onClose}
        width={'1000px'}
        title={'REVIEW AND EVALUATE'}
      >
        {reviewData && (
          <>
          <TransferEvaluatePrices
            onClose={onClose}
            reviewData={reviewData}
            onEvaluatePrices={api.evaluatePrices}
            onEvaluated={onEvaluated}
            headerColumnDefinition={[
                'SaleableUnitId',
                'Source market',
                'Planning Period',
                'Transfer type',
                'Departure point',
                'Arrival point',
                'Product type',
                'Evaluated by',
                'Last evaluated'
            ]}
            bodyColumnValues={columnValues}
            jobType="evaluate_transfers"
            productType={productType}
          />
          </>
        )}
      </ModalBase>
    );
  }



