import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import {
  getAccommodationCostDetails,
  getAccommodationRoomTypeBaseCosts,
  getAccommodationRoomTypeOccupancy,
  updateAverageUnderOccupancy,
  updateCostPhasingOverride,
  updateBaseRooms,
  getAccommodationUnderOccupancyCosts,
  getAccommodationOverOccupancyCosts,
  getAllotmentData,
  getAccommodationChildCosts,
  getMandatorySupplements,
  getAncillaries,
  getBoardUpgrade,
  getDiscounts,
  getContractVersions,
  getComments,
  updateComment,
  addComment,
  deleteComment,
  updateCalculationMethod
} from '../api';
import AccommodationRoomTypeCostsGrid from '../AccommodationRoomTypeCostsGrid';
import AdditionalCostsGrid from '../AdditionalCostsGrid';
import AccommodationCostSummary from '../AccommodationCostSummary';
import AccommodationCostGraph from '../AccommodationCostGraph';
import { AverageUnderOccupancyModal } from '../modals/AverageUnderOccupancyModal';
import { CostPhasingModal } from '../modals/CostPhasingModal';
import FilterRoomTypes from '../FilterRoomTypes';
import { Flexbox } from 'components/styled/Layout';
import { Stars } from 'components/styled/Graphics';
import { CalculationMethodModal } from '../modals/CalculationMethodModal';
import Spinner from 'components/Spinner';

class AccommodationCostDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      definitionId: props.match.params.definitionId,
      accommodationData: null,
      calculatedCosts: null,
      baseCosts: [],
      occupancyData: [],
      underOccupancyData: [],
      overOccupancyData: [],
      childCostData: [],
      mandatorySupplementData: [],
      ancillaryData: [],
      boardUpgradeData: [],
      discountData: [],
      allotmentData: [],
      contractVersionData: [],
      commentData: [],
      showAverageUnderOccupancyModal: false,
      showCostPhasingModal: false,
      showCalculationMethodModal: false,
      roomTypes: [],
      selectedRoomTypeCodes: List(),
      // isSavingDiscounts: false,
      loading: true
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getAccommodationCostData();
  }

  getAccommodationCostData = () => {
    const { id, definitionId } = this.state;

    this.setState({
      loading: true
    });

    const apiCalls = [
      getAccommodationRoomTypeBaseCosts(id, definitionId),
      getAccommodationCostDetails(id, definitionId),
      getAccommodationRoomTypeOccupancy(id, definitionId),
      getAccommodationUnderOccupancyCosts(id, definitionId),
      getAccommodationOverOccupancyCosts(id, definitionId),
      getAccommodationChildCosts(id, definitionId),
      getAllotmentData(id, definitionId),
      getMandatorySupplements(id, definitionId),
      getAncillaries(id, definitionId),
      getBoardUpgrade(id, definitionId),
      getDiscounts(id, definitionId),
      getContractVersions(id),
      getComments(id)
    ];

    Promise.all(apiCalls).then(response => {
      this.setState({
        baseCosts: response[0].data,
        roomTypes: this.getUniqueRoomTypes(response[0].data),
        accommodationData: response[1].data.details,
        calculatedCosts: response[1].data.calculatedCosts,
        occupancyData: response[2].data,
        underOccupancyData: response[3].data,
        overOccupancyData: response[4].data,
        childCostData: response[5].data,
        allotmentData: response[6].data,
        mandatorySupplementData: response[7].data,
        ancillaryData: response[8].data,
        boardUpgradeData: response[9].data,
        discountData: response[10].data,
        contractVersionData: response[11].data,
        commentData: response[12].data,
        displayCurrency: this.props.selectedCurrency,
        loading: false
      });
    });
  };

  updateAccommodationComments = data => {
    const input = {
      commentId: data.id,
      comment: data.comment,
      status: data.status
    };

    updateComment(this.state.id, input).then(() => this.refreshComments());
  };

  deleteAccommodationComments = commentId => {
    deleteComment(this.state.id, commentId).then(() => this.refreshComments());
  };

  refreshComments = () =>
    getComments(this.state.id).then(response => {
      this.setState({ commentData: response.data });
    });

  addAccommodationComments = data => {
    const input = {
      comment: data.comment,
      contractVersion: this.state.accommodationData.currentVersion,
      contractDate: this.state.accommodationData.currentVersionDate
    };
    addComment(this.state.id, input).then(() => {
      getComments(this.state.id).then(response => {
        this.setState({ commentData: response.data });
      });
    });
  };

  getUniqueRoomTypes = data => {
    return data
      .map(r => ({ id: r.roomCode, name: `${r.roomCode} ${r.roomName}` }))
      .filter((v, i, a) => a.findIndex(r => r.id === v.id) === i);
  };

  toggleAverageUnderOccupancyModal = isOpen => {
    this.setState({
      showAverageUnderOccupancyModal: isOpen
    });
  };

  handleUpdateAverageUnderOccupancy = value => {
    updateAverageUnderOccupancy(this.state.id, value / 100).then(() => {
      const { accommodationData } = this.state;
      accommodationData.averageUnderOccupancy = value / 100;
      this.setState(
        {
          showAverageUnderOccupancyModal: false,
          accommodationData
        },
        () => this.fetchAccommodationDetails(this.state.id, this.state.definitionId)
      );
    });
  };

  handleUpdateCalculationMethod = setting => {
    updateCalculationMethod(this.state.id, setting).then(() => {
      this.setState(
        {
          showCalculationMethodModal: false,
          accommodationData: {
            ...this.state.accommodationData,
            calculationMethod: setting
          }
        },
        () => this.fetchAccommodationDetails(this.state.id, this.state.definitionId)
      );
    });
  };

  toggleCostPhasingModal = isOpen => {
    this.setState({
      showCostPhasingModal: isOpen
    });
  };

  toggleCalculationMethodModal = isOpen => {
    this.setState({
      showCalculationMethodModal: isOpen
    });
  };

  handleCostPhasingOverride = setting => {
    updateCostPhasingOverride(this.state.id, setting).then(() => {
      this.setState(
        {
          showCostPhasingModal: false
        },
        () => this.fetchAccommodationDetails(this.state.id, this.state.definitionId)
      );
    });
  };

  handleFilterChanged = codes => {
    this.setState({ selectedRoomTypeCodes: codes });
  };

  isLatestVersion = () => {
    if (!this.state.accommodationData || !this.state.accommodationData.contractVersion) return true;
    if (this.state.accommodationData.contractVersion === `${this.state.accommodationData.currentVersion}`) return true;

    return false;
  };

  filterCosts = costs => {
    const { selectedRoomTypeCodes } = this.state;

    if (selectedRoomTypeCodes && selectedRoomTypeCodes.size > 0) {
      return costs.filter(x => selectedRoomTypeCodes.some(c => c === x.roomCode));
    }
    return costs;
  };

  filterDiscounts = discounts => {
    return {
      ...discounts,
      costs: this.filterCosts(discounts.costs)
    };
  };

  fetchAccommodationDetails = (id, definitionId) => {
    getAccommodationCostDetails(id, definitionId).then(response =>
      this.setState({
        accommodationData: response.data.details,
        calculatedCosts: response.data.calculatedCosts
      })
    );
  };

  handleBaseRoomUpdate = async data => {
    await updateBaseRooms(this.state.id, data);
    this.getAccommodationCostData();
  };

  handleDisplayCurrencyChanged = currency => {
    this.setState({ displayCurrency: currency });
  };

  render() {
    const {
      id,
      accommodationData,
      roomTypes,
      selectedRoomTypeCodes,
      calculatedCosts,
      baseCosts,
      mandatorySupplementData,
      ancillaryData,
      boardUpgradeData,
      occupancyData,
      underOccupancyData,
      overOccupancyData,
      childCostData,
      allotmentData,
      discountData,
      contractVersionData,
      commentData,
      showAverageUnderOccupancyModal,
      showCostPhasingModal,
      showCalculationMethodModal,
      displayCurrency,
      loading
    } = this.state;
    const { selectedCurrency, access } = this.props;

    const readOnly = !access.contracts.accommodations.write || !this.isLatestVersion();

    return (
      <div>
        <Spinner loading={loading} />
        {accommodationData && (
          <div>
            <Flexbox justifyContent="space-between">
              <div
                css={`
                  width: 100%;
                  margin-right: 20px;
                `}
              >
                <h1
                  css={`
                    display: flex;
                    justify-content: space-between;
                  `}
                >
                  <div>
                    {accommodationData.name} ({accommodationData.sourceReferenceCode}) - {accommodationData.resortName}{' '}
                    -{accommodationData.destinationName} - {accommodationData.countryName}
                    {!this.isLatestVersion() && (
                      <span style={{ marginLeft: '15px', color: 'red' }}>
                        Version {accommodationData.contractVersion}
                      </span>
                    )}
                  </div>
                  <Flexbox>
                    {accommodationData.concept}
                    <Stars classification={accommodationData.classification} />
                  </Flexbox>
                </h1>
                {calculatedCosts && (
                  <AccommodationCostGraph data={this.filterCosts(calculatedCosts)} currency={displayCurrency} />
                )}
              </div>

              <AccommodationCostSummary
                id={id}
                readOnly={readOnly}
                isLatestVersion={this.isLatestVersion()}
                data={accommodationData}
                selectedCurrency={selectedCurrency}
                displayCurrency={displayCurrency}
                onChangeAverageUnderOccupancy={() => this.toggleAverageUnderOccupancyModal(true)}
                onChangePhasingReference={() => this.toggleCostPhasingModal(true)}
                onChangeCalculationMethod={() => this.toggleCalculationMethodModal(true)}
                onDisplayCurrencyChanged={this.handleDisplayCurrencyChanged}
              />
            </Flexbox>
            <Flexbox justifyContent="flex-end" width="100%">
              <FilterRoomTypes
                roomTypes={roomTypes}
                selectedIds={selectedRoomTypeCodes}
                onChange={this.handleFilterChanged}
              />
            </Flexbox>

            <AccommodationRoomTypeCostsGrid
              costData={this.filterCosts(baseCosts)}
              occupancyData={this.filterCosts(occupancyData)}
              underOccupancyData={this.filterCosts(underOccupancyData)}
              overOccupancyData={this.filterCosts(overOccupancyData)}
              currency={displayCurrency}
              onBaseRoomUpdate={this.handleBaseRoomUpdate}
              readOnly={readOnly}
            />
            <AdditionalCostsGrid
              childCostData={this.filterCosts(childCostData)}
              allotmentData={this.filterCosts(allotmentData)}
              mandatorySupplementData={this.filterCosts(mandatorySupplementData)}
              ancillaryData={this.filterCosts(ancillaryData)}
              boardUpgradeData={this.filterCosts(boardUpgradeData)}
              discountData={this.filterDiscounts(discountData)}
              contractVersionData={contractVersionData}
              commentData={commentData}
              currency={displayCurrency}
              readOnly={readOnly}
              onUpdateComment={this.updateAccommodationComments}
              onDeleteComment={this.deleteAccommodationComments}
              onAddComment={this.addAccommodationComments}
              contractCurrency={accommodationData.contractCurrency}
            />
            <AverageUnderOccupancyModal
              show={showAverageUnderOccupancyModal}
              onClose={() => this.toggleAverageUnderOccupancyModal(false)}
              onSave={this.handleUpdateAverageUnderOccupancy}
              placeholder={accommodationData.averageUnderOccupancy}
            />
            <CalculationMethodModal
              show={showCalculationMethodModal}
              onClose={() => this.toggleCalculationMethodModal(false)}
              onSave={this.handleUpdateCalculationMethod}
              calculationMethodDefault={accommodationData.calculationMethod}
            />
            {showCostPhasingModal && (
              <CostPhasingModal
                show={showCostPhasingModal}
                onClose={() => this.toggleCostPhasingModal(false)}
                onSave={this.handleCostPhasingOverride}
                commitmentLevel={accommodationData.commitmentLevel}
                phasingReferenceName={accommodationData.phasingReference && accommodationData.phasingReference.name}
                phasingOverrideSetting={accommodationData.costPhasingOverrideSetting}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCurrency: state.appState.selectedCurrency,
    access: state.appState.user.access
  };
};

const connected = connect(mapStateToProps)(AccommodationCostDetails);
export default connected;
