import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { uuidToId } from '@/utils/helpers/uuid';

import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';

import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import AppointmentForm from './form';
import ToastNotification from '@/components/core-components/ToastNotification';
// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
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
import { AppointmentFormElements } from '@/data/AppointmentFormElements';
import { AppointmentModel } from '@/types/appointment';

let pageLimit: number = 6;
let selectedID: number = 0;
let archiveID: number = 0;

const MIN_CHARACTERS = 3;

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  patient_id: 0,
  encounter_id: 0,
  doctor_id: 0,
  location_id: 0,
  appointment_type_id: 0,
  date: '',
  from_time: '',
  to_time: '',
  notes:'',
  status_id: 0
};

const Appointment: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const columns: { name: string; class: string; field: string; format?: string }[] = [
    { name: t('PATIENT.APPOINTMENT.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.APPOINTMENT.DATE'), class: "col-sm-2", field: "date", format:'date'},
    { name: t('PATIENT.APPOINTMENT.APPOINTMENT_TYPE'), class: "col-sm-2", field: "appointment_type.name"},
    { name: t('PATIENT.APPOINTMENT.DOCTOR'), class: "col-sm-2", field: "doctor.name"},
    { name: t('PATIENT.APPOINTMENT.LOCATION'), class: "col-sm-3", field: "location.name"},
    { name: t('PATIENT.APPOINTMENT.STATUS'), class: "col-sm-2", field: "status.description"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.APPOINTMENT.PATIENT'), field: 'patient' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);  
  const [total, setTotal] = useState<number>(0);
  const [selectedAppointment, setSelectedAppointment] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);  
  const [list, setList] = useState<any>([]); 
  const [slotsList, setSlotsList] = useState<any>([]);
  const [slotBookedTime, setSlotBookedTime] = useState<string | null>(null);     
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [field1, setField1] = useState<string | null>(null); // First field
  const [field2, setField2] = useState<string | null>(null); // Second field
  const [field3, setField3] = useState<string | null>(null); // Third field
  const [field4, setField4] = useState<string | null>(null); // Third field
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedFromTime, setSelectedFromTime] = useState<string | null>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
    
  const initialFormData: AppointmentModel = { 
    "id": null,
    "patient_id": 0,
    "encounter_id": 0,
    "doctor_id": 0,
    "location_id": 0,
    "appointment_type_id": 0,
    "date": "",
    "from_time": "",
    "to_time": "",
    "notes": "",
    "status_id": 0
};

const [formData, setFormData] = useState<AppointmentModel>(initialFormData);

  // Onload function
  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = AppointmentFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.APPOINTMENT.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchAppointmentList(page);
  }, []);

  // Get doctor list
  const fetchAppointmentList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter, patient_id: uuidToId(id) });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load doctor data.');
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
        fetchAppointmentList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchAppointmentList(1);
    setClear(false);
  }

  // List double click
  const appointmentDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedAppointment(selectedID);
    }
    getAppointmentId('edit');
  }

  // List single click
  const appointmentClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedAppointment(selectedID);
  }

  // Edit action call
  const createAppointment = () => {    
    getAppointmentId('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedAppointment == 0) {
      handleShowToast(t('PATIENT.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getAppointmentId('edit');
  } 

  // Archive action call
  const handleArchive = async(event: any) => {
    showLoading();
    try {
      archiveID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: archiveID, is_archive: event.target.checked });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_ARCHIVE, passData);      
      if(response.success) { 
        if(event.target.checked === true) {
          handleShowToast(t('PATIENT.MESSAGES.UNARCHIVE'), 'dark');
        }
        if(event.target.checked === false) {
          handleShowToast(t('PATIENT.MESSAGES.ARCHIVE'), 'success');
        }
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
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
    setSelectedAppointment(0);
    setPage(currentPage);
    fetchAppointmentList(currentPage, searchFilter);
  }
 
  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const getAppointmentId = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedAppointment;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {          
          setInitialValues(response.data.data);              
        }
        else {
          setFormData(initialFormData);
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
        let appType = new Array;
        if(response.data.appointment_types) {
          response.data.appointment_types.map((app: any, a: number) => {
            appType.push({'label':app.name, 'value': app.id});
          })
        }
        
        // setProcedureList(response.data.procedures);

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
          else if(elements.name == 'appointment_type_id') {
            elements.options = [];
            elements.options = appType;
          }
        })        
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
    
  }
  const handleShow = () => {
    setShow(true);   
  }
  const handleClose = () => {
      setShow(false);
      setMode(false);
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    console.log(formData);
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_STORE, formData);
        if(response.success) {
          handleShowToast(t('PATIENT.APPOINTMENT.MESSAGES.SAVE_SUCCESS'), 'success');
        }
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };
  
  const handleTypeaheadInputChange = async (name: string, selected: any, label: string, isClicked: any = false) => {
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        try {
          let passData: string = JSON.stringify({ search: name, search_type: 1 });
          const response = await execute_axios_post('/patient/get-list', passData); // Replace with your actual API endpoint
          const formData = response.data.map((patient: { id: any; full_name: string; dob: string, mrn_no: string }) => ({
            value: patient.id, // default mandatory typeahead property: value
            label: patient.full_name, // default mandatory typeahead property: label            
            full_name: patient.full_name,
            mrn_no: patient.mrn_no,
            dob: patient.dob            
          }))          
          updateTypeaheadOptions(formData, selected);          
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {
          // setLoading(false);
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }

      } else {
        updateTypeaheadOptions([], ''); // reset the values
      }
    } else {
      setFormReset(false); // block form reset
      setFormData({ ...formData, [name]: selected });
    }  
  };

  // Function to update options in form config
  const updateTypeaheadOptions = (apiData: Option[], appliedString: string) => {
    const updatedConfig = translatedElements.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {
        return {
          ...field,
          options: apiData,
        };
      }      
      return field;
    });
    // console.log("🚀 ~ updatedConfig ~ updatedConfig:", updatedConfig)
    setTranslatedElements(updatedConfig);
    getEncounterList();
  };

  // Function to handle form field changes
  const handleInputChange = (e:any) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    if(name == 'doctor_id') {
        setField1(value);
        getAvailableSlots(value, field2, field3, field4);
    }
    if(name == 'location_id') {
        setField2(value);
        getAvailableSlots(field1, value, field3, field4);
    }
    if(name == 'appointment_type_id') {
        setField3(value);
        getAvailableSlots(field1, field2, value, field4);
    }
    if(name == 'date') {
        setField4(value);
        getAvailableSlots(field1, field2, field3, value);    
    }
      setFormData({ ...formData, [name]: value });
  }; 

  // Fetch available slots records from the API
  const getAvailableSlots = async (val1: string | null, val2: string | null, val3: string | null, val4: string | null) => {   
    if (val1 && val2 && val3 && val4) {
      setSlotsList([]);
      setSelectedFromTime('');
    try {
        let passData: string = JSON.stringify({ consultant_id: val1, location_id: val2, appointment_type_id: val3, date: val4 });
        const result = await execute_axios_post(ENDPOINTS.POST_AVAILABLE_SLOTS, passData);
        setSlotsList(result.data);        
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }
  }; 

  // Fetch encounter records from the API
  const getEncounterList = async () => {
    try {
      let passData: string = JSON.stringify({ patient_id: patientID });
      const result = await execute_axios_post(ENDPOINTS.GET_ENCOUNTER_LIST, passData);
      let encounter = new Array;
      if(result.data) {
        result.data.map((enc: any, e: number) => {
          encounter.push({'label':enc.name, 'value': enc.id});
        })
      }
      translatedElements.map((elements: any, k: number) => {
        if(elements.name == 'episode_id') {
          elements.options = [];
          elements.options = encounter;
        }          
      })        
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Handle click on an <li> element
  const handleItemClick = (fromTime: string, toTime: string, index: number) => {
    setFormData({ ...formData, ['from_time']: fromTime, ['to_time']: toTime });
    setActiveIndex(index); // Update the active index
  };

  return (
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('PATIENT.SIDE_MENU.APPOINTMENT')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">
        <Col xs={7} className="mt-3 mb-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createAppointment}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={appointmentDblClick}
          onRowClick={appointmentClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>      
      <AppointmentForm 
        formLabels={translatedElements}
        initialValues={initialValues}
        slotsList={slotsList}
        editID = {selectedAppointment}
        refreshForm={refreshForm}
        show={show}
        mode={mode}
        handleClose={handleClose}
        handleTypeaheadInputChange={handleTypeaheadInputChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleItemClick={handleItemClick}
        formReset={formReset}
        activeIndex={activeIndex}
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


export default Appointment;
