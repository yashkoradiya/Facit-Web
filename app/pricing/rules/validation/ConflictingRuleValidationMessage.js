import React from 'react';
import { Flexbox } from '../../../components/styled/Layout';
import { getDateFormat } from 'helpers/dateHelper';
import moment from 'moment';
import { Link } from 'react-router-dom';

const getDateString = ({ from, to }) =>
  `${moment(from).format(getDateFormat())} - ${moment(to).format(getDateFormat())}`;

export default function ConflictingRuleValidationMessage({ validationResponse }) {
  return (
    <Flexbox direction="column" alignItems="flex-start" style={{ margin: '24px', fontStyle: 'italic' }}>
      <Link></Link>
      <Link
        onClick={e => {
          e.stopPropagation();
        }}
        to={`/pricing/rules/templates/edit/${validationResponse.conflictingRuleId}`}
        target="_blank"
      >
        {validationResponse.conflictingRuleName}

      </Link>



      { validationResponse.conflictingRuleProperties['datePeriod'] != null ?
        <div>Conflicting date period:{getDateString(validationResponse.conflictingRuleProperties['datePeriod'][0])}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['sourceMarket'] != null ?

        <div>Conflicting source market: {validationResponse.conflictingRuleProperties['sourceMarket']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['costLabel'] != null ?

        <div>Conflicting cost Label: {validationResponse.conflictingRuleProperties['costLabel']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['flightMargin'] != null ?

        <div>Conflicting margin: {validationResponse.conflictingRuleProperties['flightMargin']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['direction'] != null ?

        <div>Conflicting direction: {validationResponse.conflictingRuleProperties['direction']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['season'] != null ?

        <div>Conflicting planning period: {validationResponse.conflictingRuleProperties['season']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['country'] != null ?

        <div>Conflicting country: {validationResponse.conflictingRuleProperties['country']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['destination'] != null ?

        <div>Conflicting destination: {validationResponse.conflictingRuleProperties['destination']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['resort'] != null ?

        <div>Conflicting resort: {validationResponse.conflictingRuleProperties['resort']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['concept'] != null ?

        <div>Conflicting concept: {validationResponse.conflictingRuleProperties['concept']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['classification'] != null ?

        <div>Conflicting classification: {validationResponse.conflictingRuleProperties['classification']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['accommodationcode'] != null ?

        <div>Conflicting accommodation: {validationResponse.conflictingRuleProperties['accommodationcode']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['contracttype'] != null ?

         <div>Conflicting contracttype: {validationResponse.conflictingRuleProperties['contracttype']}</div> : <div></div>}   

      { validationResponse.conflictingRuleProperties['roomtypecategory'] != null ?

        <div>Conflicting room type category: {validationResponse.conflictingRuleProperties['roomtypecategory']}</div> : <div></div>}

      { validationResponse.conflictingRuleProperties['roomtypecode'] != null ?

        <div>Conflicting room type code: {validationResponse.conflictingRuleProperties['roomtypecode']}</div> : <div></div>}
    </Flexbox>
  );
}
