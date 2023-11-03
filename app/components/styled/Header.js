import styled from 'styled-components';
import { colours } from './defaults';

export const SubMenuBar = styled.div`
  display: ${props => (props.isActive ? 'flex' : 'none')};
  position: absolute;
  height: 34px;
  top: 40px;
  left: ${props => (props.position === 'right' ? null : '0px')};
  right: ${props => (props.position === 'right' ? '10px' : null)};
  width: 100%;
  background-color: ${colours.tuiBlue100};
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${props => (props.position === 'right' ? 'flex-end' : 'flex-start')};
  z-index: 99;
  &:hover,
  &:focus {
    display: flex;
    z-index: 100;
  }
`;

export const HeaderContainer = styled.div`
  position: static;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => (props.backgroundColour ? props.backgroundColour : colours.tuiBlue300)};
  height: 40px;
  padding: 0 10px;
`;

export const HeaderLogo = styled.div`
  color: ${colours.tuiBlue500};
  margin-right: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  letter-spacing: 0.5px;
`;

export const HeaderTextLogo = styled(HeaderLogo)`
  font-family: TuiType, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 18px;
  margin-left: 6px;
  font-weight: bold;
`;

export const Environment = styled(HeaderLogo)`
  font-family: TuiType, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 20px;
  font-weight: bolder;
  opacity: 0.8;
  letter-spacing: 1px;
`;

export const TopNavigationItem = styled.div`
  position: relative;
  height: 40px;
  background-color: ${props => (props.isActive ? colours.tuiBlue100 : 'none')};
  &:hover,
  &:focus {
    background-color: ${colours.tuiBlue200};

    & > a {
      color: ${colours.grey4};
      &:after {
        border-color: ${props => (props.isActive ? colours.tuiBlue500 : colours.tuiBlue300)};
        border-width: 2px;
        transform: translateY(-2px) rotate(45deg);
      }
    }

    & + div {
      display: flex;
      z-index: 100;
      background-color: ${colours.tuiBlue200};
      & > div {
        background-color: ${colours.tuiBlue200};
      }
    }
  }

  & > a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    height: 100%;
    color: ${colours.tuiBlue500};
    text-decoration: none;
    font-weight: bold;
  }
`;
