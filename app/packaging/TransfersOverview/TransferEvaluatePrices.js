import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Gridbox,
  StickyResponsiveTableHeader,
  ResponsiveTableCell,
  Flexbox,
  PositionedTableCell,
  PositionedToolTip
} from '../../components/styled/Layout';
import IndeterminateCheckbox from '../components/IndeterminateCheckbox';
import InputCheckbox from '../../components/FormFields/InputCheckbox';
import * as actions from '../components/PublishStatus/actions';
import EvaluatePricesFooter from 'packaging/components/EvaluatePricesFooter';
import { v4 as uuidv4 } from 'uuid';
import { getLastEvaluateByProduct } from 'packaging/packaging-utils';



class TransferEvaluatePrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTransfers: [],
      saveSuccess: false,
      publishing: false,
      errors: 0
    };
  }

  componentDidMount() {
    const { reviewData } = this.props;
    const selectedTransfers = reviewData.map(m => {
      return { key: m.key, checked: true };
    });

    this.setState({ selectedTransfers });
  }

  handleCheckboxChanged = key => {
    const { selectedTransfers } = this.state;
    const target = selectedTransfers.find(x => x.key === key);
    target.checked = !target.checked;
    this.setState({ selectedTransfers, saveSuccess: false });
  };

  evaluateReviewDataCheckedStatus = () => {
    const { selectedTransfers } = this.state;
    if (selectedTransfers.every(x => x.checked)) return 'checked';
    if (selectedTransfers.some(x => x.checked)) return 'indeterminate';
    return 'unchecked';
  };

  handleIndeterminateChange = checked => {
    const { selectedTransfers } = this.state;
    this.setState({
      selectedTransfers: selectedTransfers.map(x => ({
        ...x,
        checked: checked !== 'checked'
      })),
      saveSuccess: false
    });
  };

  handleEvaluatePrices = () => {
    const { selectedTransfers } = this.state;
    const { reviewData } = this.props;
    const selectedTransferIds = selectedTransfers.filter(a => a.checked).map(m => m.key);
    const jobData = reviewData.filter(x => selectedTransferIds.some(y => y === x.key));
    const promises = jobData.map(x => {
      return this.props.onEvaluatePrices({
        id: x.id,
        sourceMarketId: x.sourceMarketId,
        productType: x.productType
      });
    });

    
    Promise.all(promises).then(results => {
      const published = results.map(({ data }) => {
        const foundItem = jobData.find(x => x.id == data.id && x.sourceMarketId === data.sourceMarket);

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
       return getLastEvaluateByProduct(cell.value.evaluateStatus, this.props.productType, cell.value.productType);
     } else {
       return <p>{cell.value}</p>;
     }
   };

  render() {
    const { onClose } = this.props;
    const { selectedTransfers, saveSuccess, errors, publishing } = this.state;

    return (
      <Flexbox direction="column" width="100%" alignItems="flex-start">
        <Gridbox
          style={{
            width: '100%',
            marginBottom: '5px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
          columnDefinition={'35px auto  auto 70px 100px auto auto 90px auto 160px'}
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
          {selectedTransfers.length > 0 &&
            this.props.bodyColumnValues &&
            this.props.bodyColumnValues.map((x, index) => {
              const checked = selectedTransfers.find(sa => sa.key === x[0].value).checked;

              return (
                <React.Fragment key={x[0].value}>
                  <ResponsiveTableCell>
                    <InputCheckbox onChange={() => this.handleCheckboxChanged(x[0].value)} checked={checked} />
                  </ResponsiveTableCell>
                  {x.slice(2).map((cell, innerIndex) => {
                    return (
                      <PositionedTableCell key={`${index}-${innerIndex}`}>
                        {this.getCellValue(cell)}
                        {cell.hasTooltip && <PositionedToolTip>{cell.tooltipData}</PositionedToolTip>}
                      </PositionedTableCell>
                    );
                  })}
                </React.Fragment>
              );
            })}
        </Gridbox>
        <p style={{ marginTop: '0px' }}>{`${selectedTransfers.filter(a => a.checked).length} selected`}</p>
        <EvaluatePricesFooter
          saveSuccess={saveSuccess}
          publishing={publishing}
          errors={errors}
          onEvaluatePrices={this.handleEvaluatePrices}
          onClose={onClose}
        />
      </Flexbox>
    );
  }
}

const mapStateToProps = state => {
  return {
    evaluateStatus: state.packagePublishStatus.evaluateStatus
  };
};

function mapDispatchToProps(dispatch) {
  return {
    monitorPublishJob: (jobId, jobType, jobData) => {
      dispatch(actions.monitorPublishJob(jobId, jobType, jobData));
    }
  };
}

TransferEvaluatePrices.propTypes = {
  reviewData: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onEvaluatePrices: PropTypes.func.isRequired,
  onEvaluated: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferEvaluatePrices);
