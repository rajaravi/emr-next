import React, { useEffect, useState } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import Datalist from '@/components/core-components/Datalist';
import CreateDoctor from '../doctor/create';


let pageLimit: number = 8;
let selectedID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const initialValue = {    
    designation_id: 0,
    short_name: '',
    name: '',
    degree: '',
    speciality_id: 0,
    references: [
      { reference_id: 0, reference_value: '' },
    ],
    contact_person: '',
    is_archive: 0   
};

const columns: { name: string; class: string; field: string; }[] = [
  { name: "S.No", class: "col-sm-1", field: "sno" },
  { name: "Name", class: "col-sm-7", field: "name" },
  { name: "Degree", class: "col-sm-4", field: "degree" }   
];

const filter: { name: string; field: string; }[] = [
  { name: "Name", field: 'name' },
  { name: "Degree", field: 'degree' }
];

const Doctor: React.FC = () => {
  const { t } = useTranslation('common');
  const [page, setPage] = useState<number>(1);
  const [mode, setMode] = useState<number>(0);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [clear, setClear] = useState<boolean>(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);  
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const handleOpen = () => { setInitialValues(initialValue); setIsOffcanvasOpen(true); }
  // const handleClose = () => { setMode(0); setIsOffcanvasOpen(false); }

  

  useEffect(() => { getData(page); }, []);

  // Get data for list 
  const getData = async (page: number, sFilter?: { field: string; text: string }) => {
    try {
        let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
        const response = await execute_axios_post(ENDPOINTS.GET_DOCTOR, passData);
        setList(response.data.list);
        setTotal(response.data.total);
        if(total < pageLimit) setCount(total);
        else setCount(page * pageLimit);     
    } catch (error: any) {
        console.error('Error :', error);        
    }        
  }

  // Search button call
  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        setPage(1);
        getData(1,sFilter);
        setClear(true);        
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    getData(1);
    setClear(false);
  }

  // List double click
  const doctorDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {      
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');        
    }   
    getDoctorData()    
  }
  // List click
  const doctorClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }  
        
    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');      
      event.target.parentElement.setAttribute('class', 'row selected');
    }    
  }

  // // Callback function for pagination change event
  // const refreshData = (currentPage: number) => {
  //   setPage(currentPage);
  //   getData(currentPage);    
  // }

  // Callback function form save to list refresh
  const refreshForm = () => {
    refreshData(page);
  }

  // Archive action call
  const handleArchive = () => {

  }

  // Edit action call
  const handleEdit = () => {    
    getDoctorData()
  }

  // Retrive a data by ID
  const getDoctorData = async () => {    
    try {
      let passData: string = JSON.stringify({ id: selectedID });
      let mode = 0;
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_FORMDATA, passData);  
      if(response.success) {        
        if(response.data?.data?.id) mode = 1

        setInitialValues(response.data.data);
        setIsOffcanvasOpen(true);
      }      
      setMode(mode);   
    } catch (error: any) {
        console.error('Error creating patient:', error);        
    }        
  }

  // Callback function for pagination change event
  const refreshData = (currentPage: number) => {
    setPage(currentPage);
    getData(currentPage);    
  }

  // Offcanvas open
  const onClose = () => {    
    selectedID = 0;
    getDoctorData();
  }
  
  // Offcanvas close
  const handleClose = () => {    
    setIsOffcanvasOpen(false);  
  }

  // Save a record
  const handleSave = async (formData: any) => {    
    console.log(formData);
    try {      
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_STORE, formData);   
      console.log("Store res", response);
      if(response.success) {
        handleClose();
      }      
    } catch (error: any) {
        console.error('Error:', error);        
    } finally {
      refreshForm();
    }
  }
  

  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.DOCTOR')}</h1>                
      </div>
      <div className="row white-bg p-1 m-0 top-bottom-shadow">
        <div className="col-sm-7 mt-3 action">    
        <button className="btn btn-md btn-theme rounded-0" type="button" onClick={handleOpen} ><i className="fi fi-ss-add"></i>  Add New</button>   
          <div className="dropdown">
            <button className="btn btn-theme-light dropdown-toggle rounded-0 ms-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Actions
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" type="button" onClick={handleEdit}><i className="fi fi-sr-pencil"></i> Edit</a></li>
              {/* <li><a className="dropdown-item" type="button"><i className="fi fi-sr-folder-open"></i> Archive</a></li>               */}
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
          onRowDblClick={doctorDblClick}
          onRowClick={doctorClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}
        />
      </div>   
      <CreateDoctor
          mode={mode}
          loadData={initialValues}
          onClose={handleClose}
          handleSave={handleSave}
          isOffcanvasOpen={isOffcanvasOpen}  
        />
    </SettingLayout>
  );
};

export default Doctor;
