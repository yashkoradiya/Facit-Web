import { css } from 'styled-components';

export const colours = {
  backgroundWhite: '#fafafa',
  tuiBlue500: '#092a5e',
  tuiBlue400: '#219ed9',
  tuiBlue300: '#70Cbf4',
  tuiBlue200: '#c2e6fa',
  tuiBlue100: '#e2f3fe',
  tuiRed: '#d40e14',
  tuiBeige200: '#e7e3db',
  tuiBeige100: '#f3f0ec',
  tuiGrey200: '#dcdcdc',
  linkBlue: '#007bff',
  green: '#A5E2CF',
  yellow: '#ffc022',
  orange: '#F7D59A',
  darkPurple: '#563665',
  purple: 'rgba(150, 95, 178, 0.3)',
  darkSeaGreen: '#327f66',
  seaGreen: '#4cbf99',
  darkRed: '#a1080e',
  red: '#fa1119',
  pink: '#ff5d62',
  lime: '#c2bd00',
  greyTableInactive: '#f5f5f5',
  grey1: '#efede7',
  grey2: '#c7c7c7',
  grey3: '#737373',
  grey4: '#333'
};

export const colourPalette = [
  '092A5E',
  '219ED9',
  'D40E14',
  '8AAF00',
  'FFC022',
  'CB7800',
  '563665',
  '965FB2',
  '327F66',
  '4CBF99',
  'A1080E',
  'FF5D62',
  '70CBF4',
  'C2BD00'
];

export const flexBoxProperties = css`
  display: flex;
  flex-wrap: ${props => props.wrap || null};
  flex-direction: ${props => (props.direction === 'column' ? 'column' : 'row')};
  flex: ${props => (props.flex ? props.flex : null)};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'center'};
  align-self: ${props => props.alignSelf || 'auto'};
  width: ${props => (props.width ? props.width : null)};
  height: ${props => (props.height ? props.height : null)};
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)};
  max-width: ${props => (props.maxWidth ? props.maxWidth : 'none')};
  &&& > * {
    margin-right: ${props => (props.childrenMarginRight ? props.childrenMarginRight : null)};
  }
`;
