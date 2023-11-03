import styled from 'styled-components';
import { colours } from './defaults';

export const Tabs = styled.div`
  display: flex;
`;

export const TabText = styled.button`
  border: none;
  background-color: unset;
  outline: 0;
  font-size: 12px;
  &:focus {
    color: ${colours.tuiBlue400};
  }
`;

export const Tab = styled.div`
  position: relative;
  display: flex;
  background: ${props => {
    const border = props.hasWarning ? colours.tuiRed : props.isSelected ? colours.tuiBlue400 : null;
    if (!border) return colours.grey1;

    const background = props.isSelected ? 'rgb(250, 250, 250)' : colours.grey1;

    return `linear-gradient(to bottom, ${border} 2px, ${background} 2px)`;
  }};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid ${colours.grey2};
  border-bottom: none;
  padding: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:after {
    display: ${props => (props.isSelected ? 'block' : 'none')};
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    bottom: -2px;
    height: 2px;
    background-color: ${colours.backgroundWhite};
  }

  &:hover {
    background: ${props => (props.isSelected || props.hasWarning ? null : colours.grey1)};
  }

  &:not(:last-child) {
    margin-right: 6px;
  }
`;

export const TabContent = styled.div`
  border: 1px solid ${colours.grey2};
  border-radius: 3px;
  border-top-left-radius: 0;
  padding: 10px;
  width: ${props => (props.width ? props.width : null)};
`;
