import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';

import { uuidToId } from '@/utils/helpers/uuid';
import AppointmentForm from './form';
import { AppointmentFormElements } from '@/data/AppointmentFormElements';
import { AppointmentModel } from '@/types/appointment';

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

let pageLimit: number = 6;
let selectedID: number = 0;
let archiveID: number = 0;

const initialValue = {
  patient_id: 0,
  patients: [{value: 0, label: ''}],
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
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = uuidToId(id);
  
  const columns: { name: string; class: string; field: string; format?: string }[] = [
    { name: t('PATIENT.APPOINTMENT.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.APPOINTMENT.DATE'), class: "col-sm-2", field: "date", format:'date'},
    { name: t('PATIENT.APPOINTMENT.APPOINTMENT_TYPE'), class: "col-sm-2", field: "appointment_type.name"},
    { name: t('PATIENT.APPOINTMENT.DOCTOR'), class: "col-sm-2", field: "doctor.name"},
    { name: t('PATIENT.APPOINTMENT.LOCATION'), class: "col-sm-3", field: "location.name"},
    { name: t('PATIENT.APPOINTMENT.STATUS'), class: "col-sm-2", field: "status.description"}
  ];

  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.APPOINTMENT.DATE'), field: 'date' }
  ];

  const [show, setShow] = useState(false);
  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);  
  const [total, setTotal] = useState<number>(0);  
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);  
  const [list, setList] = useState<any>([]);
  const [slotsList, setSlotsList] = useState<any>([]);
  const [slotBookedTime, setSlotBookedTime] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<number>(0);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [doctor, setDoctor] = useState<number>(0);
  const [location, setLocation] = useState<number>(0);
  const [apptype, setApptype] = useState<number>(0);
  const [appdate, setAppdate] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
    
  const initialFormData: AppointmentModel = { 
    "id": null,
    "patient_id": 0,
    "patients": [{
      value: 0,
      label: ''
    }],
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
    // const translatedFormElements = AppointmentFormElements.map(elements => elements.filter(element => element.name !== 'patients'))
 
    const translatedFormElements = AppointmentFormElements.map((element) => {
      // Ensure element exists and has a label before applying translation
      console.log('c Name', element.type);
      if (element.type !== "typeaheadDynamic") {
        return {
          ...element,
          label: t(`PATIENT.APPOINTMENT.${element.label}`),
        };
      }
      console.log('return element', element);
      // Return element as is if condition is not met
      return element;
    });

    // console.log('translatedFormElements Raj', translatedFormElements, 'subhu', AppointmentFormElements);
    setTranslatedElements(translatedFormElements);
    fetchAppointmentList(page);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();  
    setAppdate(yyyy+'-'+mm+'-'+dd);  
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
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
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
      showLoading();
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_FORMDATA, passData);
      if(response.success) {
        handleShow();
        if(response.data?.data?.id) {          
          const formData = response.data?.data;
          const patientData = {value: formData.patient.id, label: formData.patient.full_name, full_name: formData.patient.full_name, mrn_no: formData.patient.mrn_no, dob: formData.patient.dob}
          const updatedData = Object.assign({}, formData, { patients: [patientData] });
          setSlotBookedTime(formData.from_time+' - '+formData.to_time);
          setInitialValues(updatedData);
          setFormData(updatedData);
          setMode(true);
          setDoctor(formData.doctor_id);
          setLocation(formData.location_id);
          setApptype(formData.appointment_type_id);
          setAppdate(formData.date);
          getAvailableSlots(formData.doctor_id, formData.location_id, formData.appointment_type_id, formData.date);
        } else {
          let passData: any = { id: uuidToId(id) };
          const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
          const bindData = {value: response.data.data.id, label: response.data.data.full_name, full_name: response.data.data.full_name, mrn_no: response.data.data.mrn_no, dob: response.data.data.dob} 
          const updatedData = Object.assign({}, initialFormData, { patients: [bindData] });
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
        let appType = new Array;
        if(response.data.appointment_types) {
          response.data.appointment_types.map((app: any, a: number) => {
            appType.push({'label':app.name, 'value': app.id});
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
          else if(elements.name == 'encounter_id') {
            elements.options = [];
            elements.options = encounter;
          }
        })   
        setTimeout(() => {          
          const patientElement = document.querySelector(".patientName");
          if (patientElement) {            
            // patientElement.classList.add("d-none");            
          }
        }, 100);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
        hideLoading();
    }    
  }
  const handleShow = () => {
    setShow(true);   
  }
  const handleClose = () => {
      setShow(false);
      setMode(false);
      setActiveIndex(-1);
      setSlotsList([]);
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    console.log('formData', formData)
    // Implement your save logic here
    if (dynamicFormRefApp.current?.validateModelForm()) {
      try {
        if (formData.patients[0]?.value) {
          formData.patient_id = formData.patients[0].value
        }
        const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_STORE, formData);
        if(response.success) {
          handleShowToast(t('PATIENT.APPOINTMENT.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error creating an appointment:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRefApp);
      hideLoading();
    }
  };
  
  const handleTypeaheadInputChange = async (name: string, selected: any, label: string, isClicked: any = false) => {
    // console.log("🚀 ~ handleTypeaheadInputChange ~ isClicked:", name, selected,isClicked);
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
  const updateTypeaheadOptions = (apiData: Option[], appliedString: string, search_text: string|null = null, isClicked: any = false) => {
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

  // Function to handle form field changes
  const handleInputChange = (e:any) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;    
    if(name == 'doctor_id') {
        setDoctor(value);
        getAvailableSlots(value, location, apptype, appdate);
    }
    if(name == 'location_id') {
        setLocation(value);
        getAvailableSlots(doctor, value, apptype, appdate);
    }
    if(name == 'appointment_type_id') {
        setApptype(value);
        getAvailableSlots(doctor, location, value, appdate);
    }
    if(name == 'date') {
        setAppdate(value);
        getAvailableSlots(doctor, location, apptype, value);    
    }
      setFormData({ ...formData, [name]: value });
  }; 

  // Fetch available slots records from the API
  const getAvailableSlots = async (doctor: number, location: number, appType: number, appDate: string | null) => {   
    if (doctor && location && appType && appDate) {
      setSlotsList([]);
    try {
        let passData: string = JSON.stringify({ consultant_id: doctor, location_id: location, appointment_type_id: appType, date: appDate });
        const result = await execute_axios_post(ENDPOINTS.POST_AVAILABLE_SLOTS, passData);
        setSlotsList(result.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    } else {
      setSlotsList([]);
    }
  }; 

  // Fetch encounter records from the API
  const getPatientList = async () => {
    try {
      let passData: any = { id: uuidToId(id) };
      const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
      const bindData = {value: response.data.data.id, label: response.data.data.full_name, full_name: response.data.data.full_name, mrn_no: response.data.data.mrn_no, dob: response.data.data.dob}          
      return bindData;
    } catch (error) {
      setError('Error fetching patient data:');
    }
  };

  // Handle click on an <li> element
  const handleItemClick = (fromTime: string, toTime: string, index: number) => {
    setFormData({ ...formData, ['from_time']: getTimeFromDateTime(fromTime), ['to_time']: getTimeFromDateTime(toTime) });
    setActiveIndex(index); // Update the active index
  };

  // get time from start and end time of surgery
  const getTimeFromDateTime = (dateTime: string): string => {
    const date = new Date(dateTime.replace(" ", "T")); // Convert to valid Date format
    const hours = date.getHours().toString().padStart(2, "0"); // Get hours (HH)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes (mm)
    return `${hours}:${minutes}`; // Format as HH:mm
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
        ref={dynamicFormRefApp} // Pass ref to AppointmentForm
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
        fromSource={'Patients'}
        booked_slot_time={slotBookedTime}
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
