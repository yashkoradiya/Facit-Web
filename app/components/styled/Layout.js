import styled from 'styled-components';
import { colours, flexBoxProperties } from './defaults';
import { truncate } from './utils';

export const Flexbox = styled.div`
  ${flexBoxProperties}
`;

export const PageHeader = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${colours.tuiBlue500};
`;

export const SubHeader = styled.h3`
  margin: 0;
  font-size: 14px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)};
  color: ${colours.tuiBlue500};
`;

export const TextBlock = styled.span`
  font-size: ${props => (props.fontSize ? props.fontSize : '12px')};
  color: ${props => (props.color ? props.color : 'black')};
`;

export const AgGridToolTipAnchor = styled.div`
  color: ${colours.linkBlue};
  & span {
    border-bottom: dotted 1px ${colours.linkBlue};
  }
`;

export const AgGridToolTip = styled.div`
  display: none;
  font-size: 12px;
  position: absolute;
  width: ${props => (props.width ? props.width : '140px')};
  z-index: 100;
  background-color: white;
  border-radius: 2px;
  padding: 10px;
  min-height: ${props => (props.minHeight ? props.minHeight : '50px')};
  border: 1px solid ${colours.grey2};
  & a {
    display: block;
    ${props => (props.width ? truncate(props.width) : truncate('140px'))};
    text-decoration: none;
    color: ${colours.tuiBlue400};
    &:not(:last-child) {
      margin-bottom: 6px;
    }
    &:hover {
      text-decoration: none;
      color: ${colours.tuiBlue400};
    }
  }

  &:before {
    content: '';
    width: 12px;
    height: 13px;
    border-left: 1px solid ${colours.grey2};
    border-bottom: 1px solid ${colours.grey2};
    transform: rotate(45deg);
    left: -7px;
    top: 7px;
    background-color: white;
    position: absolute;
  }
`;

export const ToolTip = styled.div`
  display: none;
  position: absolute;
  z-index: 10;
  width: 120%;
  top: 0;
  left: ${props => (props.left ? props.left : 0)};
  right: 0;
  margin: auto;
  transform: translateX(-10%) translateY(-100%) translateY(-14px);
  padding: 8px;
  font-size: 12px;
  background-color: ${colours.grey1};
  border: 1px solid ${colours.grey2};
  border-radius: 4px;
  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-right: 1px solid ${colours.grey2};
    border-bottom: 1px solid ${colours.grey2};
    background-color: ${colours.grey1};
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform: translateY(50%) translateY(1px) rotate(45deg);
  }
`;

export const ErrorToolTip = styled(ToolTip)`
  transform: unset;
  width: unset;
  transform: translateY(-50%);
  background-color: ${colours.pink};
  border: 1px solid ${colours.darkRed};
  &:after {
    border-right: 1px solid ${colours.darkRed};
    border-bottom: 1px solid ${colours.darkRed};
    background-color: ${colours.pink};
  }
`;

export const PopoutToolTip = styled(ToolTip)`
  position: fixed;
  width: unset;
  top: unset;
  left: unset;
  right: unset;
`;

export const StyledTable = styled.table`
  background-color: white;
  border: 1px solid black;
  border-collapse: collapse;
  font-size: 12px;
  color: black;
`;

export const TableHeader = styled.thead`
  background-color: ${colours.grey1};
`;

export const TableBody = styled.tbody``;
export const TableRow = styled.tr`
  position: relative;
`;

export const TableHead = styled.th`
  text-align: left;
  border: 1px solid black;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 7px;
  padding-right: 18px;
  cursor: pointer;
  position: relative;

  &:after {
    position: absolute;
    display: ${props => (props.showSort ? 'block' : 'none')};
    top: 6px;
    right: 8px;
    width: 5px;
    height: 5px;
    border-right: 1px solid ${props => (props.color ? props.color : colours.grey2)};
    border-bottom: 1px solid ${props => (props.color ? props.color : colours.grey2)};
    transform-origin: center;
    transform: ${props => (props.asc ? 'translateY(4px) rotate(225deg)' : 'rotate(45deg)')};
    content: '';
  }
`;

export const TableCell = styled.td`
  border: 1px solid black;
  padding: 4px 7px;
`;

export const ResponsiveTableHeader = styled.h4`
  display: block;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  padding: 5px 7px;
  grid-column: ${props => (props.columnSpan ? `span ${props.columnSpan}` : null)};
  grid-row: ${props => (props.rowSpan ? `span ${props.rowSpan}` : null)};
`;

export const StickyResponsiveTableHeader = styled(ResponsiveTableHeader)`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  border-bottom: 1px solid ${colours.grey2};
`;

/**
 * This implementation of TableCell doesn't work properly with dynamic columsn.
 * This should be discarded when all the references to this is refactored with PositionedTableCell instead. 
 */
export const ResponsiveTableCell = styled.div`

  font-size: 12px;
  padding: ${props => (props.padding ? props.padding : `5px 7px`)};
  background-color: ${props => (props.isSelected ? colours.grey1 : null)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p{
    margin: 0;
  }

  &:hover {
    background-color: ${props => (props.hasTooltip ? colours.tuiBlue100 : null)};
    & ${ToolTip} {
      display: ${props => (props.hasTooltip ? 'block' : null)};
    }
  }
`;

export const ErrorMessage = styled.div`
  ${flexBoxProperties}
  font-size: 11px;
  color: ${colours.red};
  padding: 2px;
`;

export const FramedFlexbox = styled.fieldset`
  ${flexBoxProperties}
  border: 1px solid ${colours.grey2};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
  width: ${props => (props.width ? props.width : '100%')};
`;

export const FramedTitle = styled.legend`
  font-size: ${props => (props.fontSize ? props.fontSize : '12px')};
`;

export const Gridbox = styled.div`
  display: inline-grid;
  background: ${props => (props.background ? props.background : 'none')};
  grid-template-columns: ${props => props.columnDefinition || 'auto'};
  grid-template-rows: auto;
  grid-column-gap: ${props => props.columnGap || null};
  grid-row-gap: ${props => props.rowGap || null};
  border-bottom: ${props => (props.border ? `1px solid ${colours.grey2}` : null)};
  border-left: ${props => (props.border ? `1px solid ${colours.grey2}` : null)};

  & > * {
    border-top: ${props => (props.border ? `1px solid ${colours.grey2}` : null)};
    border-right: ${props => (props.border ? `1px solid ${colours.grey2}` : null)};
    /* border-bottom: ${props => (props.border ? '1px solid transparent' : null)};
    border-left: ${props => (props.border ? '1px solid transparent' : null)}; */
  }
`;

export const ErrorBox = styled.div`
  background-color: rgba(255, 0, 0, 0.07);
  border: 1px solid rgba(255, 0, 0, 0.4);
  padding: 3px 5px;
  border-radius: 3px;
  width: max-content;
`;

export const PositionedToolTip = styled.span`
  display: none;
  position: absolute;
  top: ${props => (props.top ? props.top : 0)};
  z-index: 10;
  border: 1px;
  padding: 8px;
  background-color: ${colours.grey1};
  border: 1px solid ${colours.grey2};
  border-radius: 4px;
  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-right: 1px solid ${colours.grey2};
    border-bottom: 1px solid ${colours.grey2};
    background-color: ${colours.grey1};
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform: translateY(50%) translateY(1px) rotate(45deg);
  }
`;

export const PositionedTableCell = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: ${props => (props.padding ? props.padding : `5px 7px`)};

  &:hover {
    background-color: lightblue;
    & ${PositionedToolTip} {
      display: block;
    }
  }
`;
