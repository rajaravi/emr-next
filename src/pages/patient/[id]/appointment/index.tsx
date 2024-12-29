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
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
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

interface Record {
  id: number;
  full_name: string;
  mrn_no: string;
  dob: string;
}

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  patient_id: 0,
  episode_id: 0,
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
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('PATIENT.APPOINTMENT.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.APPOINTMENT.APPOINTMENT_TYPE'), class: "col-sm-3", field: "type_id"},
    { name: t('PATIENT.APPOINTMENT.DOCTOR'), class: "col-sm-3", field: "doctor_id"},
    { name: t('PATIENT.APPOINTMENT.LOCATION'), class: "col-sm-3", field: "location_id"},
    { name: t('PATIENT.APPOINTMENT.STATUS'), class: "col-sm-2", field: "status_id"}
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
  const [encounterList, setEncounterList] = useState<any>([]);
  const [doctorList, setDoctorList] = useState<any>([]);
  const [locationList, setLocationList] = useState<any>([]);
  const [typeList, setTypeList] = useState<any>([]);  
  const [statusList, setStatusList] = useState<any>([]);
  const [slotsList, setSlotsList] = useState<any>([]);  
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [slotsData, setSlotsData] = useState<any>([]);  
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Record[]>([]);  
  const [selectedId, setSelectedId] = useState<number>();
  const [isResultSelected, setIsResultSelected] = useState<boolean>(false);

  const [field1, setField1] = useState<string | null>(null); // First field
  const [field2, setField2] = useState<string | null>(null); // Second field
  const [field3, setField3] = useState<string | null>(null); // Third field
  const [field4, setField4] = useState<string | null>(null); // Third field
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedFromTime, setSelectedFromTime] = useState<string | null>("");
  

  const MIN_CHARACTERS = 3;
  const initialFormData: AppointmentModel = {
    "id": null,
    "patient_id": 0,
    "episode_id": 0,
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
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  // Onload function
  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = AppointmentFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.APPOINTMENT.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    getEncounterList();
    fetchAppointmentList(page);
  }, []);

  // Get doctor list
  const fetchAppointmentList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
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
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target; 

    if(name == 'patient_name') {
      setQuery(value);
      setSelectedId(""); 
      setIsResultSelected(false); 
  
      if (value.length >= MIN_CHARACTERS) {
        fetchPatients(value); // Fetch records when query length >= 3        
      } else {
        setResults([]); // Clear results if query length < 3
        setEncounterList([]);
      }
    }
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

  // Get form data
  const getAppointmentId = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedAppointment;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
        setDoctorList(response.data.doctors);
        setLocationList(response.data.locations);
        setTypeList(response.data.appointment_types);
        setStatusList(response.data.status_list);
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
  }

  // Save button handler
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    // const formData = new FormData(); // Create FormData object
    // formData.append("patient_id", selectedId); // Append the hidden value

    console.log("🚀 ~ handleSubmit ~ formValues:", formData)
    showLoading();
    // Implement your save logic here

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
      handleClose(); // Close offcanvas after saving
      setFormData(initialFormData);
   
  };

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

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Fetch patient records from the API
  const fetchPatients = async (searchTerm: string) => {
    try {
      let passData: string = JSON.stringify({ search: searchTerm, search_type: 1 });
      const result = await execute_axios_post(ENDPOINTS.POST_PATIENT_GETLIST, passData);
      setResults(result.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Handle record click
  const handleRecordClick = (record: Record) => {    
    setQuery(record.full_name); // Update the input box
    setSelectedId(record.id);
    setFormData({ ...formData, ['patient_id']: record.id });
    setResults([]); // Clear the results    
    setIsResultSelected(true);    
  };

  // Fetch encounter records from the API
  const getEncounterList = async () => {
    try {
      let passData: string = JSON.stringify({ patient_id: uuidToId(id) });
      const result = await execute_axios_post(ENDPOINTS.GET_ENCOUNTER_LIST, passData);      
      setEncounterList(result.data);            
    } catch (error) {
      console.error("Error fetching records:", error);
    }
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
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('PATIENT.APPOINTMENT.EDIT_TITLE') : t('PATIENT.APPOINTMENT.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="75%">
        <form onSubmit={handleSave} className="container-fluid">
          <Row>
            <Col className='col-sm-8 p-0'>
              <Row>
                <Col xs={6} className={`${id ? '' : ''} mb-3`}>
                  <label className='form-label'>
                    <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.PATIENT')} {uuidToId(id)}
                  </label>
                  <Form.Control
                    type="text"
                    name="patient_name"
                    value={query}   
                    className="form-control rounded-0"
                    placeholder="Type to search (min 3 characters)"
                    onChange={handleInputChange}
                    autoComplete='off'
                  />                  
                  {query.length >= MIN_CHARACTERS && results.length > 0 && (
                    <table
                      className='autoCompleteTable'
                      style={{
                        width: "500px",
                        borderCollapse: "collapse",
                        marginTop: "0px",
                        position: 'absolute',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <thead>
                        <tr>
                          <th width="5%" style={tableHeaderStyle} className='d-none'>ID</th>
                          <th width="50%" style={tableHeaderStyle}>Name</th>
                          <th width="25%" style={tableHeaderStyle}>MRN</th>
                          <th width="20%" style={tableHeaderStyle}>DOB</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((record) => (
                          <tr
                            key={record.id}
                            onClick={() => handleRecordClick(record)}
                            style={{ cursor: "pointer" }}
                          >
                            <td style={tableCellStyle} className='d-none'>{record.id}</td>
                            <td style={tableCellStyle}>{record.full_name}</td>
                            <td style={tableCellStyle}>{record.mrn_no}</td>
                            <td style={tableCellStyle}>{formatDate(record.dob)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.EPISODE')}</label>
                  <Form.Select
                    name="episode_id"
                    id="episode_id"
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {encounterList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.DOCTOR')}</label>
                  <Form.Select
                    name="doctor_id"
                    id="doctor_id"
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {doctorList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.LOCATION')}</label>
                  <Form.Select
                    name="location_id"
                    id="location_id"
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {locationList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.APPOINTMENT_TYPE')}</label>
                  <Form.Select
                    name="appointment_type_id"
                    id="appointment_type_id"
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {typeList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.DATE')}</label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    className="form-control rounded-0"                    
                    onChange={handleInputChange}                    
                  />
                </Col>
                <Col xs={12} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.NOTES')}</label>
                  <Form.Control
                    as="textarea"                    
                    name="notes"
                    className="form-control rounded-0"                    
                    onChange={handleInputChange}                    
                  />
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.STATUS')}</label>
                  <Form.Select
                    name="status_id"
                    id="status_id"
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {statusList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.description}</option>
                      ))}
                  </Form.Select>
                </Col>
              </Row>
            </Col>
            <Col className='col-sm-4'> 
              <ul className='timeSlots'>
                {slotsList.map((record:any, index:number) => (
                  <li
                    key={index}
                    onClick={() => handleItemClick(record.start, record.end, index)}
                    style={{
                      marginBottom: "5px",
                      cursor: "pointer",
                      backgroundColor: activeIndex === index ? "#007BFF" : "#f4f4f4", // Change background for active <li>
                      color: activeIndex === index ? "#fff" : "#000", // Change text color for active <li>
                    }}
                  >
                    {record.start.substr(11, 5)} - {record.end.substr(11, 5)}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>          
        </form>
        {/* <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/> */}

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

// Styles for table headers and cells
const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f9f9f9",
};

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "10px",
};
export default Appointment;
