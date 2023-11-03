import styled from 'styled-components';

const getStars = classification => {
  let content = '';

  if (classification) {
    const number = parseInt(classification);
    if (!isNaN(number)) content = '\\2605'.repeat(number);
    if (classification.includes('+')) content += '+';
  }
  return content;
};

export const Stars = styled.span`
  margin-left: 15px;
  & :after {
    display: block;
    content: '${props => getStars(props.classification)}';
  }
`;

export const WarningIcon = styled.i.attrs({
  className: 'material-icons'
})`
  font-size: ${props => props.fontSize || '18px'};
  margin: ${props => props.margin || 0};
  color: rgb(237, 201, 0);
`;
