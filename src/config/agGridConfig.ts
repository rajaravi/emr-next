import { ColDef, GridOptions } from 'ag-grid-community';

export const defaultColumnDefs: ColDef[] = [
  { sortable: true, filter: true, resizable: false },
];

export const defaultGridOptions: GridOptions = {
  domLayout: 'autoHeight',
  defaultColDef: {
    sortable: true,
    filter: false, // show/hide column filter
    resizable: false,
  },
  rowSelection: 'single'
};

export const getColumnDefs = (customDefs: ColDef[]): ColDef[] => {
  return [ ...customDefs];
};
