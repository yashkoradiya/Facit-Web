import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReviewPrices from '../../components/ReviewPrices';
import ModalBase from 'components/ModalBase';
import { getDateFormat } from 'helpers/dateHelper';
import * as api from './api';
import moment from 'moment';

class ReviewAOPrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: null
    };
  }

  componentDidMount() {
    const { allRows } = this.props;

    const distinctAccommodationIds = allRows.reduce((acc, item) => {
      if (acc.some(x => x.id === item.id && x.sourceMarketId === item.sourceMarketId)) return acc;
      return [...acc, { id: item.id, sourceMarketId: item.sourceMarketId }];
    }, []);

    api.getReview(distinctAccommodationIds).then(response => {
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
          status: accommodation.lastPublished
            ? moment(accommodation.lastPublished)
                .utcOffset(4, true)
                .format(getDateFormat(3))
            : 'Not published'
        };
      });

      const selectedAccommodations = reviewData.map(m => {
        return { key: m.key, checked: true };
      });

      this.setState({ reviewData, selectedAccommodations });
    });
  }

  handlePublishStatusChanged = reviewData => {
    this.setState({ reviewData });
  };

  render() {
    const { reviewData } = this.state;
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
        { value: columnItem.status, hasTooltip: false }
      ];
    });
    return (
      <ModalBase
        show={this.props.showModal}
        onRequestClose={this.props.onClose}
        width={'700px'}
        title={'Review and publish'}
      >
        {reviewData && (
          <ReviewPrices
            onClose={this.props.onClose}
            reviewData={reviewData}
            onPublishStatusChanged={this.handlePublishStatusChanged}
            onPublishPrices={api.publishPrices}
            onPublished={this.props.onPublished}
            headerColumnDefinition={[
              'Source market',
              'Accommodation',
              'Contr. acc. code',
              'Room types',
              'Last published'
            ]}
            bodyColumnValues={columnValues}
            jobType="accommodation_only"
          />
        )}
      </ModalBase>
    );
  }
}

ReviewAOPrices.propTypes = {
  allRows: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  onPublished: PropTypes.func
};

export default ReviewAOPrices;
