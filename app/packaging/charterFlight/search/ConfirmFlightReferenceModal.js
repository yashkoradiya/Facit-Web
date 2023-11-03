import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ModalBase from '../../../components/ModalBase';
import { PrimaryButton, Button } from '../../../components/styled/Button';
import { Flexbox } from '../../../components/styled/Layout';
import { ContextMoneyLabel } from '../../../components/MoneyLabels';

const StyledButtonWrapper = styled(Flexbox)`
  align-self: flex-end;
  margin-top: auto;
`;

const StyledContainer = styled(Flexbox)`
  height: 100%;
  font-family: 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 12px;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const BoldParagraph = styled.p`
  font-weight: bold;
`;

class ConfirmFlightReferenceModal extends Component {
  render() {
    const { show, onRequestClose, onConfirm, data } = this.props;

    const newReferenceFlightName = (
      <React.Fragment>
        to <Bold>{`${data.departureAirport}-${data.arrivalAirport} ${data.weekday}`}</Bold>
      </React.Fragment>
    );
    return (
      <ModalBase
        show={show}
        onRequestClose={onRequestClose}
        width="700px"
        title={'Confirm change of reference flight ' + (data.isReferenceFlight ? 'cost base' : '')}
      >
        <StyledContainer direction="column" alignItems="flex-start">
          <p>
            Changing the reference flight {data.isReferenceFlight ? 'cost base' : newReferenceFlightName} will have the
            following effects:
          </p>
          <p>
            Previous flight cost: <ContextMoneyLabel values={data.oldReferenceFlightCost.values} showCurrency />
            <br />
            New flight cost: <ContextMoneyLabel values={data.newReferenceFlightCost.values} showCurrency />
            <br />
            Increase/Decrease of:{' '}
            <Bold>
              <ContextMoneyLabel values={data.flightCostDifference.values} showCurrency />
            </Bold>
          </p>
          <p>
            The reference cost of <Bold>{data.associatedFlightCount}</Bold> flights will be affected.
          </p>
          <BoldParagraph>
            Confirming the change of reference flight {data.isReferenceFlight && 'cost base'} will even update package
            prices and flight supplements.
          </BoldParagraph>
          <StyledButtonWrapper childrenMarginRight="10px" justifyContent="flex-end">
            <PrimaryButton onClick={() => onConfirm(data)}>Confirm</PrimaryButton>
            <Button onClick={onRequestClose}>Cancel</Button>
          </StyledButtonWrapper>
        </StyledContainer>
      </ModalBase>
    );
  }
}

ConfirmFlightReferenceModal.propTypes = {
  show: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onConfirm: PropTypes.func,
  data: PropTypes.object
};

export default ConfirmFlightReferenceModal;
