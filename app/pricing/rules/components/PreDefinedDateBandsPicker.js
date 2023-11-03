import React, { useEffect, useState } from 'react';
import ButtonList from 'components/FormFields/ButtonList';
import * as preDefinedRulesApi from 'settings/PreDefinedRules/api';
import styled from 'styled-components';
import { colours } from 'components/styled/defaults';

export default function PreDefinedDateBandPicker({ selectedSeasonIds, onClick, style }) {
  const [dateBands, setDateBands] = useState([]);

  useEffect(() => {
    const _selectedSeasonIds = selectedSeasonIds ? selectedSeasonIds.toJS() : [];
    preDefinedRulesApi.getDateBands().then(response => {
      setDateBands(
        response.data.filter(x => _selectedSeasonIds?.length === 0 || _selectedSeasonIds.includes(x.seasonId))
      );
    });
  }, [selectedSeasonIds]);

  return (
    <ButtonList title="Get pre-defined Date Bands" style={style}>
      {dateBands.map(d => (
        <StyledButton onClick={() => onClick(d.dateBands, d.id)} key={d.id}>
          {d.name}
        </StyledButton>
      ))}
    </ButtonList>
  );
}

const StyledButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: left;
  padding-left: 20px;
  width: 100%;
  height: 30px;
  font-size: 14px;
  &:hover {
    background-color: ${colours.tuiBlue200};
  }
`;
