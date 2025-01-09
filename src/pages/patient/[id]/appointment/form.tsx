import React, { FC, useEffect, useRef, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from '_style.module.css';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import { uuidToId } from '@/utils/helpers/uuid';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import ToastNotification from '@/components/core-components/ToastNotification';
import { AppointmentFormElements } from '@/data/AppointmentFormElements';
import { AppointmentModel } from '@/types/appointment';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

interface AppointmentProps {
    refreshForm: (event: any) => void;
    formLabels: [];
    isEditMode: boolean;
    editID: number;
    page: number;
    show: boolean;
    mode: boolean;
    handleClose: (event: any) => void;
}

interface Record {
    id: number;
    full_name: string;
    mrn_no: string;
    dob: string;
}
const MIN_CHARACTERS = 3;

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
  
  const AppointmentForm: React.FC<AppointmentProps> = ({refreshForm, formLabels, isEditMode, editID, page, show, mode, handleClose}) => {
    const { showLoading, hideLoading } = useLoading();
       
    const { t } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const [formReset, setFormReset] = useState(false);
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Record[]>([]);  
    const [encounterList, setEncounterList] = useState<any>([]);
    const [doctorList, setDoctorList] = useState<any>([]);
    const [locationList, setLocationList] = useState<any>([]);
    const [typeList, setTypeList] = useState<any>([]);  
    const [statusList, setStatusList] = useState<any>([]);
    const [slotsList, setSlotsList] = useState<any>([]);
    const [selectedId, setSelectedId] = useState<number>();
    const [isResultSelected, setIsResultSelected] = useState<boolean>(false);
    const [slotBookedTime, setSlotBookedTime] = useState<string | null>(null);  
    const [selectedAppointment, setSelectedAppointment] = useState<number>(0);    
    const [initialValues, setInitialValues] = useState<any>(initialValue);
    const [field1, setField1] = useState<string | null>(null); // First field
    const [field2, setField2] = useState<string | null>(null); // Second field
    const [field3, setField3] = useState<string | null>(null); // Third field
    const [field4, setField4] = useState<string | null>(null); // Third field
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedFromTime, setSelectedFromTime] = useState<string | null>("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
    const dynamicFormRef = useRef<DynamicFormHandle>(null);

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
        const fetchData = async () => {
            try {
                let passData: string = JSON.stringify({ id: editID });
                const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_FORMDATA, passData);
                if(response.success) {        
                    if(response.data?.data?.id) {
                        setFormData(response.data.data);          
                        getAvailableSlots(response.data.data.doctor_id , response.data.data.location_id, response.data.data.appointment_type_id, response.data.data.date);
                        setSlotBookedTime(response.data.data.from_time);
                    }
                    else {
                        setFormData(initialFormData);
                    }
                    setDoctorList(response.data.doctors);
                    setLocationList(response.data.locations);
                    setTypeList(response.data.appointment_types);
                    setStatusList(response.data.status_list);
                    setActiveIndex(-1);
                }
            } catch (error: any) {
                console.error('Error on fetching doctor details:', error);
            }
        }
        fetchData();
        getEncounterList();        
    }, []);
    
    // Save button handler
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {    
        e.preventDefault();
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
            refreshForm(page);
        }
        setFormData(initialFormData);
    };

    // Toast message call
    const handleShowToast = (message: string, color: typeof toastColor) => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };
    // Function to handle form field changes
    const handleInputChange = (e:any) => {
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

    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };


    return (
    <>
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
                <Col xs={6} className={`${id ? 'd-none1' : ''} mb-3`}>
                  <label className='form-label'>
                    <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.PATIENT')}
                  </label>
                  <Form.Control
                    type="text"
                    name="patient_name"
                    value={query}   
                    className="form-control rounded-0"                    
                    onChange={handleInputChange}
                    autoComplete='off'
                    placeholder="Type to search (min 3 characters)"
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
                          <th style={tableHeaderStyle} className='col-2 d-none'>ID</th>
                          <th style={tableHeaderStyle} className='col-6'>Name</th>
                          <th style={tableHeaderStyle} className='col-2'>MRN</th>
                          <th style={tableHeaderStyle} className='col-2'>DOB</th>
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
                    name="encounter_id"
                    id="encounter_id"
                    value={formData?.encounter_id}
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {encounterList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'> <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.DOCTOR')}</label>
                  <Form.Select
                    name="doctor_id"
                    id="doctor_id"
                    value={formData?.doctor_id}
                    className="rounded-0"                    
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {doctorList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                    
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'> <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.LOCATION')}</label>
                  <Form.Select
                    name="location_id"
                    id="location_id"
                    value={formData?.location_id}
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {locationList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'><span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.APPOINTMENT_TYPE')}</label>
                  <Form.Select
                    name="appointment_type_id"
                    id="appointment_type_id"
                    value={formData?.appointment_type_id}
                    className="rounded-0"              
                    onChange={handleInputChange}>
                      <option value="">Select...</option>
                      {typeList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'> <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.DATE')}</label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData?.date}
                    className="form-control rounded-0"                    
                    onChange={handleInputChange}
                    required      
                  />
                </Col>                
                <Col xs={3} className={`${mode ? '' : 'd-none'} mb-3`}>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.START_TIME')}</label>
                  <Form.Control
                    type="text"
                    name="from_time"
                    value={formData.from_time.substr(11, 5)}
                    className="form-control rounded-0 disabled"                  
                  />
                </Col>
                <Col xs={3} className={`${mode ? '' : 'd-none'} mb-3`}>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.END_TIME')}</label>
                  <Form.Control
                    type="text"
                    name="to_time"
                    value={formData.to_time.substr(11, 5)}
                    className="form-control rounded-0 disabled"                  
                  />
                </Col>
                <Col xs={12} className='mb-3'>
                  <label className='form-label'>{t('PATIENT.APPOINTMENT.NOTES')}</label>
                  <Form.Control
                    as="textarea"                    
                    name="notes"
                    value={formData?.notes}
                    className="form-control rounded-0"                    
                    onChange={handleInputChange}                    
                  />
                </Col>
                <Col xs={6} className='mb-3'>
                  <label className='form-label'> <span className="text-danger">*</span> {t('PATIENT.APPOINTMENT.STATUS')}</label>
                  <Form.Select
                    name="status_id"
                    id="status_id"
                    value={formData?.status_id}
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
      </OffcanvasComponent>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </>
    )
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
export default AppointmentForm;