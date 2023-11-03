import React from 'react';
import DateTimeCellRenderer from 'components/AgGrid/renderers/DateTimeCellRenderer';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import { packageOverviewUrlFromType } from './api';
import TextToolTipRenderer from 'components/AgGrid/renderers/TextToolTipRenderer';
import { TooltipText } from 'components/styled/utils';
import { colours } from 'components/styled/defaults';
/**
 * New accommodation column defintions
 */
export const newAccomColDef = [
  {
    field: 'timestamp',
    headerName: 'Date & Time',
    width: 130,
    cellRenderer: DateTimeCellRenderer
  },
  {
    field: 'name',
    headerName: 'Accommodation',
    tooltipField: 'name',
    width: 150,
    cellRenderer: LinkCellRenderer,
    sortable: true, // Enable sorting for this column
  comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
    // Access the 'name' property of the values
    const nameA = valueA.name;
    const nameB = valueB.name;

    // Use localeCompare for case-insensitive alphabetical sorting
    const comparison = nameA.localeCompare(nameB, undefined, {
      sensitivity: 'base',
      ignorePunctuation: true
    });

    // Return the comparison result, taking into account the sort direction
    return isInverted ? -comparison : comparison;
  },
    exportValueGetter: value => getPropertyValue(value, 'name'),
    valueGetter: d => {
      if (!d.data) {
        return null;
      }

      return {
        url: `/cost/accommodation/details/${getPropertyValue(d.data, 'id')}`,
        name: getPropertyValue(d.data, 'name')
      };
    }
  },
  {
    field: 'sourceMarkets',
    headerName: 'SM',
    tooltipField: 'sourceMarkets',
    width: 100
  },
  {
    field: 'code',
    headerName: 'Contr. acc. code',
    tooltipField: 'code',
    width: 100
  },
  {
    field: 'resort',
    headerName: 'Resort',
    tooltipField: 'resort',
    width: 100
  },
  {
    field: 'packageType',
    headerName: 'Product Type',
    tooltipField: 'packageType',
    width: 130,
    cellRenderer: LinkCellRenderer,
    exportValueGetter: params => params.data?.packageType,
    valueGetter: params => {
      return {
        url: `${packageOverviewUrlFromType(params.data?.packageType)}?accommodationId=${params.data?.id}`,
        name: params.data?.packageType
      };
    }
  },
  {
    field: 'contractVersion',
    headerName: 'Version',
    width: 100,
    cellClass: 'no-border',
    valueGetter: d => {
      if (!d.data || (!d.data.contractVersion && !d.data.contractVersionDate)) {
        return null;
      }
      const contractVersion = `(${d.data.contractVersion}) ${moment(d.data.contractVersionDate).format(
        getDateFormat()
      )}`;
      return {
        toString: () => {
          return contractVersion;
        }
      };
    }
  }
];

/**
 * Failed import column defintions
 */
export const failedImportsColDef = [
  {
    field: 'date',
    headerName: 'Date & Time',
    width: 130,
    cellRenderer: DateTimeCellRenderer
  },
  {
    field: 'type',
    headerName: 'Product Type',
    tooltipField: 'type',
    width: 130
  },
  {
    field: 'id',
    headerName: 'Id',
    tooltipField: 'id',
    width: 100
  },
  {
    field: 'description',
    headerName: 'Description',
    tooltipField: 'description',
    width: 100
  },
  {
    field: 'reason',
    headerName: 'Reason for failure',
    tooltipField: 'reason',
    width: 130
  }
];

/**
 * Unpublished contract changes column defintions
 */
export const unpublishedContractColDef = [
  {
    field: 'timestamp',
    headerName: 'Date & Time',
    width: 130,
    cellRenderer: DateTimeCellRenderer
  },
  {
    field: 'changes',
    headerName: 'Changes',
    cellRenderer: TextToolTipRenderer, // Replace with your cell renderer
    width: 20,
    sortable: true, // Enable sorting for this column
    comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
      // Access the 'changesCount' property of the values
      const changesCountA = valueA.content.props.children;
      const changesCountB = valueB.content.props.children;

      // Convert the counts to numbers if they are strings
      const numA = typeof changesCountA === 'string' ? parseInt(changesCountA, 10) : changesCountA;
      const numB = typeof changesCountB === 'string' ? parseInt(changesCountB, 10) : changesCountB;

      // Compare the numbers
      if (numA < numB) {
        return isInverted ? 1 : -1;
      } else if (numA > numB) {
        return isInverted ? -1 : 1;
      }
      return 0; // If they are equal
    },
    valueGetter: d => {
      if (!d.data) {
        return null;
      }
      return {
        tooltip: d.data.changes,
        content: (
          <TooltipText color={colours.linkBlue} decoration="underline">
            {d.data.changesCount}
          </TooltipText>
        )
      };
    },
  },
  {
    field: 'sourceMarket',
    headerName: 'SM',
    tooltipField: 'sourceMarket',
    width: 100
  },
  {
    field: 'description',
    headerName: 'Accommodation',
    tooltipField: 'description',
    width: 150,
    cellRenderer: LinkCellRenderer,
    exportValueGetter: value => getPropertyValue(value, 'description'),
    valueGetter: d => {
      if (!d.data) {
        return null;
      }

      return {
        url: `/cost/accommodation/details/${getPropertyValue(d.data, 'id')}`,
        name: getPropertyValue(d.data, 'description')
      };
    }
  },
  {
    field: 'code',
    headerName: 'Contr. acc. code',
    tooltipField: 'code',
    width: 120
  },
  {
    field: 'packageType',
    headerName: 'Product Type',
    tooltipField: 'packageType',
    width: 130,
    cellRenderer: LinkCellRenderer,
    exportValueGetter: params => params.data?.packageType,
    valueGetter: value => {
      return {
        url: `${packageOverviewUrlFromType(value.data?.packageType)}?accommodationId=${value.data?.id}`,
        name: value.data?.packageType
      };
    }
  },
  {
    field: 'contractVersion',
    headerName: 'Version',
    width: 100,
    cellClass: 'no-border',
    valueGetter: value => {
      if (!value.data || (!value.data.contractVersion && !value.data.contractVersionDate)) {
        return null;
      }
      const contractVersion = `(${value.data.contractVersion}) ${moment(value.data.contractVersionDate).format(
        getDateFormat()
      )}`;
      return {
        toString: () => {
          return contractVersion;
        }
      };
    }
  }
];

/**
 * Non contracted discounts column defintions
 */
export const nonContractedColDefs = [
  {
    field: 'publishedDateTime',
    headerName: 'Date & Time',
    width: 130,
    cellRenderer: DateTimeCellRenderer
  },
  {
    field: 'planningPeriod',
    headerName: 'Planning period',
    width: 130
  },
  {
    field: 'description',
    headerName: 'Description',
    tooltipField: 'description',
    width: 100
  },
  {
    field: 'sourceMarket',
    headerName: 'Source market',
    tooltipField: 'sourceMarket',
    width: 100
  },
  {
    field: 'accommName',
    headerName: 'Accom name',
    tooltipField: 'accommName',
    width: 100
  },
  {
    field: 'accommCode',
    headerName: 'Accom code',
    tooltipField: 'accommCode',
    width: 100
  },
  {
    field: 'productType',
    headerName: 'Product Type',
    tooltipField: 'productType',
    width: 130
  },
  {
    field: 'discountVersion',
    headerName: 'Discount version',
    tooltipField: 'discountVersion',
    width: 130
  }
];
