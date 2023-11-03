import styled from 'styled-components';
import { colours } from './defaults';
import { ErrorToolTip } from './Layout';

export const Checkbox = styled.input`
  padding: 3px 4px;
  background-color: white;
  border: 1px solid ${colours.tuiBlue400};
  border-radius: 3px;
  height: ${props => (props.fontSize ? props.fontSize : '11px')};

  &:disabled {
    background-color: transparent;
    border-color: transparent;
    color: inherit;
  }
`;

export const NiceCheckbox = styled.div`
  position: relative;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border: ${props => (props.disabled ? `1px solid ${colours.tuiGrey200}` : `1px solid ${colours.tuiBlue400}`)};
  border-radius: 3px;
  margin-right: 4px;
  background-color: ${props => (props.disabled ? colours.grey1 : props.checked ? colours.tuiBlue400 : 'white')};

  &:after {
    position: absolute;
    display: block;
    content: '';
    top: ${props => (props.indeterminate ? '6px' : '1px')};
    left: ${props => (props.indeterminate ? '3px' : '4px')};
    width: ${props => (props.indeterminate ? '8px' : '5px')};
    height: ${props => (props.indeterminate ? '0px' : '10px')};
    border-style: solid;
    border-color: ${props => (props.indeterminate ? colours.tuiBlue400 : 'white')};
    border-width: 0 2px 2px 0;
    transform: ${props => (props.indeterminate ? null : 'rotate(45deg)')};
  }
`;

export const CheckboxLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${props => (props.disabled ? colours.tuiGrey200 : 'inherit')};

  &:hover {
    cursor: pointer;
  }
`;

export const RadioButton = styled.input`
  padding: 3px 4px;
  margin: 0 3px 0 0;
  background-color: white;
  border: 1px solid ${colours.tuiBlue400};
  border-radius: 3px;
  height: ${props => (props.fontSize ? props.fontSize : '11px')};

  &:disabled {
    background-color: transparent;
    border-color: transparent;
    color: inherit;
  }
`;

export const Input = styled.input`
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '100%')};
  padding: 3px 4px;
  background-color: white;
  border: ${props => (props.border ? props.border : `1px solid ${colours.tuiBlue400}`)};
  border-radius: ${props => (props.borderRadius ? props.borderRadius : `3px`)};

  &:disabled {
    background-color: transparent;
    border-color: ${colours.tuiGrey200};
    color: inherit;
  }
`;

export const InputLabel = styled.label`
  font-size: 11px;
  margin-top: 5px;
  margin-bottom: 3px;
  color: ${props => (props.disabled ? colours.tuiGrey200 : 'inherit')};
  display: block;
`;

export const InputRadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 11px;
  margin-top: 5px;
  margin-bottom: 3px;
  color: ${props => (props.disabled ? colours.tuiGrey200 : 'inherit')};
  cursor: pointer;
`;

export const InputBox = styled.div`
  position: relative;
  display: flex;
  width: unset;
  width: ${props => (props.width ? props.width : '100%')};
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};
  flex-direction: column;

  & ${ErrorToolTip} {
    transform: ${props => (!props.hasLabel ? 'translateY(-100%) translateY(-10px)' : null)};
  }

  &:hover {
    & ${ErrorToolTip} {
      display: ${props => (props.hasErrorMessage ? 'block' : null)};
    }
  }

  & ${Input} {
    height: 26px;
    border-radius: 3px;
    border-color: ${props => (props.hasErrorMessage ? `${colours.red}` : null)};
    background-color: ${props => (props.hasErrorMessage ? 'rgba(212, 15, 20, 0.1)' : null)};
  }
`;
