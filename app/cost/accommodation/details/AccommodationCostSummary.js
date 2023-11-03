import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { colours } from '../../../components/styled/defaults';
import { IconButton } from '../../../components/styled/Button';
import { ContextMoneyLabel } from '../../../components/MoneyLabels';
import PercentageLabel from '../../../components/PercentageLabel';
import { getDateFormat } from '../../../helpers/dateHelper';
import CostCurrencyToggle from './components/CostCurrencyToggle';
import { sortKeyDurations } from 'packaging/packaging-utils';

const StyledAccommodationCostSummary = styled.div`
  border: 2px solid ${colours.grey2};
  padding: 20px 0 25px 20px;
  width: 400px;
  min-width: 300px;
`;

const StyledSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 25px;
  margin-bottom: 5px;
`;

const StyledSummaryItemWithLink = styled(StyledSummaryItem)`
  margin-right: 2px;
`;

export default function AccommodationCostSummary({
  id,
  data,
  isLatestVersion,
  onChangeAverageUnderOccupancy,
  onChangePhasingReference,
  onChangeCalculationMethod,
  selectedCurrency,
  displayCurrency,
  onDisplayCurrencyChanged,
  readOnly
}) {
  const phasingOptions = () => {
    if (data.commitmentLevel === 0) {
      return '-';
    } else if (data.phasingReference) {
      return (
        <Link
          className={!data.shouldApplyPhasing ? 'strike-through-link' : ''}
          to={`/pricing/rules/templates/edit/${data.phasingReference.id}`}
        >
          {data.phasingReference.name}
        </Link>
      );
    } else {
      return 'N/A';
    }
  };

  return (
    <StyledAccommodationCostSummary>
      {buildItem('percentage-label', 'Commitment level', data.commitmentLevel)}
      {buildItem('context-money-label', 'Total committed value', data.totalCommittedValue.values, 0, displayCurrency)}
      {buildItem('context-money-label', 'Total contracts value', data.totalContractsValue.values, 0, displayCurrency)}
      {buildItem(
        'context-money-label',
        'Total calculation value',
        data.totalCalculationValueWithoutRisk.values,
        0,
        displayCurrency
      )}
      {buildItem('context-money-label', 'Total risk', data.totalRisk.values, 0, displayCurrency)}
      {buildItem('context-money-label', 'Differential', data.differential.values, 0, displayCurrency)}
      {buildItem('moment', 'Contract period', data.contractStart, data.contractEnd)}

      <StyledSummaryItemWithLink>
        <span>Contract currency</span>
        <span style={{ display: 'flex' }}>
          {data.contractCurrency}
          <CostCurrencyToggle
            selectedCurrency={selectedCurrency}
            contractCurrency={data.contractCurrency}
            onDisplayCurrencyChanged={onDisplayCurrencyChanged}
          />
        </span>
      </StyledSummaryItemWithLink>
      {buildItem('', 'Status', data.contractStatus)}

      <StyledSummaryItemWithLink>
        <span>Risk %</span>
        <span style={{ display: 'flex' }}>
          {data.averageUnderOccupancy && <PercentageLabel value={data.averageUnderOccupancy} />}
          <IconButton
            disabled={readOnly}
            title="Edit"
            width="15px"
            height="15px"
            marginLeft="5px"
            onClick={onChangeAverageUnderOccupancy}
          >
            <Edit fontSize="inherit" />
          </IconButton>
        </span>
      </StyledSummaryItemWithLink>
      <StyledSummaryItemWithLink>
        <span>Phasing reference</span>
        <span style={{ display: 'flex' }}>
          {phasingOptions()}
          <IconButton
            disabled={readOnly || data.commitmentLevel === 0}
            title="Edit"
            width="15px"
            height="15px"
            marginLeft="5px"
            onClick={onChangePhasingReference}
          >
            <Edit fontSize="inherit" />
          </IconButton>
        </span>
      </StyledSummaryItemWithLink>

      {buildItem('context-money-label', 'Average bed night rate', data.averageBedNightRate.values, 2, displayCurrency)}
      {buildItem('', 'Commission Marker', data.commissionMarker ? data.commissionMarker : 'N/A')}
      {buildItem(
        data.isGrossContract ? 'percentage-label' : '',
        'Commission',
        data.isGrossContract ? data.commission : 'N/A'
      )}

      <StyledSummaryItemWithLink>
        <span>Calculation method</span>
        <span style={{ display: 'flex' }}>
          <span>{data.isGrossContract ? data.calculationMethod : '-'}</span>
          <IconButton
            title="Edit"
            width="15px"
            height="15px"
            marginLeft="5px"
            onClick={onChangeCalculationMethod}
            disabled={!data.isGrossContract || readOnly}
          >
            <Edit fontSize="inherit" />
          </IconButton>
        </span>
      </StyledSummaryItemWithLink>
      {!isLatestVersion && (
        <StyledSummaryItem>
          <span style={{ color: 'red' }}>This version</span>
          <span>{data.contractVersion}</span>
        </StyledSummaryItem>
      )}

      {buildItem(
        '',
        'Latest version',
        `(${data.currentVersion}) ${moment(data.currentVersionDate).format(getDateFormat())}`
      )}
      <StyledSummaryItem>
        <span>Prod. config. ID</span>
        <span style={{ width: '100px', wordBreak: 'break-word' }}>{id}</span>
      </StyledSummaryItem>
      {buildItem(
        '',
        'Contract ID',
        data.contractSourceIds.map((item, i) => <div key={item.toString().length + i}>{item}</div>)
      )}

      {buildItem('', 'Key Accom', data.keyAccom ? 'True' : 'False')}

      <StyledSummaryItem>
        <span style={{ marginRight: '25px' }}>Key Duration</span>
        <span style={{ wordBreak: 'break-word' }}>{data.keyDuration ? sortKeyDurations(data.keyDuration) : 'N/A'}</span>
      </StyledSummaryItem>
    </StyledAccommodationCostSummary>
  );
}

function buildItem(type, title, ...data) {
  let content;
  switch (type) {
    case 'percentage-label':
      content = <PercentageLabel value={data[0]} />;
      break;
    case 'context-money-label':
      content = <ContextMoneyLabel values={data[0]} noOfDecimals={data[1]} showCurrency currency={data[2]} />;
      break;
    case 'moment':
      content = (
        <span>
          {moment(data[0]).format(getDateFormat())} - {moment(data[1]).format(getDateFormat())}
        </span>
      );
      break;
    default:
      content = <span>{data[0]}</span>;
  }
  return (
    <StyledSummaryItem>
      <span>{title}</span>
      {content}
    </StyledSummaryItem>
  );
}
