import React, { useEffect, useState, FC } from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { faSearch, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let id: number = 0;
let pageLimit: number = 11;

interface Column {
    class: string;
    name: string;
    field: string;
}

interface Filter {
    field: string;
    name: string;
}

interface DatalistProps {
    url: string;
    refresh: boolean;
    columns: Column[];
    filter: Filter[];
    page: number;
    onRowClick: () => void;
    onRowDblClick: () => void;
    archiveRecord: () => void;
}

const Datalist: FC<DatalistProps> = (props) => {
    const [page, setPage] = useState<number>(1);
    const [list, setList] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [clear, setClear] = useState<boolean>(false);
    const [overlay, setOverlay] = useState<boolean>(false);

    useEffect(() => { getData(page); }, [props.refresh]);

    const getData = async (page: number, sFilter?: { field: string; text: string }) => {
        setOverlay(true);
        try {
            let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
            const res = await postData(props.url, passData);
            if (res.success) {
                setList(res.data.list);
                setTotal(res.data.total);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
        setOverlay(false);
    }

    const handleSearch = () => {
        const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
        if (searchTextElement.value) {
            const sFilter = {
                field: (document.getElementById('searchType') as HTMLSelectElement).value,
                text: searchTextElement.value
            }
            getData(1, sFilter);
            setClear(true);
        }
    }

    const clearSearch = () => {
        (document.getElementById('searchText') as HTMLInputElement).value = '';
        getData(1);
        setClear(false);
    }

    return (
        <>
            <div className="row listHead">
                {
                    props.columns.map((cols, index) => {
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
                            <div className="row" key={i} onClickCapture={props.onRowClick} onDoubleClickCapture={props.onRowDblClick}>
                                {
                                    props.columns.map((cols, j) => {
                                        let f: string = cols.field; 
                                        let colKey: string = i + '' + j;      
                                        if (f === 'id') {
                                            if (props.page < 2) {
                                                data[f] = (i + 1);
                                            } else {
                                                data[f] = ((page - 1) * pageLimit) + (i + 1);
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
            <div className='row'>
                <div className='col-sm-6'>
                    <div className="pt-3 row">
                        <div className="col-sm-5 pe-0">
                            <input type="text" className="form-control rounded-0" id="searchText" autoComplete='off' />
                        </div>
                        <div className="col-sm-3 px-0">
                            <select className="form-control rounded-0" id="searchType">
                                {
                                    props.filter.map((fil, k) => {
                                        return (
                                            <option key={k} value={fil.field}>{fil.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-4 ps-0">
                            <button type='button' className="btn btn-secondary rounded-0" onClick={() => handleSearch()}><FontAwesomeIcon icon={faSearch} /> Search</button>
                            {clear ? <button type='button' className="btn btn-default rounded-0 ms-2" onClick={() => clearSearch()}><FontAwesomeIcon icon={faDeleteLeft} /> Clear</button> : null}
                        </div>
                    </div>
                </div>
                <div className='col-sm-6 text-end pt-3'>
                    <PaginationControl
                        page={page}
                        between={2}
                        total={total}
                        limit={pageLimit}
                        changePage={(page: number) => {
                            setPage(page); getData(page);
                            let x = document.getElementsByClassName("selected");
                            if (x.length > 0) { x[0].classList.remove("selected"); }
                        }}
                        ellipsis={1}
                    />
                </div>
            </div>
            {overlay ? <div className="overlay"></div> : null}
        </>
    );
}

export default Datalist;