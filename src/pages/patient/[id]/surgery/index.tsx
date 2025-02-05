import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { uuidToId } from '@/utils/helpers/uuid';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import ToastNotification from '@/components/core-components/ToastNotification';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import { SurgeryFormElements } from '@/data/SurgeryFormElements';
import { SurgeryModel } from '@/types/surgery';
import SurgeryForm from './form';

let pageLimit: number = 6;
let selectedID: number = 0;

export const getStaticPaths: GetStaticPaths = async () => {
  // Hardcode some IDs
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: true, // or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {  
  patient_id: 0,
  patients: [{value: 0, label: ''}],
  episode_id: 0,
  doctor_id: 0,
  location_id: 0,
  date: '',
  from_time: '',
  to_time: '',
  admission_date: '',
  discharge_date: '',
  discharge_time: '',
  notes: '',
  status_id: 0,    
  surgery_details: [
    { procedure_id: '' },
  ]    
};

const Surgery: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<boolean>(false);    
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = uuidToId(id);

  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('PATIENT.SURGERY.SNO'), class: "col-sm-1", field: "sno", format:''},
    { name: t('PATIENT.SURGERY.DATE'), class: "col-sm-2", field: "date", format:'date'},
    { name: t('PATIENT.SURGERY.DOCTOR'), class: "col-sm-3", field: "doctor.name", format:''},
    { name: t('PATIENT.SURGERY.LOCATION'), class: "col-sm-4", field: "location.name", format:''},
    { name: t('PATIENT.SURGERY.STATUS'), class: "col-sm-2", field: "status.description", format:''},    
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.DATE'), field: 'date' }
  ];

  const dynamicFormRefSurg = useRef<DynamicFormHandle>(null);  
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [selectedSurgery, setSelectedSurgery] = useState<number>(0);
  const [procedureList, setProcedureList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: SurgeryModel = {
    "id": null,
    "patient_id": 0,
    "patients": [{
      value: 0,
      label: ''
    }],
    "episode_id": 0,
    "doctor_id": 0,
    "location_id": 0,
    "date": "",
    "from_time": "",
    "to_time": "",
    "admission_date": "",
    "discharge_date": "",
    "discharge_time": "",
    "notes": "",
    "status_id": 0,    
    "surgery_details": [
        { "procedure_id": 0 }
    ]
  };
  const [formData, setFormData] = useState<SurgeryModel>(initialFormData);

  useEffect(() => {   
    // Language apply for form label
    const translatedFormElements = SurgeryFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.SURGERY.'+element.label)
    })); 
    setTranslatedElements(translatedFormElements);
    fetchSurgeryList(page);
    fetchProcedureList();
  }, []);

  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  // Get doctor list
  const fetchSurgeryList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter, patient_id: uuidToId(id) });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load surgery data.');
    } finally {
      hideLoading();
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
        setsearchFilter(sFilter);
        fetchSurgeryList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchSurgeryList(1);
    setClear(false);
  }

  // List double click
  const surgeryDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedSurgery(selectedID);
    }
    getSurgeryById('edit');
  }

  // List single click
  const surgeryClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedSurgery(selectedID);
  }

  // Edit action call
  const handleEdit = () => {
    if(selectedSurgery === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getSurgeryById('edit');
  }

  const getSurgeryById = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedSurgery;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          const formData = response.data?.data;
          const patientData = {value: formData.patient.id, label: formData.patient.full_name,
            full_name: formData.patient.full_name, mrn_no: formData.patient.mrn_no, dob: formData.patient.dob}
          const updatedData = Object.assign({}, formData, { patients: [patientData] });
          setInitialValues(updatedData);
          setFormData(updatedData);
          setMode(true);
        }
        else {
          let passData: any = { id: uuidToId(id) };
          const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
          const bindData = {value: response.data.data.id, label: response.data.data.full_name, full_name: response.data.data.full_name, mrn_no: response.data.data.mrn_no, dob: response.data.data.dob} 
          const updatedData = Object.assign({}, initialFormData, { patients: [bindData] });
          setInitialValues(updatedData);
          setFormData(updatedData);
        }
        let doctor = new Array;
        if(response.data.doctors) {
          response.data.doctors.map((doc: any, d: number) => {
            doctor.push({'label':doc.name, 'value': doc.id});
          })
        }        
        let location = new Array;
        if(response.data.locations) {
          response.data.locations.map((loc: any, l: number) => {
            location.push({'label':loc.name, 'value': loc.id});
          })
        }
        let status = new Array;
        if(response.data.status_list) {
          response.data.status_list.map((stat: any, s: number) => {
            status.push({'label':stat.description, 'value': stat.id});
          })
        }
        let encounter = new Array;
        if(response.data.encounters) {
          response.data.encounters.map((enc: any, a: number) => {
            if(enc.patient_id === patientId ) {
              encounter.push({'label':enc.name, 'value': enc.id});
            }
          })
        }

        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
          else if(elements.name == 'location_id') {
            elements.options = [];
            elements.options = location;
          }
          else if(elements.name == 'status_id') {
            elements.options = [];
            elements.options = status;
          }
          else if(elements.name == 'encounter_id') {
            elements.options = [];
            elements.options = encounter;
          }
        })  
        setTimeout(() => {          
          const patientElement = document.querySelector(".patientName");
          if (patientElement) {            
            patientElement.classList.add("d-none");            
          }
        }, 100);      
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();    
    // Implement your save logic here
    if (dynamicFormRefSurg.current?.validateModelForm()) {
      try {
          // Update patient ID
        if (formData.patients[0].value) {
          formData.patient_id = formData.patients[0].value
        }
        const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_STORE, formData);
        if(response.success) {
          handleShowToast(t('PATIENT.SURGERY.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error creating surgery:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRefSurg);
      hideLoading();
    }
  };

  const createSurgery = () => {
    getSurgeryById('add');
  }
  // Callback function form save to list refresh
  const refreshForm = () => {
    refreshData(page);
  }

  // Callback function for pagination change event
  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row'); // Selection row remove when the page change 
    listRows.forEach(function(row){
      row.classList.remove('selected');
    })
    setSelectedSurgery(0);
    setPage(currentPage);
    fetchSurgeryList(currentPage, searchFilter);
  }
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;

    if (index !== undefined) {
      const updateProcedure = [...formData.surgery_details];
      updateProcedure[index] = {
        ...updateProcedure[index], [name]: value
      };

      const updatedFormData = { ...formData, surgery_details: updateProcedure };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };  

  const handleTypeaheadInputChange = async (name: string, selected: any, label: string, isClicked: any = false) => {
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        const typeahead = translatedElements.map((field: { type: string; name: string }) => {
          if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === selected) {
            return field;
          }
        })[0];
        try {
          let passData: string = JSON.stringify({ search: name, search_type: 1 });
          const response = await execute_axios_post('/patient/get-list', passData); // Replace with your actual API endpoint
          const formData = response.data.map((patients: { id: any; full_name: string; dob: string, mrn_no: string }) => ({
            value: patients.id, // default mandatory typeahead property: value
            label: patients.full_name, // default mandatory typeahead property: label            
            full_name: patients.full_name,
            mrn_no: patients.mrn_no,
            dob: patients.dob            
          }))  
          updateTypeaheadOptions(formData, selected, name);
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {          
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }
      } else {
        // setFormData({ ...formData, [name]: name });
      }
    } else {
      setFormReset(false); // block form reset      
      setFormData({ ...formData, ['patients']: selected });
    }
  };

  // Function to update options in form config
  const updateTypeaheadOptions = (apiData: any, appliedString: string, search_text: string|null = null, isClicked: any = false) => {    
    const updatedConfig = translatedElements.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {        
        if (initialValues.id > 0 && search_text) {
          if (!isClicked) {
            return {
              ...field,
              value: {},
              name: search_text,
              options: apiData,
            };
          } else {
            return {
              ...field,
              value: apiData,
              options: apiData,
            };
          }
        } else {
          return {
            ...field,
            options: apiData,
          };
        }
      } 
      return field;
    });
    setTranslatedElements(updatedConfig);    
  };

  // Get procedure list
  const fetchProcedureList = async () => {
    try {
      const response = await execute_axios_post(ENDPOINTS.GET_PROCEDURE_LIST, []);
      setProcedureList(response.data);
    } catch (err) {
      setError('Failed to load purchaser data.');
    }
  };

  // Function to add a new reference row
  const handleAddPurchaser = () => {
    const newProcedure = { procedure_id: 0 };
    setFormData({
      ...formData,
      surgery_details: [...formData.surgery_details, newProcedure],
    });
  };

  // Function to remove a reference row
  const handleRemoveProcedure = (index: number) => {
    const updateProcedure = formData.surgery_details.filter((_, i) => i !== index);    
    const updatedFormData = { ...formData, surgery_details: updateProcedure };
    setFormData(updatedFormData);
  };
    
  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('PATIENT.SIDE_MENU.SURGERY')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createSurgery}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={5} className="float-end">
          <SearchFilter 
            filterColumns={filter}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            clear={clear}
            showFilter={true}
          />
        </Col>
      </Row>
      <div>
        <Datalist
          columns={columns}
          list={list}
          onRowDblClick={surgeryDblClick}
          onRowClick={surgeryClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          />
      </div>
      <SurgeryForm
        ref={dynamicFormRefSurg} // Pass ref to SurgeryForm
        formLabels={translatedElements}
        initialValues={initialValues}
        formCurData={formData}
        editID = {selectedSurgery}
        refreshForm={refreshForm}
        show={show}
        mode={mode}
        handleClose={handleClose}
        procedureList={procedureList}
        createPurchaser={handleAddPurchaser}
        deleteProcedure={handleRemoveProcedure}
        handleTypeaheadInputChange={handleTypeaheadInputChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        formReset={formReset}
        fromSource={'Patients'}
      />
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </PatientLayout>
  );
};
export default Surgery;
