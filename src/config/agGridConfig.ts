import { ColDef, GridOptions } from 'ag-grid-community';

export const defaultColumnDefs: ColDef[] = [
  { sortable: true, filter: true, resizable: true },
];

export const defaultGridOptions: GridOptions = {
  pagination: true,
  paginationPageSize: 10,
  domLayout: 'autoHeight',
  defaultColDef: {
    sortable: true,
    filter: false, // show/hide column filter
    resizable: true,
  },
  rowSelection: 'single'
};

export const getColumnDefs = (customDefs: ColDef[]): ColDef[] => {
  return [ ...customDefs];
};
