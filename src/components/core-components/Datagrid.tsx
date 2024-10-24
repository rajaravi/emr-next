import React, { useEffect, useState, FC } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';
let id: number = 0;

interface Column {
    class: string;
    name: string;
    field: string;
}

interface DatalistProps {
    columns: Column[];
    list: [];
    onRowClick: (event: any) => void;
    onRowDblClick: (event: any) => void;
    page: number;
    total: number;
    pageLimit: number;
    refresh: boolean;
    refreshData: (event: any) => void;
    showPagination: boolean;
}

const Datalist: FC<DatalistProps> = ({columns, list, page, total, pageLimit, onRowClick, onRowDblClick, refresh, refreshData, showPagination }) => {
    return (
        <>            
            <div className="row listHead">
                {
                    columns.map((cols, index) => {
                        return (
                            <div key={index} className={cols.class}>{cols.name}</div>
                        );
                    })
                }
            </div>
            <div className="listBody">
                {
                    list.map((data, i) => {
                        return (
                            <div className="row" key={i} onClickCapture={onRowClick} onDoubleClickCapture={onRowDblClick}>
                                {
                                    columns.map((cols, j) => {
                                        let f: string = cols.field; 
                                        let colKey: string = i + '' + j;      
                                        if (f === 'id') {
                                            data[f] = Number(i + 1);
                                        }
                                        if(f === 'id') {
                                            if(page < 2) {
                                                data[f] = (i + 1);
                                            }
                                            else {
                                                data[f] = ((page-1) * pageLimit) + (i + 1);
                                            }
                                            id = data[f];
                                        }
                                        return (
                                            <div custom-attribute={id} key={colKey} className={cols.class}>{data[f]}</div>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>   
            { showPagination ? 
                <div className='row'>
                    <div className='col-sm-6 text-start pt-3'>
                    {/* <label className="text-secondary">Showing records { ((page * pageLimit) - (pageLimit - 1))} -  {count} of {total}</label> */}
                    <label className="text-secondary">Total records {total}</label>
                    </div>
                    <div className='col-sm-6 text-end pt-3'>
                    <PaginationControl
                        page={page}
                        between={2}
                        total={total}
                        limit={pageLimit}
                        changePage={(page: number) => {
                            refreshData(page);                        
                        }}
                        ellipsis={1}
                    />                
                    </div>
                </div> : ''
            }                                 
        </>
    );
}

export default Datalist;