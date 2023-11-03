import styled from 'styled-components';
import { colours } from './defaults';

export const StyledLink = styled.span`
  color: ${colours.tuiBlue500};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
