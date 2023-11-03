import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReviewPrices from '../../components/ReviewPrices';
import ModalBase from '../../../components/ModalBase';
import { PrimaryButton} from 'components/styled/Button';
import * as api from './api';
import { getDateFormat } from '../../../helpers/dateHelper';
import { getProductTypeCount, getProductTypeTooltip, getProductTypeValues } from 'packaging/packaging-utils';

class ReviewCharterPackagePrices extends Component {
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
      return [
        ...acc,
        { id: item.id, sourceMarketId: item.sourceMarketId, productType: getProductTypeValues(this.props.productType) }
      ];
    }, []);

    api.getReview(distinctAccommodationIds).then(response => {
      const reviewData = response.data.map(item => {
        const accommodation = allRows.find(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId);
        const { lastPublishedAO, lastPublishedFS } = item.lastPublished || {};

        return {
          key: `${accommodation.id}_${accommodation.sourceMarketId}`,
          id: accommodation.id,
          accommodationName: accommodation.accommodationName,
          sourceReferenceCode: accommodation.sourceReferenceCode,
          sourceMarketId: accommodation.sourceMarketId,
          sourceMarketName: accommodation.sourceMarket,
          productType: item.productType,
          roomTypes: item.roomTypes,
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

      const selectedAccommodations = reviewData.map(m => {
        return { key: m.key, checked: true };
      });

      this.setState({ reviewData, selectedAccommodations });
    });
  }

  sortAccommodations = () => {
    const { reviewData, currentSortOrder } = this.state;

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
        {
          value: getProductTypeCount(productType, columnItem.productType),
          hasTooltip: true,
          tooltipData: getProductTypeTooltip(productType, columnItem.productType, columnItem.key)
        },
        { value: { productType: columnItem.productType, publishStatus: columnItem.publishStatus }, hasTooltip: false }
      ];
    });
    return (
      <ModalBase
        show={this.props.showModal}
        onRequestClose={this.props.onClose}
        width={'800px'}
        title={'Review and publish'}
      >
        {reviewData && (
          <>
            
            <PrimaryButton onClick={this.sortAccommodations} style={{ marginRight: '15px' }}>
              Sort Accommodations A-Z
            </PrimaryButton>
            <ReviewPrices
              onClose={this.props.onClose}
              reviewData={reviewData}
              onPublishPrices={api.publishPrices}
              onPublished={this.props.onPublished}
              headerColumnDefinition={[
                'Source market',
                'Accommodation',
                'Contr. acc. code',
                'Room types',
                'Product Type',
                'Last published'
              ]}
              bodyColumnValues={columnValues}
              jobType="charter_package"
              productType={this.props.productType}
            />
          </>
        )}
      </ModalBase>
    );
  }
}

ReviewCharterPackagePrices.propTypes = {
  allRows: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  onPublished: PropTypes.func
};

export default ReviewCharterPackagePrices;
