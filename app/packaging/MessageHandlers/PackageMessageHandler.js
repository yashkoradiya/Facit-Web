/* istanbul ignore file */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Spinner from 'components/Spinner';
import { getPackagePricesV2, saveSellingPrice } from '../package/details/api';
import { v4 as uuidv4 } from 'uuid';
import PackagePriceDetails from '../package/details/PriceDetails/PackagePriceDetails';
import { isF5Key } from 'helpers/keyChecker';
import moment from 'moment';
import styled from 'styled-components';
import { colours } from '../../components/styled/defaults';

export function PackageMessageHandler() {
  const [state, setState] = useState({
    overviewData: null,
    loading: false,
    datasets: [],
    priceDetails: [],
    roomTypes: [],
    flightCriteria: null,
    underOccupancyDetails: [],
    overOccupancyDetails: [],
    boardUpgradeDetails: [],
    ancillaryDetails: [],
    hasOutboundHomeboundFlights: false,
    disconnected: false
  });
  const [changes, setChanges] = useState(false);
  const messageStateRef = useRef(state);

  useEffect(() => {
    if (changes) {
      window.addEventListener('beforeunload', handleUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [changes]);

  const resetChanges = () => {
    setChanges(false);
  };

  const handleUnload = event => {
    const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave this page?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  useEffect(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      if (window.onServiceWorkerReady) {
        window.onServiceWorkerReady();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMessage]);

  const handleKeyDown = event => {
    if (isF5Key(event.which)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleMessage = useCallback(message => {
    const { data, event } = message.data;
    setState(prevState => ({
      ...prevState,
      overviewData: data
    }));

    if (event === 'disconnect' || state.disconnected) {
      setState(prevState => ({
        ...prevState,
        disconnected: true
      }));
    } else if (event === 'remove') {
      const dataKey = `${data.sourceMarketId}_${data.roomTypeId}`;
      const {
        datasets: datasetRef,
        priceDetails: priceDetailsRef,
        roomTypes,
        underOccupancyDetails
      } = messageStateRef.current;
      const updatedDatasets = datasetRef.filter(dataset => dataset.id !== dataKey);
      const updatedPriceDetails = priceDetailsRef.filter(
        d => !(d.roomTypeId === data.roomTypeId && d.sourceMarketId === data.sourceMarketId)
      );
      const updatedRoomTypes = roomTypes.filter(dataset => dataset.id !== dataKey);
      const updatedUnderOccupancyData = underOccupancyDetails.filter(data => data.key !== dataKey);
      const updatedOverOccupancyData = overOccupancyDetails.filter(data => data.key !== dataKey);
      const updatedBoardUpgradeData = boardUpgradeDetails.filter(data => data.key !== dataKey);
      const updatedAncillaryData = ancillaryDetails.filter(data => data.key !== dataKey);

      const updatedData = {
        datasets: updatedDatasets,
        priceDetails: updatedPriceDetails,
        roomTypes: updatedRoomTypes,
        underOccupancyDetails: updatedUnderOccupancyData,
        overOccupancyDetails: updatedOverOccupancyData,
        boardUpgradeDetails: updatedBoardUpgradeData,
        ancillaryDetails: updatedAncillaryData
      };
      messageStateRef.current = { ...messageStateRef.current, ...updatedData };
      setState(prevState => ({
        ...prevState,
        ...updatedData
      }));
    } else {
      getPricesForSingleRoomType(mapPayloadForPriceDetails(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapPayloadForPriceDetails = (data, filters) => {
    let duration = 7;
    let selectedBookingDate = moment().format('YYYY-MM-DD');
    let simulationAge = null;
    let simulationBed = null;
    let selectedFlightKeys = [];
    let selectedFlightValues = [];

    if (filters) {
      duration = filters.duration;
      selectedBookingDate = filters.bookingDate;
      simulationAge = filters.simulationAge;
      simulationBed = filters.simulationBed;
    }

    const payload = [
      {
        accommodationId: data.masterId,
        roomTypeId: data.roomTypeId,
        sourceMarketId: data.sourceMarketId,
        countryId: data.countryId,
        destinationId: data.destinationId,
        planningPeriodId: data.planningPeriodId,
        airportcode: data.airportcode,
        currency: data.currency,
        duration,
        bookingDate: selectedBookingDate,
        simulationAge,
        simulationBed,
        selectedFlightKeys,
        selectedFlightValues
      }
    ];
    return payload;
  };

  const getPricesForSingleRoomType = payload => {
    setState(prevState => ({
      ...prevState,
      loading: true
    }));
    const duration = payload[0].duration;
    getPackagePricesV2(payload)
      .then(response => {
        const apiData = response.data[0];

        const {
          datasets: datasetRef,
          priceDetails: priceDetailsRef,
          roomTypes,
          underOccupancyDetails,
          overOccupancyDetails,
          boardUpgradeDetails,
          ancillaryDetails
        } = messageStateRef.current;

        const newDatasets = [...datasetRef, ...mapGraphData(apiData, duration)];
        const newPriceDetails = [...priceDetailsRef, ...apiData.details.prices];
        const newRoomTypes = [...roomTypes, { ...apiData, id: `${apiData.sourceMarketId}_${apiData.roomTypeId}` }];
        const underOccupancyData = [...underOccupancyDetails, ...mapUnderOccupancyData(apiData)];
        const overOccupancyData = [...overOccupancyDetails, ...mapOverOccupancyData(apiData)];
        const boardUpgradeData = [...boardUpgradeDetails, ...mapBoardUpgradeData(apiData)];
        const ancillaryData = [...ancillaryDetails, ...mapOptionalItems(apiData)];
        const newFlightCriteria = apiData.selectedFlightCriterias;

        const newData = {
          datasets: newDatasets,
          priceDetails: newPriceDetails,
          roomTypes: newRoomTypes,
          flightCriteria: newFlightCriteria,
          underOccupancyDetails: underOccupancyData,
          overOccupancyDetails: overOccupancyData,
          boardUpgradeDetails: boardUpgradeData,
          ancillaryDetails: ancillaryData,
          hasOutboundHomeboundFlights: apiData.hasOutboundHomeboundFlights
        };
        setState(prevState => ({
          ...prevState,
          ...newData
        }));
        messageStateRef.current = { ...messageStateRef.current, ...newData };
      })
      .finally(() =>
        setState(prevState => ({
          ...prevState,
          loading: false
        }))
      );
  };

  const getUpdatedPricesForAll = filters => {
    if (!state.roomTypes.length) return;

    let selectedFlightKeys = [],
      selectedFlightValues = [];

    filters.flightCriteria.forEach(criteria => {
      let cc = criteria.toJS();
      if (filters.selectedFlightItems.includes(cc.id)) {
        selectedFlightKeys.push(cc.id);
        selectedFlightValues.push(cc.name);
      }
    });

    const payload = state.roomTypes.map(roomType => ({
      accommodationId: roomType.accommodationId,
      roomTypeId: roomType.roomTypeId,
      sourceMarketId: roomType.sourceMarketId,
      duration: filters.duration,
      bookingDate: filters.bookingDate.isValid() ? filters.bookingDate.format('YYYY-MM-DD') : null,
      simulationAge: filters.simulationAge,
      simulationBed: filters.simulationBed,
      countryId: overviewData.countryId,
      destinationId: overviewData.destinationId,
      planningPeriodId: overviewData.planningPeriodId,
      airportcode: overviewData.airportcode,
      currency: overviewData.currency,
      selectedFlightKeys,
      selectedFlightValues
    }));
    setState(prevState => ({
      ...prevState,
      loading: true
    }));
    const duration = payload[0].duration;
    getPackagePricesV2(payload)
      .then(response => {
        const apiData = response.data;
        const newDatasets = apiData.flatMap(result => mapGraphData(result, duration));
        const newPriceDetails = apiData.flatMap(result => result.details.prices);
        const underOccupancyData = apiData.flatMap(mapUnderOccupancyData);
        const overOccupancyData = apiData.flatMap(mapOverOccupancyData);
        const boardUpgradeData = apiData.flatMap(mapBoardUpgradeData);
        const ancillaryData = apiData.flatMap(mapOptionalItems);
        const hasOutboundHomeboundFlights = apiData.flatMap(result => result.hasOutboundHomeboundFlights)[0];
        const newFlightCriteria = apiData.flatMap(result => result.selectedFlightCriterias);

        const updatedData = {
          datasets: newDatasets,
          priceDetails: newPriceDetails,
          flightCriteria: newFlightCriteria,
          underOccupancyDetails: underOccupancyData,
          overOccupancyDetails: overOccupancyData,
          boardUpgradeDetails: boardUpgradeData,
          ancillaryDetails: ancillaryData,
          hasOutboundHomeboundFlights
        };
        setState(prevState => ({
          ...prevState,
          ...updatedData
        }));
        messageStateRef.current = { ...messageStateRef.current, ...updatedData };
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

  const getUpdatedPrices = filters => {
    if (hasOutboundHomeboundFlights) {
      getUpdatedPricesForAll(filters);
    } else {
      getPricesForSingleRoomType(mapPayloadForPriceDetails(overviewData, filters));
    }
  };

  const {
    loading,
    datasets,
    priceDetails,
    overviewData,
    flightCriteria,
    overOccupancyDetails,
    underOccupancyDetails,
    boardUpgradeDetails,
    ancillaryDetails,
    disconnected,
    hasOutboundHomeboundFlights
  } = state;

  return (
    <div>
      <Spinner loading={loading} />
      {disconnected && <DisconnectedBar>Disconnected from overview</DisconnectedBar>}
      <PackagePriceDetails
        datasets={datasets}
        onDatasetUpdate={updateDataset}
        priceDetails={priceDetails}
        flightCriteria={flightCriteria}
        underOccupancyDetails={underOccupancyDetails}
        overOccupancyDetails={overOccupancyDetails}
        boardUpgradeDetails={boardUpgradeDetails}
        ancillaryDetails={ancillaryDetails}
        overviewData={overviewData}
        hasOutboundHomeboundFlights={hasOutboundHomeboundFlights}
        getUpdatedPrices={getUpdatedPrices}
        hasChanges={changes}
        onResetChanges={resetChanges}
        saveSellingPrice={saveSellingPrice}
      />
    </div>
  );
}
const DisconnectedBar = styled.div`
  background-color: ${colours.red};
  color: white;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const mapGraphData = (data, duration) => {
  return data.chartData?.datasets?.map(dataset => ({
    key: uuidv4(),
    id: `${data.sourceMarketId}_${data.roomTypeId}`,
    label: dataset.label,
    data: dataset.data,
    selected: true,
    metadata: {
      accommodationName: dataset.accommodationName,
      roomType: dataset.roomType,
      classification: dataset.classification,
      duration: duration,
      ageCategoryType: dataset.ageCategoryType,
      accommodationId: data.accommodationId,
      roomTypeId: data.roomTypeId,
      sourceMarketId: data.sourceMarketId,
      sourceMarketName: data.sourceMarketName
    }
  }));
};

const mapUnderOccupancyData = data => {
  const underOccupancy = data.details.underOccupancy;
  if (!underOccupancy) return [];

  return data.details.underOccupancy.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    bedNumber: x.bedNumber,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    baseCost: x.baseCost,
    underOccupancyCost: x.underOccupancyCost,
    discount: x.discount,
    supplement: x.supplement,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    price: x.price,
    totalPrice: x.totalPrice,
    standardPrice: x.standardPrice,
    tooltips: x.tooltips
  }));
};

const mapOverOccupancyData = data => {
  const overOccupancy = data.details.overOccupancy;
  if (!overOccupancy) return [];

  return data.details.overOccupancy.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    roomCost: x.roomCost,
    overOccupancyCost: x.overOccupancyCost,
    difference: x.difference,
    discount: x.discount,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    reduction: x.reduction,
    price: x.price,
    standardPrice: x.standardPrice,
    tooltips: x.tooltips,
    overOccupancyToolTips: x.overOccupancyToolTips
  }));
};

const mapBoardUpgradeData = data => {
  const boardUpgrade = data.details.boardUpgrade;
  if (!boardUpgrade) return [];

  return boardUpgrade.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    sourceMarketId: data.sourceMarketId,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageCategory: x.ageCategory,
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    board: x.board,
    supplementId: x.supplementId,
    boardUpgradeCost: x.boardUpgradeCost,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    calcPrice: x.calcPrice,
    sellingPrice: x.sellingPrice,
    discount: x.discount
  }));
};

const mapOptionalItems = data => {
  const optionalItems = data.details.ancillaries;
  if (!optionalItems) return [];

  return optionalItems.map(x => ({
    key: `${data.sourceMarketId}_${data.roomTypeId}`,
    name: x.name,
    roomTypeId: data.roomTypeId,
    sourceMarketName: data.sourceMarketName,
    accommodationName: data.accommodationName,
    roomCode: data.roomCode,
    roomCategoryName: data.roomCategoryName,
    roomDescription: data.roomDescription,
    rate: x.rate,
    from: new Date(x.from),
    to: new Date(x.to),
    ageFrom: x.ageFrom,
    ageTo: x.ageTo,
    childNumber: x.childNumber,
    bedNumber: x.bedNumber,
    ancillaryCost: x.ancillaryCost,
    margin: x.margin,
    distributionCost: x.distributionCost,
    vat: x.vat,
    price: x.price
  }));
};
