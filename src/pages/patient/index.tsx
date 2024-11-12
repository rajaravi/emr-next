import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
import { useNavigate } from 'react-router-dom';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';

import { idToUuid } from '@/utils/helpers/uuid';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { PaginationControl } from 'react-bootstrap-pagination-control';
// import AgGridComponent from '@/components/core-components/AgGridComponent';
import Datalist from '@/components/core-components/Datagrid';


let pageLimit: number = 8;
let eid = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const columns: { name: string; class: string; field: string; }[] = [
  { name: "S.No", class: "col-sm-1", field: "id" },
  { name: "MRN", class: "col-sm-1", field: "mrn_no" },
  { name: "Patient Name", class: "col-sm-3", field: "full_name" },
  { name: "DOB", class: "col-sm-2", field: "dob" },
  { name: "Email", class: "col-sm-3", field: "email" },
  { name: "Phone", class: "col-sm-2", field: "mobile_no" }        
]  

const filter: { name: string; field: string; }[] = [
  { name: "Name", field: 'name' },
  { name: "MRN", field: 'mrn_no' }
]

const PatientIndex: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  // const { id } = router.query;

  // TODO: convert patiend ID selected from the datatable
  // const patientId = 62; // 62: e1195a2c-5150-4173-82e1-e0e6377c086d // Testing purpose
  // let uuid = idToUuid(patientId).toString();
  // console.log("🚀 ~ uuid:", patientId, uuid);
  let uuid;
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [rowData, setRowData] = useState<Patient[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [clear, setClear] = useState<boolean>(false);
  
  useEffect(() => { getData(page); }, []);

  const getData = async (page: number, sFilter?: { field: string; text: string }) => {
    try {
        let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
        const response = await execute_axios_post(ENDPOINTS.GET_PATIENT, passData, {
          headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
          }
        });
        setList(response.data.list);
        setTotal(response.data.total);
        if(total < pageLimit) setCount(total);
        else setCount(page * pageLimit);
     
    } catch (error: any) {
        console.error('Error creating patient:', error);
        // error.status(500).json({ message: error.message });
    }        
  }

  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        getData(1,sFilter);
        setClear(true);        
    }
  }

  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setPage(1);
    getData(1);
    setClear(false);
  }
  // const doctorDblClick = (event: any) => {
  //   var myOffcanvas = document.getElementById('offcanvasResponsive')
  //   console.log('DBL click');
  //   event.stopPropagation()
  // }
  // const doctorClick = (event: any) => {
  //   console.log('click');
  //   let x = document.getElementsByClassName("selected");
  //   if(x.length > 0) { x[0].classList.remove("selected"); }
        
  //   if(event.target.getAttribute('custom-attribute')) {
  //       eid = event.target.getAttribute('custom-attribute');
  //       event.target.parentElement.setAttribute('class', 'row selected');        
  //   }    
  // }  

  const addNewPatinet = () => {
    router.push('/patient/create'); 
  };

  const editPatinet = () => {
    if (selectedPatient) {
      const patientId = selectedPatient.patient_id;
      uuid = idToUuid(patientId).toString();
      router.push(`/patient/${uuid}`);
    }
  }

  const patientDblClick = (event: RowDoubleClickedEvent<Patient>): void => {
    if (event.data) {
      const patientId = event.data.patient_id;
      uuid = idToUuid(patientId).toString();
      router.push(`/patient/${uuid}`);
      // Perform additional actions with the row ID
    } else {
      console.error('Row data is undefined');
    }
  };

  const patientClick = (event: RowDoubleClickedEvent<Patient>): void => {
    if (event.data) {
      const patientId = event.data;
      setSelectedPatient(patientId)
    }
  };
  

  return (
    <Container fluid>
      <Row>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={`${styles.title} mt-3 mb-3`}>{t('MENU.MENU_PATIENT')}</h1>                
          </div>
          <div className="row white-bg p-1 m-0 top-bottom-shadow">
            <div className="col-sm-7 mt-3 action">    
            <button className="btn btn-md btn-theme rounded-0" type="button" onClick={addNewPatinet}><i className="fi fi-ss-add"></i>  Add New</button>   
              <div className="dropdown">
                <button className="btn btn-theme-light dropdown-toggle rounded-0 ms-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Actions
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" type="button" onClick={editPatinet}><i className="fi fi-sr-pencil"></i> Edit</a></li>              
                </ul>
              </div>
            </div>  
            <div className='col-sm-5 float-end'>
              <div className="py-3 row">
                <div className="col-sm-4 px-0">
                  <select className="form-control rounded-0 bg-transparent border-0" id="searchType">
                    {
                      filter.map((fil, k) => {
                        return (
                          <option key={k} value={fil.field}>{fil.name}</option>
                        );
                      })
                    }
                  </select>
                </div>
                <div className="col-sm-8 position-relative">
                  <input type="text" className="form-control search-text rounded-0" id="searchText" autoComplete='off' />
                  <button type='button' className="btn btn-theme search-button rounded-0" onClick={() => handleSearch()}><i className="fi fi-br-search"></i> </button>
                  {clear ? <button type='button' className="btn btn-default rounded-0 btn-search-clear" onClick={() => clearSearch()}><i className="fi fi-tr-delete"></i> </button> : null}
                </div>                        
              </div>
            </div>
          </div> 
          <div>
            <Datalist 
              columns={columns}
              list={list}
              onRowDblClick={patientDblClick}
              onRowClick={patientClick}
              page={page}
              total={total}
              pageLimit={pageLimit}
              refresh={refreshList}
            />
          </div>
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
                      setPage(page);                 
                      getData(page);                        
                  }}
                  ellipsis={1}
              />                
            </div>
          </div> 
      </Row>
    </Container>
  );
};

export default PatientIndex;
