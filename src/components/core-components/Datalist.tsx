import React, { FC } from 'react';
import { Row, Col, Form, Container } from 'react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';

interface Column {
    class: string;
    name: string;
    field: string;
    format?: string;
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
    archiveRecord?: (event: any) => void;
    defaultRecord?: (event: any) => void;
}

const Datalist: FC<DatalistProps> = ({columns, list, page, total, pageLimit, onRowClick, onRowDblClick, refreshData, showPagination, archiveRecord, defaultRecord }) => {
    let emptyRowsCount:number = pageLimit - ((list?.length) ? list?.length : 0);
    let emptyRows = Array();
    let lastNo = 0;
    if (emptyRowsCount)
        emptyRows = Array.from(Array(emptyRowsCount).keys())
    return (
        <>
            <Row className="listHead" key={9999}>
            {
                columns.map((cols, index) => {
                    return (
                        <Col key={index} className={cols.class}>{cols.name}</Col>
                    );
                })
            }
            </Row>
            <Row className="listBody" key={9999999}>
            {   // Records row generate code
                list.map((data: any, i) => {
                    return (
                        <Row custom-id={data?.id} key={data?.id} onClick={onRowClick} onDoubleClick={onRowDblClick}>
                            {
                                columns.map((cols, j) => {
                                    let f: string = cols.field;
                                    let pageNo = ((page-1) * pageLimit) + (i + 1);
                                    lastNo = pageNo;
                                    if(f.includes(".")) { // Column name with different tables
                                        data[f] = eval('data?.'+f);
                                    }
                                    if(f.includes("-")) { // Two string shows in the single column
                                        let splitData = f.split('-');
                                        data[f] = eval('data?.'+splitData[0])+ ' - ' +eval('data?.'+splitData[1]);
                                    }
                                    if(f === 'sno') {
                                        data[f] = pageNo;
                                    }
                                    if(f === 'is_archive') {
                                        if(data[f] === true || data[f] === 1) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'archive'+data?.id} id={'archive'+data?.id} onChange={archiveRecord} checked = {true} className='pt-12' role="button"/>;
                                        }
                                        if(data[f] === false || data[f] === 0) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'unarchive'+data?.id} id={'unarchive'+data?.id} onChange={archiveRecord} checked = {false} className='pt-12' role="button"/>;
                                        }                    
                                    }
                                    if(f === 'is_active') {
                                        if(data[f] === true || data[f] === 1) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'active'+data?.id} id={'archive'+data?.id} onChange={archiveRecord} checked = {true} className='pt-12' role="button"/>;
                                        }
                                        if(data[f] === false || data[f] === 0) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'inactive'+data?.id} id={'unarchive'+data?.id} onChange={archiveRecord} checked = {false} className='pt-12' role="button"/>;
                                        }                    
                                    }
                                    if(f === 'is_default') {
                                        if(data[f] === true || data[f] === 1) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'default'+data?.id} id={'default'+data?.id} onChange={defaultRecord} checked = {true} className='pt-12' role="button"/>;
                                        }
                                        if(data[f] === false || data[f] === 0) {
                                            data[f] = <Form.Check cur-id={data?.id} type="switch" name={'undefault'+data?.id} id={'undefault'+data?.id} onChange={defaultRecord} checked = {false} className='pt-12' role="button"/>;
                                        }                    
                                    }
                                    if(cols.format === 'date') { // date format change                              
                                        let splitDate = data[f].split("-");
                                        if(splitDate[0].length === 4) {
                                            data[f] = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
                                        }                                    
                                    }
                                    return (
                                        <Col key={(data?.id + i + j)} className={cols.class}>{data[f]}</Col>
                                    );
                                })
                            }
                        </Row>
                    );
                })                
            }            
            { // Empty rows generate code
                emptyRows.map((data: any, i) => {
                    return (
                        <Row key={(i+1)+lastNo} custom-key={(i+1)+lastNo}></Row>                        
                    );
                })
            }            
            </Row>
            { showPagination ? // Pagination build code
                <Row key="page_1">
                    <Col className='text-start pt-3'>
                        <span className="text-secondary">Total records {total}</span>
                    </Col>
                    <Col className='text-end pt-3'>
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
                    </Col>
                </Row> : ''
            }
        </>
    );
}
export default Datalist;