import React, { useEffect, useRef, useState } from 'react';
import { execute_axios_get, execute_axios_post } from '@/utils/services/httpService';
import { Table, Button } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import Datalist from '@/components/core-components/Datalist';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import { DoctorFormElements } from '@/data/DoctorFormElements';
import { DoctorModel } from '@/types/doctor';
import Reference from '../reference';


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
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);

  const { t } = useTranslation('common');
  const [page, setPage] = useState<number>(1);
  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number>(1);
  const [mode, setMode] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [clear, setClear] = useState<boolean>(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);  
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [referenceList, setReferenceList] = useState<any>([]);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);

  const initialFormData: DoctorModel = {
    "id": null, 
    "designation_id": 1,
    "name": "",
    "short_name": "",
    "degree": "",
    "speciality_id": 0,
    "contact_person": null,
    "contact_no": "",
    "is_archive": false,
    "references": [
        { "reference_value": "", "reference_id": 0 }
    ]
};

  const [formData, setFormData] = useState<DoctorModel>(initialFormData);

  const handleOpen = () => { setInitialValues(initialValue); setIsOffcanvasOpen(true); }
  // const handleClose = () => { setMode(0); setIsOffcanvasOpen(false); }

  const handleShow = () => {
    setShow(true);

    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  useEffect(() => { 
    // getData(page); 
    fetchDoctorList(page);
  }, []);

  const fetchDoctorList = async (page: number) => {
    showLoading();
    try {
      const response = await execute_axios_get('/mock/getDoctorList'); // Replace with your actual API endpoint
    
      setList(response.data.data.list);
      setTotal(response.data.data.total);
      if(total < pageLimit) setCount(total);
      else setCount(page * pageLimit); 


    } catch (err) {
      setError('Failed to load patient data.');
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 1000);
    }
  };

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

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    // console.log('Form saved:', formData);
    // handleShowToast('Notes saved successfully!', 'success');
    if (dynamicFormRef.current?.validateModelForm()) {
      console.log('Form is valid', dynamicFormRef);
      try {
        const response = await execute_axios_post('/api/updateDoctor', formData);
        console.log(response.data.message); // Display success message or handle success
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
        setTimeout(() => {
          hideLoading();
        }, 2000);
      }
      handleClose(); // Close offcanvas after saving
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

   // Function to handle form field changes
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedReference = [...formData.references];
      updatedReference[index] = { 
        ...updatedReference[index], [name]: value
      };
      const updatedFormData = { ...formData, references: updatedReference };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      setSelectedDoctor(selectedID);
    }
    // getDoctorData()
    getDoctorById();
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

  const getDoctorById = async () => {    
    try {
      let passData: string = JSON.stringify({ id: selectedID });
      // const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_FORMDATA, passData);
      const response = await execute_axios_post('/mock/getDoctorById', passData); // Replace with your actual API endpoint
      console.log("🚀 ~ getDoctorById ~ response:", response)
      if(response.success) {        
        if(response.data?.data?.data?.id) {
          setMode(true);
          handleShow();
          setReferenceList(response.data?.data?.references);
          setInitialValues(response.data.data.data);
          setFormData(response.data.data.data);
        }
      }      
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);        
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
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_FORMDATA, passData);  
      if(response.success) {        
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
        }
      }      
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);        
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

  // Save a record
  const handleSave_ = async (formData: any) => {
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

  // Function to add a new reference row
  const handleAddReference = () => {
    const newReference = { reference_id: 0, reference_value: '' };
    setFormData({
      ...formData,
      references: [...formData.references, newReference],
    });
  };

  // Function to remove a reference row
  const handleRemoveReference = (index: number) => {
    const updatedReference = formData.references.filter((_, i) => i !== index);
    // setFormData({ ...formData, references: updatedReference });
    const updatedFormData = { ...formData, references: updatedReference };
    setFormData(updatedFormData);
  };
  

  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.DOCTOR')}</h1>                
      </div>
      <div className="row white-bg p-1 m-0 top-bottom-shadow">
        <div className="col-sm-7 mt-3 action">    
        <button className="btn btn-md btn-theme rounded-0" type="button" onClick={handleShow}>
          <i className="fi fi-ss-add"></i>Add New</button>   
        <div className="dropdown">
          <button className="btn btn-theme-light dropdown-toggle rounded-0 ms-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Actions
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" type="button" onClick={handleEdit}><i className="fi fi-sr-pencil"></i> Edit</a></li>
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
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent 
        show={show}
        title={ (mode) ? t('SETTING.DOCTOR.EDIT_TITLE') : t('SETTING.DOCTOR.CREATE_TITLE') } 
        handleClose={handleClose} 
        onSave={handleSave} 
        size="50%">

        <DynamicForm ref={dynamicFormRef}
          formData={DoctorFormElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode} 
          modelFormInputs={handleInputChange}/>

        <div className="container">
            <button type="button" className='btn btn-sm btn-primary rounded-0 float-end mb-2' onClick={handleAddReference}>Add Row</button>
            <Table >
              <thead >
                <tr >
                  <th style={{backgroundColor: '#07839c', color: 'white'}}>Reference</th>
                  <th style={{backgroundColor: '#07839c', color: 'white'}}>Reference No</th>
                  <th style={{backgroundColor: '#07839c', color: 'white'}}></th>
                </tr>
              </thead>
              <tbody>
              {/* <pre>---------  {JSON.stringify(formData, null, 2)}</pre> */}
                {formData.references.map((referance, index) => (
                  <tr key={index} style={{borderStyle: 'hidden'}}>
                    <td>
                      <select
                        name="reference_id"
                        id={`reference_id-${index}`}
                        className="form-control"
                        value={referance.reference_id}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                      <option value="">Select...</option>
                        {referenceList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                    <input
                        type="text"
                        name="reference_value"
                        id={`reference_value-${index}`}
                        placeholder="Reference value"
                        value={referance.reference_value}
                        className="form-control"
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveReference(index)}>×</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
      </OffcanvasComponent>
    </SettingLayout>
  );
};

export default Doctor;
