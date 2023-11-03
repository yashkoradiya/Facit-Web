import styled from 'styled-components';
import { colours } from './defaults';

export const Button = styled.button`
  white-space: nowrap;
  position: relative;
  height: ${props => (props.height ? props.height : '28px')};
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};
  border-radius: 3px;
  padding: ${props => props.padding ?? '5px 20px'};
  font-size: ${props => (props.fontSize ? props.fontSize : '12px')};
  text-transform: uppercase;
  outline: none;
  background-color: white;
  border: 1px solid ${colours.tuiBlue500};
  color: ${colours.tuiBlue500};
  cursor: pointer;

  &:focus {
    background-color: white;
    border: 1px solid ${colours.tuiBlue500};

    &:after {
      position: absolute;
      top: 2px;
      left: 2px;
      bottom: 2px;
      right: 2px;
      content: '';
      box-shadow: 0 0 0 0.5px ${colours.tuiBlue500};
      border-radius: 2px;
    }
  }
  &:hover {
    background-color: ${colours.tuiBlue500};
    border: 1px solid ${colours.tuiBlue500};
    color: white;
  }
  &:disabled {
    background-color: white;
    border: 1px solid ${colours.grey1};
    color: ${colours.grey2};
    cursor: default;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: ${colours.tuiBlue500};
  border-color: ${colours.tuiBlue500};
  color: white;

  &:focus {
    background-color: ${colours.tuiBlue500};
    border-color: ${colours.tuiBlue500};

    &:after {
      box-shadow: 0 0 0 0.5px white;
    }
  }
  &:hover {
    background-color: white;
    border-color: ${colours.tuiBlue500};
    color: ${colours.tuiBlue500};
  }
  &:disabled {
    background-color: ${colours.grey1};
    border-color: ${colours.grey1};
    color: ${colours.grey2};
  }
`;

export const PrimaryButtonWithIcon = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  & i {
    font-size: 16px;
    margin-right: 6px;
  }
`;

export const DeleteButton = styled(Button)`
  border-color: ${colours.red};
  color: ${colours.red};

  &:focus {
    border-color: ${colours.red};

    &:after {
      box-shadow: 0 0 0 0.5px ${colours.red};
    }
  }
  &:hover {
    background-color: ${colours.red};
    border-color: ${colours.red};
  }
`;

export const LightBlueButton = styled(Button)`
  background-color: ${colours.tuiBlue200};
  border: 1px solid ${colours.tuiBlue200};
  color: ${colours.tuiBlue400};

  &:hover {
    background-color: white;
    color: ${colours.tuiBlue400};
  }

  &:focus {
    background-color: ${colours.tuiBlue200};
    border-color: ${colours.tuiBlue200};

    &:after {
      box-shadow: none;
    }
  }
`;

export const DropdownButtonListContainer = styled.div`
  position: relative;
`;

export const DropdownButtonList = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  left: 0;
  width: 100%;
  border: 1px solid ${colours.tuiGrey200};
  border-top: none;
  z-index: 1;
`;

export const DropdownButtonListTitle = styled(Button)`
  background-color: ${colours.tuiBlue200};
  border: 1px solid ${colours.tuiBlue200};
  color: ${colours.tuiBlue400};
  padding: 5px 12px 5px 30px;
  &:before {
    position: absolute;
    top: 7px;
    left: 12px;
    content: '';
    display: block;
    width: 7px;
    height: 8px;
    transform: rotate(45deg);
    border-right: 1px solid ${colours.tuiBlue400};
    border-bottom: 1px solid ${colours.tuiBlue400};
  }

  &:hover {
    background-color: white;
    color: ${colours.tuiBlue400};
  }

  &:focus {
    background-color: ${colours.tuiBlue200};
    border-color: ${colours.tuiBlue200};

    &:after {
      box-shadow: none;
    }
  }
`;

export const DropdownButton = styled.button`
  width: 100%;
  background-color: white;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;

  & a {
    color: black;
    display: block;
    padding: 3px 12px;
    width: 100%;
    height: 100%;

    &:hover {
      text-decoration: none;
    }
  }

  &:hover {
    background-color: ${colours.tuiBeige200};
  }
`;

export const IconButton = styled.button`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 1px solid transparent;
  color: ${colours.tuiBlue500};
  cursor: ${props => (props.disabled ? 'normal' : 'pointer')};
  width: ${props => (props.width ? props.width : '20px')};
  height: ${props => (props.height ? props.height : '20px')};
  border-radius: 50%;
  padding: 0;
  outline: none;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '0px')};
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};

  &:focus {
    background-color: transparent;
    border: 1px solid ${colours.tuiBlue100};
  }
  &:hover {
    background-color: ${colours.tuiBlue100};
    border: 1px solid ${colours.tuiBlue100};
  }
  &:disabled {
    background-color: transparent;
    border: 1px solid transparent;
    color: ${colours.grey3};
  }
`;

export const TextButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${colours.tuiBlue400};
  cursor: pointer;

  &:hover {
    & span {
      text-decoration: underline;
    }
  }

  & i {
    font-size: 16px;
    margin: 0 4px;
  }
`;
