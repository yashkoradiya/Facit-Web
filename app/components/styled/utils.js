import styled from 'styled-components';

export const truncate = width => {
  return `
    max-width: ${width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    `;
};

export const TooltipText = styled.p`
  margin: ${props => (props.margin ? props.margin : 0)};
  text-align: ${props => (props.align ? props.align : 'initial')};
  color: ${props => (props.color ? props.color : 'black')};
  text-decoration: ${props => (props.decoration ? props.decoration : 'none')};
`;
