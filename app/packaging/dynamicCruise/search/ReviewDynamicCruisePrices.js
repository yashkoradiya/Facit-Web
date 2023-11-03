import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReviewPrices from '../../components/ReviewPrices';
import ModalBase from 'components/ModalBase';
import * as api from './api';

class ReviewDynamicCruisePrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: null
    };
  }

  componentDidMount() {
    const { allRows } = this.props;

    const reviewData = allRows.reduce((cruises, row) => {
      const cruise = {
        id: row.id,
        sourceMarketId: row.sourceMarketId,
        key: `${row.id}_${row.sourceMarketId}`,
        cruiseName: row.cruiseName,
        sourceMarketName: row.sourceMarketName,
        shipName: row.shipName,
        status: 'Not published'
      };

      const existingCruise = cruises.find(x => x.id === cruise.id);
      if (!existingCruise) {
        cruises.push(cruise);
      } else {
        existingCruise.sourceMarketName += `, ${cruise.sourceMarketName}`;
      }

      return cruises;
    }, []);

    this.setState({ reviewData });
  }

  render() {
    const { reviewData } = this.state;
    if (!reviewData) return null;
    let columnValues = reviewData.map(columnItem => {
      return [
        { value: columnItem.key, hasTooltip: false },
        { value: columnItem.id, hasTooltip: false },
        { value: columnItem.sourceMarketName, hasTooltip: false },
        { value: columnItem.cruiseName, hasTooltip: false },
        { value: columnItem.shipName, hasTooltip: false },
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
            onPublishPrices={api.publishPrices}
            onPublished={this.props.onPublished}
            headerColumnDefinition={['Id', 'Source market', 'Cruise', 'Ship name', 'Status']}
            bodyColumnValues={columnValues}
            jobType="dynamic_cruise"
          />
        )}
      </ModalBase>
    );
  }
}

ReviewDynamicCruisePrices.propTypes = {
  allRows: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default ReviewDynamicCruisePrices;
