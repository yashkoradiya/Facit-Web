import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Gridbox,
  StickyResponsiveTableHeader,
  ResponsiveTableCell,
  Flexbox,
  PositionedToolTip,
  PositionedTableCell
} from '../../components/styled/Layout';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import InputCheckbox from '../../components/FormFields/InputCheckbox';
import * as actions from './PublishStatus/actions';
import ReviewPricesFooter from './ReviewPricesFooter';
import { v4 as uuidv4 } from 'uuid';
import { getLastPublishedByProduct } from 'packaging/packaging-utils';

class ReviewPrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccommodations: [],
      saveSuccess: false,
      publishing: false,
      errors: 0
    };
  }

  componentDidMount() {
    const { reviewData } = this.props;
    const selectedAccommodations = reviewData.map(m => {
      return { key: m.key, checked: true };
    });

    this.setState({ selectedAccommodations });
  }

  handleCheckboxChanged = key => {
    const { selectedAccommodations } = this.state;
    const target = selectedAccommodations.find(x => x.key === key);
    target.checked = !target.checked;
    this.setState({ selectedAccommodations, saveSuccess: false });
  };

  evaluateReviewDataCheckedStatus = () => {
    const { selectedAccommodations } = this.state;
    if (selectedAccommodations.every(x => x.checked)) return 'checked';
    if (selectedAccommodations.some(x => x.checked)) return 'indeterminate';
    return 'unchecked';
  };

  handleIndeterminateChange = checked => {
    const { selectedAccommodations } = this.state;
    this.setState({
      selectedAccommodations: selectedAccommodations.map(x => ({
        ...x,
        checked: checked !== 'checked'
      })),
      saveSuccess: false
    });
  };

  handlePublishPrices = () => {
    const { selectedAccommodations } = this.state;
    const { reviewData } = this.props;
    const selectedAccommodationIds = selectedAccommodations.filter(a => a.checked).map(m => m.key);

    const jobData = reviewData.filter(x => selectedAccommodationIds.some(y => y === x.key));
    const promises = jobData.map(x => {
      return this.props.onPublishPrices({
        id: x.id,
        sourceMarketId: x.sourceMarketId,
        productType: x.productType
      });
    });

    Promise.all(promises).then(results => {
      const published = results.map(({ data }) => {
        const foundItem = jobData.find(x => x.id === data.id && x.sourceMarketId === data.sourceMarket);
        return {
          ...foundItem,
          approvalId: data.approvalId
        };
      });
      this.props.monitorPublishJob(uuidv4(), this.props.jobType, published);
    });

    this.props.onClose();
  };

  getCellValue = cell => {
    if (typeof cell.value === 'object') {
      return getLastPublishedByProduct(cell.value.publishStatus, this.props.productType, cell.value.productType);
    } else {
      return <p>{cell.value}</p>;
    }
  };

  render() {
    const { onClose } = this.props;
    const { selectedAccommodations, saveSuccess, publishing, errors } = this.state;

    return (
      <Flexbox direction="column" width="100%" alignItems="flex-start">
        <Gridbox
          style={{
            width: '100%',
            marginBottom: '5px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          columnDefinition={'35px 120px auto auto 65px 90px 160px'}
          border
        >
          <StickyResponsiveTableHeader>
            <IndeterminateCheckbox
              onChange={this.handleIndeterminateChange}
              checked={this.evaluateReviewDataCheckedStatus()}
            />
          </StickyResponsiveTableHeader>
          {this.props.headerColumnDefinition.map((columnDefinition, index) => {
            return <StickyResponsiveTableHeader key={index}>{columnDefinition}</StickyResponsiveTableHeader>;
          })}
          {selectedAccommodations.length > 0 &&
            this.props.bodyColumnValues &&
            this.props.bodyColumnValues.map((x, index) => {
              const checked = selectedAccommodations.find(sa => sa.key === x[0].value).checked;

              return (
                <React.Fragment key={x[0].value}>
                  <ResponsiveTableCell>
                    <InputCheckbox onChange={() => this.handleCheckboxChanged(x[0].value)} checked={checked} />
                  </ResponsiveTableCell>
                  {x.slice(1).map((cell, innerIndex) => {
                    return (
                      <PositionedTableCell key={`${index}-${innerIndex}`} hasTooltip={cell.hasTooltip}>
                        {this.getCellValue(cell)}
                        {cell.hasTooltip && <PositionedToolTip top="-35%">{cell.tooltipData}</PositionedToolTip>}
                      </PositionedTableCell>
                    );
                  })}
                </React.Fragment>
              );
            })}
        </Gridbox>
        <p style={{ marginTop: '0px' }}>{`${selectedAccommodations.filter(a => a.checked).length} selected`}</p>
        <ReviewPricesFooter
          saveSuccess={saveSuccess}
          publishing={publishing}
          errors={errors}
          onPublishPrices={this.handlePublishPrices}
          onClose={onClose}
        />
      </Flexbox>
    );
  }
}

const mapStateToProps = state => {
  return {
    publishStatus: state.packagePublishStatus.publishStatus
  };
};

function mapDispatchToProps(dispatch) {
  return {
    monitorPublishJob: (jobId, jobType, jobData) => {
      dispatch(actions.monitorPublishJob(jobId, jobType, jobData));
    }
  };
}

ReviewPrices.propTypes = {
  reviewData: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onPublishPrices: PropTypes.func.isRequired,
  onPublished: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPrices);
