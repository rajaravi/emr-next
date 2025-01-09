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
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { SurgeryFormElements } from '@/data/SurgeryFormElements';
import { SurgeryModel } from '@/types/surgery';

let pageLimit: number = 6;
let selectedID: number = 0;
let archiveID: number = 0;

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
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.SURGERY.DATE'), class: "col-sm-2", field: "date"},
    { name: t('PATIENT.SURGERY.DOCTOR'), class: "col-sm-2", field: "doctor_id"},
    { name: t('PATIENT.SURGERY.LOCATION'), class: "col-sm-5", field: "location_id"},
    { name: t('PATIENT.SURGERY.STATUS'), class: "col-sm-2", field: "status_id"},
    
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.DATE'), field: 'date' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedProcedure, setSelectedProcedure] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);  
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
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = SurgeryFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.SURGERY.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchSurgeryList(page);
    fetchPatientList();
  }, []);

  // Get doctor list
  const fetchSurgeryList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
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
      setSelectedProcedure(selectedID);
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
    setSelectedProcedure(selectedID);
  }

  const fetchPatientList = async () => {
    try {
      const response = await execute_axios_post(ENDPOINTS.GET_PATIENT_LIST, []);      
    } catch (err) {
      setError('Failed to load reference data.');
    }
  }; 

  // Edit action call
  const createSurgery = () => {    
    getSurgeryById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedProcedure === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getSurgeryById('edit');
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

  // Get form data
  const getSurgeryById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedProcedure;
      let passData: string = JSON.stringify({ id: editID });    
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }

        let doctor = new Array;
        if(response.data.doctors) {
          response.data.doctors.map((doc: any, d: number) => {
            doctor.push({'label':doc.name, 'value': doc.id});
          })
        }
        let encounter = new Array;
        if(response.data.encounters) {
          response.data.encounters.map((enc: any, e: number) => {
            encounter.push({'label':enc.name, 'value': enc.id});
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
        setProcedureList(response.data.procedures);

        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
          else if(elements.name == 'encounter_id') {
            elements.options = [];
            elements.options = encounter;
          }
          else if(elements.name == 'location_id') {
            elements.options = [];
            elements.options = location;
          }
          else if(elements.name == 'status_id') {
            elements.options = [];
            elements.options = status;
          }
        })        
      }
    } catch (error: any) {
        console.error('Error on fetching procedure details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_STORE, formData);
        handleShowToast(t('SETTING.PROCEDURE.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      handleClose(); // Close offcanvas after saving
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

  // Archive action call
  const handleArchive = async(event: any) => {
    showLoading();
    try {
      archiveID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: archiveID, is_archive: event.target.checked });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_ARCHIVE, passData);      
      if(response.success) { 
        if(event.target.checked === true) {
          handleShowToast(t('SETTING.MESSAGES.UNARCHIVE'), 'dark');
        }
        if(event.target.checked === false) {
          handleShowToast(t('SETTING.MESSAGES.ARCHIVE'), 'success');
        }
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching procedure details:', error);
        hideLoading();
    }
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
    setSelectedProcedure(0);
    setPage(currentPage);
    fetchSurgeryList(currentPage, searchFilter);
  }

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
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('PATIENT.SURGERY.EDIT_TITLE') : t('PATIENT.SURGERY.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="75%">

        <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/>

        <Container className='p-0'>
          <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={handleAddPurchaser}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
          <Table>
            <thead>
              <tr>
                <th className={`${styles.tableGridHead} col-sm-11`}>{t('SETTING.SIDE_MENU.PROCEDURE')}</th>
                <th className={`${styles.tableGridHead} col-sm-1`}></th>
              </tr>
            </thead>
            <tbody>            
              {formData.surgery_details.map((surgery, index) => (
                <tr key={index} style={{borderStyle: 'hidden'}}>
                  <td>
                    <Form.Select
                      name="procedure_id"
                      id={`procedure_id-${index}`}
                      className="rounded-0"
                      value={surgery.procedure_id}
                      onChange={(e) => handleInputChange(e, index)}>
                        <option value="">Select...</option>
                        {procedureList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.name}</option>
                        ))}
                    </Form.Select>
                  </td>                  
                  <td>
                    <Button className="text-danger rounded-0" variant="" onClick={() => handleRemoveProcedure(index)}><i className="fi fi-br-trash"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>        
      </OffcanvasComponent>
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
