import React, { useEffect, useState } from 'react';
import ButtonList from 'components/FormFields/ButtonList';
import { getDurationGroups } from 'settings/PreDefinedRules/api';
import styled from 'styled-components';
import { colours } from 'components/styled/defaults';

export default function PreDefinedDurationGroupPicker({ onClick }) {
  const [durationGroups, setDurationGroups] = useState([]);

  useEffect(() => {
    getDurationGroups().then(response => {
      setDurationGroups(response.data);
    });
  }, []);

  return (
    <ButtonList title="Get pre-defined Duration Groups" style={{ marginBottom: '10px' }}>
      {durationGroups.map(d => (
        <StyledButton onClick={() => onClick(d)} key={d.id}>
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
