import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getRejectedProducts,
  getChangedOfferings,
  getUnpublishedAccommodations,
  getNonContractedDiscounts
} from '../api';
import {
  INBOX_FAILED_IMPORTS,
  INBOX_NEW_ACCOMMODATIONS,
  INBOX_NONCONTRACTED_DISCOUNTS,
  INBOX_UNPUBLISHED_CHANGES
} from 'inbox/InboxConstants';

/**
 * UseStatusFetch is a custom hook to perform inbox api calls.
 * @param {*} key
 * @param {*} dependencies
 * @returns
 */
export default function useStatusFetch(key, dependencies) {
  const [loading, setLoading] = useState(false);
  const [dataSet, setDataSet] = useState({ data: [] });
  const [pending, setPending] = useState({});
  const counter = useRef(0);

  useEffect(() => {
    if ((key === INBOX_UNPUBLISHED_CHANGES || key === INBOX_NEW_ACCOMMODATIONS) && pending.number === counter.current) {
      setDataSet({ data: pending.data, dataSetKey: uuidv4() });
      setLoading(false);
    }
  }, [pending, key]);

  useEffect(() => {
    setLoading(true);

    switch (key) {
      case INBOX_FAILED_IMPORTS:
        getRejectedProducts(dependencies).then(response => {
          setDataSet({ data: response.data, dataSetKey: uuidv4() });
          setLoading(false);
        });
        break;
      case INBOX_UNPUBLISHED_CHANGES:
        counter.current++;
        getChangedOfferings(dependencies).then(response => {
          setPending({ data: response.data, number: counter.current });
        });
        break;
      case INBOX_NEW_ACCOMMODATIONS:
        counter.current++;
        getUnpublishedAccommodations(dependencies).then(response => {
          setPending({ data: response.data, number: counter.current });
        });
        break;
      case INBOX_NONCONTRACTED_DISCOUNTS:
        getNonContractedDiscounts(dependencies).then(response => {
          setDataSet({ data: response.data, dataSetKey: uuidv4() });
          setLoading(false);
        });
        break;

      default:
        setLoading(false);
    }
  }, [dependencies, key]);

  return {
    loading,
    dataSet
  };
}
