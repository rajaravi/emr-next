import React, { FC } from 'react';
import {  Button, Row, Col, Form } from 'react-bootstrap';

interface FilterProps {
    filterColumns: any;    
    handleSearch: () => void;
    clearSearch: () => void;
    clear: boolean;
    showFilter: boolean;
}

const SearchFilter: FC<FilterProps> = ({filterColumns, handleSearch, clearSearch, clear, showFilter }) => {
    return (
        <>
        { showFilter && // Pagination build code
        <Row className='py-3'>
            <Col xs={4} className='px-0'>
                <Form.Select className="rounded-0 bg-transparent border-0" id="searchType">
                    {filterColumns.map((fil: any, k: number) => {
                        return (
                            <option key={k} value={fil.field}>{fil.name}</option>
                        );
                    })}
                </Form.Select>
            </Col>
            <Col xs={8} className='position-relative'>
                <Form.Control type="text" className="search-text rounded-0" id="searchText" autoComplete='off' />
                <Button variant='primary' className="search-button rounded-0" onClick={() => handleSearch()}><i className="fi fi-br-search"></i></Button>{clear ? <Button variant='default' className="rounded-0 btn-search-clear" onClick={() => clearSearch()}><i className="fi fi-tr-delete"></i></Button> : null}
            </Col>
        </Row>
        }
        </>
    );
}

export default SearchFilter;