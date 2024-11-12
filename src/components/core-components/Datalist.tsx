import React, { useEffect, useState, FC } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';

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
    refreshData: (event: any) => void;
    showPagination: boolean;
    archiveRecord: (event: any) => void;
}

const Datalist: FC<DatalistProps> = ({columns, list, page, total, pageLimit, onRowClick, onRowDblClick, refreshData, showPagination, archiveRecord }) => {
    let emptyRowsCount:number = pageLimit - ((list?.length) ? list?.length : 0);
    let emptyRows = Array();
    let lastNo = 0;
    if (emptyRowsCount)
        emptyRows = Array.from(Array(emptyRowsCount).keys())
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
            {   // Records row generate code
                list.map((data: any, i) => {
                    return (  
                        <>    
                        <div className="row" custom-id={data?.id} key={i} onClick={onRowClick} onDoubleClick={onRowDblClick}>
                            {                                
                                columns.map((cols, j) => {                                    
                                    let f: string = cols.field;                                    
                                    let colKey: string = i + '' + j;
                                    let pageNo = ((page-1) * pageLimit) + (i + 1);
                                    lastNo = pageNo;
                                    if(f === 'sno') {                                        
                                        data[f] = pageNo;
                                    }
                                    if(f === 'is_archive') {                                         
                                        if(data[f] === true) {
                                            data[f] = <div className="form-check form-switch" cur-id={data?.id} ><input className="form-check-input mt-3" type="checkbox" onChange={archiveRecord} checked = {true} /><label className="form-check-label">Yes</label></div>;
                                        }
                                        if(data[f] === false) {
                                            data[f] = <div className="form-check form-switch" cur-id={data?.id}><input className="form-check-input mt-3" type="checkbox" onChange={archiveRecord} checked = {false} /><label className="form-check-label">No</label></div>;
                                        }
                                    }
                                    return (
                                        <div key={colKey} className={cols.class}>{data[f]}</div>
                                    );
                                })
                            }
                        </div>                        
                        </>
                    );                    
                })
            }            
            { // Empty rows generate code                
                emptyRows.map((data: any, i) => {                
                    return (                          
                        <div className="row" key={(i+1)+lastNo} custom-key={(i+1)+lastNo}></div>
                    );
                })
            }
            </div>   
            
            { showPagination ? // Pagination build code
                <div className='row'>
                    <div className='col-sm-6 text-start pt-3'>                    
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