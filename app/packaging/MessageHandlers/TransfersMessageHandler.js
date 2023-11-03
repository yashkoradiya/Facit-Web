/* istanbul ignore file */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getTransferPricesAPI } from '../TransfersOverview/api';
import { v4 as uuidv4 } from 'uuid';
import Spinner from 'components/Spinner';
import TransfersPriceDetails from '../TransfersOverview/PriceDetails/TransfersPriceDetails';

export function TransfersMessageHandler() {
  const [state, setState] = useState({ overviewData: null, loading: false, datasets: null, priceDetails: [] });
  const messageStateRef = useRef(null);

  useEffect(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      if (window.onServiceWorkerReady) {
        window.onServiceWorkerReady();
      }
    }
  }, [handleMessage]);

  const handleMessage = useCallback(message => {
    const { data, event } = message.data;

    setState(prevState => ({
      ...prevState,
      overviewData: data
    }));

    if (event === 'remove') {
      const { datasets: datasetRef, priceDetails: priceDetailsRef } = messageStateRef.current;
      const updatedDatasets = datasetRef.filter(dataset => dataset.masterId !== Number(data.id));
      const updatedPriceDetails = priceDetailsRef.filter(d => d.masterId !== Number(data.id));

      const updatedData = {
        datasets: updatedDatasets,
        priceDetails: updatedPriceDetails
      };

      messageStateRef.current = updatedData;
      setState(prevState => ({
        ...prevState,
        ...updatedData
      }));
    } else {
      processTransferPriceDetails(data);
    }
  }, []);

  const processTransferPriceDetails = data => {
    setState(prevState => ({
      ...prevState,
      loading: true
    }));
    getTransferPricesAPI(data.id, data.productType)
      .then(response => {
        const mappedDatasets = mapGraphData(response.data, data);

        const mappedPriceDetails = mapPriceDetails(response.data);
        const newData = {
          datasets: mappedDatasets,
          priceDetails: mappedPriceDetails
        };
        setState(prevState => ({
          ...prevState,
          ...newData
        }));
        messageStateRef.current = newData;
      })
      .finally(() =>
        setState(prevState => ({
          ...prevState,
          loading: false
        }))
      );
  };

  const updateDataset = updatedDataset => {
    messageStateRef.current = { ...messageStateRef.current, datasets: updatedDataset };
    setState(prevState => ({
      ...prevState,
      datasets: updatedDataset
    }));
  };

  const { loading, datasets, priceDetails, overviewData } = state;

  return (
    <div>
      <Spinner loading={loading} />
      {!!datasets && (
        <TransfersPriceDetails
          datasets={datasets}
          onDatasetUpdate={updateDataset}
          priceDetails={priceDetails}
          onRefresh={() => processTransferPriceDetails(overviewData)}
        />
      )}
    </div>
  );
}

const mapGraphData = (result, data) => {
  return result.chartData.datasets.map(dataset => ({
    key: uuidv4(),
    masterId: result.id,
    id: dataset.label,
    label: dataset.label,
    data: dataset.data,
    selected: true,
    metadata: {
      ageCategoryType: dataset.ageCategoryType,
      sourceMarketName: data.sourceMarket,
      sourceMarketId: data.sourceMarketId,
      salableUnitId: dataset.salableUnitId,
      unitType: dataset.unitType
    }
  }));
};

const mapPriceDetails = data => {
  const { priceDetails } = data;
  if (!priceDetails?.length) return [];

  return priceDetails.map(item => ({
    key: `${data.id}`,
    masterId: data.id,
    productType: item.productType,
    sourceMarket: item.sourceMarket,
    unitType: item.unitType,
    date: item.date,
    weekday: item.weekday,
    ageCategoryType: item.ageCategory,
    transferCost: item.transferCost,
    transferPrice: item.transferPrice,
    margin: item.transferMargin,
    distributionCost: item.transferDistribution,
    vat: item.transferVat,
    tooltips: item.transferTooltips
  }));
};
