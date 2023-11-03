import styled from 'styled-components';

export const Content = styled.div`
  padding: 20px;
  height: calc(100% - 80px);
`;

export const Container = styled.div`
  margin: ${props => (props.margin ? props.margin : 0)};
`;
