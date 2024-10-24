import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { defaultGridOptions, getColumnDefs } from '@/config/agGridConfig';
import styles from './aggrid.module.css';

interface AgGridComponentProps<T> {
  rowData: T[];
  columnDefs: ColDef[];
  customGridOptions?: any;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent<T>) => void;
  onRowClicked?: any;
}

const AgGridComponent = <T,>({
  rowData,
  columnDefs,
  customGridOptions = {},
  onRowDoubleClicked,
  onRowClicked
}: AgGridComponentProps<T>) => {

  const gridOptions = { ...defaultGridOptions, ...customGridOptions };

  return (
    <div className={`${styles.agthemequartz} ag-theme-quartz`} style={{ height: 700, }}>
      <AgGridReact<T>
        rowData={rowData}
        columnDefs={getColumnDefs(columnDefs)}
        onRowDoubleClicked={onRowDoubleClicked}
        onRowClicked={onRowClicked}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        {...gridOptions}
      />
    </div>
  );
};

export default AgGridComponent;
