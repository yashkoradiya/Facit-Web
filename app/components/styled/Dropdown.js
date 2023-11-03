import styled from 'styled-components';
import { colours } from './defaults';
import { truncate } from './utils';
import { ErrorToolTip } from './Layout';

export const DropdownLabel = styled.label`
  font-family: TuiType, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 11px;
  margin-top: 5px;
  margin-bottom: 3px;
  display: block;
`;

export const Dropdown = styled.ul`
  padding: 0;
  margin-top: 0;
  background-color: white;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  z-index: 1;
  border: ${props => (props.isOpen ? `1px solid ${props.disabled ? colours.tuiGrey200 : colours.tuiBlue400}` : 'none')};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: none;
`;

export const DropdownContent = styled.div`
  position: absolute;
  z-index: 100;
  display: ${props => (props.isOpen ? `block` : 'none')};
  width: 100%;
`;

export const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  padding: 3px;
  background-color: ${props => (props.isActive ? colours.grey1 : null)};
  font-weight: ${props => (props.isSelected ? 'bold' : null)};
  cursor: pointer;
  & mark {
    background-color: rgba(112, 203, 244, 0.5);
  }
`;

export const DropdownInput = styled.input`
  padding: 3px;
  border: none;
  width: 100%;
  min-width: 50px;
  &::placeholder {
    color: inherit;
  }

  &:disabled {
    background-color: transparent;
    border-color: ${colours.tuiGrey200};
    color: inherit;
  }
`;

export const DropdownHeader = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 26px;
  background: ${props => (props.background ? props.background : 'white')};
  color: ${props => (props.color ? props.color : 'black')};
  padding-top: ${props => (props.paddingTop ? props.paddingTop : '2px')};
  padding-right: ${props => (props.paddingRight ? props.paddingRight : '2px')};
  padding-bottom: ${props => (props.paddingBottom ? props.paddingBottom : '2px')};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : '2px')};
  border: 1px solid ${props => (props.disabled ? colours.tuiGrey200 : colours.tuiBlue400)};
  border-radius: 3px;
  border-bottom-left-radius: ${props => (props.isOpen ? 0 : '3px')};
  border-bottom-right-radius: ${props => (props.isOpen ? 0 : '3px')};
  border-bottom-color: ${props => (props.isOpen ? 'white' : null)};

  &:after {
    position: absolute;
    display: block;
    top: 6px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-right: 1px solid ${props => (props.color ? props.color : colours.grey2)};
    border-bottom: 1px solid ${props => (props.color ? props.color : colours.grey2)};
    transform-origin: center;
    transform: ${props => (props.isOpen ? 'translateY(4px) rotate(225deg)' : 'rotate(45deg)')};
    content: '';
  }
`;

export const DropdownHeaderContent = styled.div`
  display: flex;
  width: calc(100% - 22px);
  align-items: flex-start;
  overflow: hidden;

  ${DropdownInput} {
    ::placeholder {
      color: ${colours.grey2};
    }
  }
`;

export const DropdownChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background-color: white;
  border: 1px solid ${colours.tuiBlue400};
  border-top: none;
  padding: 0 2px 2px 2px;
`;

export const DropdownChip = styled.div`
  margin: 1px 2px;
  padding: 2px 5px 2px 5px;
  display: flex;
  white-space: nowrap;
  background-color: ${colours.grey1};
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  cursor: default;
`;

export const DropdownChipLabel = styled.span`
  ${props => (props.truncate ? truncate(props.truncate) : truncate('60px'))};
`;

export const DropdownChipRemoveButton = styled.button`
  display: flex;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
  margin-left: 3px;
  font-size: 14px;
  opacity: 0.3;
`;

export const DropdownContainer = styled.div`
  font-family: 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
  font-size: 11px;
  letter-spacing: normal;
  position: relative;
  width: ${props => (props.width ? props.width : '200px')};

  & ${DropdownHeader} {
    border-color: ${props => (props.hasErrorMessage ? `${colours.red}` : null)};
    background-color: ${props => (props.hasErrorMessage ? 'rgba(212, 15, 20, 0.1)' : null)};

    & input {
      background-color: ${props => (props.hasErrorMessage ? 'transparent' : null)};
    }
  }

  & ${ErrorToolTip} {
    transform: translateY(-70%);
  }

  &:hover {
    & ${ErrorToolTip} {
      display: ${props => (props.hasErrorMessage ? 'block' : null)};
    }
  }
`;
