import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EvaluatePrices from '../../components/EvaluatePrices';
import ModalBase from '../../../components/ModalBase';
import { PrimaryButton } from 'components/styled/Button';
import * as api from './api';
import { getDateFormat } from '../../../helpers/dateHelper';
import { getProductTypeCount, getProductTypeTooltip, getProductTypeValues } from 'packaging/packaging-utils';

class EvaluateCharterPackagePrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: null,
      currentSortOrder: 'asc'
    };
  }

  componentDidMount() {
    const { allRows } = this.props;
    const distinctAccommodationIds = allRows.reduce((acc, item) => {
      if (acc.some(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId)) return acc;
      return [...acc, { id: item.id, sourceMarketId: item.sourceMarketId, productType: getProductTypeValues(this.props.productType) }];
    }, []);

    api.getEvaluateReview(distinctAccommodationIds).then(response => {
      const reviewData = response.data.map(item => {
        const accommodation = allRows.find(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId);
        return {
          key: `${accommodation.id}_${accommodation.sourceMarketId}`,
          id: accommodation.id,
          accommodationName: accommodation.accommodationName,
          sourceReferenceCode: accommodation.sourceReferenceCode,
          sourceMarketId: accommodation.sourceMarketId,
          sourceMarketName: accommodation.sourceMarket,
          roomTypes: item.roomTypes,
          status: item.lastEvaluated
            ? moment(item.lastEvaluated)
              .utcOffset(4, true)
              .format(getDateFormat(3))
            : 'Not evaluated',
          productType: item.productType
        };
      });

      const selectedAccommodations = reviewData.map(m => {
        return { key: m.key, checked: true };
      });

      this.setState({ reviewData, selectedAccommodations });
    });
  }

  sortAccommodations = () => {
    const { reviewData, currentSortOrder } = this.state;

    // Sort accommodations alphabetically by accommodation name
    let sortedReviewData = reviewData.sort((a, b) => a.accommodationName.localeCompare(b.accommodationName));

    if (currentSortOrder === 'desc') {
      sortedReviewData = sortedReviewData.reverse();
      this.setState({ reviewData: sortedReviewData, currentSortOrder: 'asc' });
    } else {
      this.setState({ reviewData: sortedReviewData, currentSortOrder: 'desc' });
    }
  };

  render() {
    const { reviewData } = this.state;
    const { productType } = this.props;
    if (!reviewData) return null;
    let columnValues = reviewData.map(columnItem => {
      return [
        { value: columnItem.key, hasTooltip: false },
        { value: columnItem.sourceMarketName, hasTooltip: false },
        { value: columnItem.accommodationName, hasTooltip: false },
        { value: columnItem.sourceReferenceCode, hasTooltip: false },
        {
          value: columnItem.roomTypes.length,
          hasTooltip: true,
          tooltipData: columnItem.roomTypes.map(rt => {
            return <div key={`rt_${rt}_${columnItem.key}`}>{rt}</div>;
          })
        },
        { value: columnItem.status, hasTooltip: false },
        {
          value: getProductTypeCount(productType, columnItem.productType),
          hasTooltip: true,
          tooltipData: getProductTypeTooltip(productType, columnItem.productType, columnItem.key),
        }
      ];
    });

    return (
      <ModalBase
        show={this.props.showModal}
        onRequestClose={this.props.onClose}
        width={'700px'}
        title={'REVIEW AND EVALUATE'}
      >
        {reviewData && (
          <>
          <PrimaryButton onClick={this.sortAccommodations}>
              Sort Accommodations A-Z
            </PrimaryButton>
          <EvaluatePrices
            onClose={this.props.onClose}
            reviewData={reviewData}
            onEvaluatePrices={api.evaluatePrice}
            onPublished={this.props.onPublished}
            headerColumnDefinition={[
              'Source market',
              'Accommodation',
              'Contr. acc. code',
              'Room types',
              'Last Evaluated',
              'Product Type'
            ]}
            bodyColumnValues={columnValues}
            jobType="evaluate_charter_package"
            productType={this.props.productType}
          />
          </>
        )}
      </ModalBase>
    );
  }
}

EvaluateCharterPackagePrices.propTypes = {
  allRows: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  onPublished: PropTypes.func
};

export default EvaluateCharterPackagePrices;
