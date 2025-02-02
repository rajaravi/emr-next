import React, { useEffect, useState, useRef } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
// import MyBigCalendar from '@/components/core-components/BigCalendar';
import MyFullCalendar from '@/components/core-components/FullCalendarComponent';
import ENDPOINTS from '@/utils/constants/endpoints';
// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { AppointmentFormElements } from '@/data/AppointmentFormElements';
import { AppointmentModel } from '@/types/appointment';
import AppointmentForm from '../patient/[id]/appointment/form';
import { SurgeryFormElements } from '@/data/SurgeryFormElements';
import { SurgeryModel } from '@/types/surgery';
import SurgeryForm from '../patient/[id]/surgery/form';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

let pageLimit: number = 8;
let selectedID: number = 0;
let clickCount: number = 0;

// Calendar block
interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  resourceId?: string;
}

interface Resource {
  id: string;
  title: string;
  color?: string;
}

// Appointment block
const initialValueAppointment = {
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

// Surgery block
const initialValueSurgery = {  
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

// Translation logic - end
const Calendar = () => {
  // Common block
  const { t } = useTranslation('common');
  const { showLoading, hideLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [patientID, setPatientID] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<boolean>(false);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  // Calendar block
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [viewType, setViewType] = useState<string>('d-none');
  const [moduleType, setModuleType] = useState<number>(1);  
  const [key, setKey] = useState(0);

  // Appointment block
  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  const [translatedElementsApp, setTranslatedElementsApp] = useState<any>([]);
  const [initialValuesApp, setInitialValuesApp] = useState<any>(initialValueAppointment);
  const [selectedAppointment, setSelectedAppointment] = useState<number>(0);
  const [slotsList, setSlotsList] = useState<any>([]);
  const [slotBookedTime, setSlotBookedTime] = useState<string>('');
  const [doctor, setDoctor] = useState<number>(0);
  const [location, setLocation] = useState<number>(0);
  const [apptype, setApptype] = useState<number>(0);
  const [appdate, setAppdate] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const initialFormDataApp: AppointmentModel = { 
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
  const [formDataApp, setFormDataApp] = useState<AppointmentModel>(initialFormDataApp);

  // Surgery block  
  const dynamicFormRefSurg = useRef<DynamicFormHandle>(null);
  const [translatedElementsSurg, setTranslatedElementsSurg] = useState<any>([]);
  const [initialValuesSurg, setInitialValuesSurg] = useState<any>(initialValueSurgery);
  const [list, setList] = useState<any>([]);  
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedSurgery, setSelectedSurgery] = useState<number>(0);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [procedureList, setProcedureList] = useState<any>([]);
  const [clear, setClear] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | string>('');
  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('PATIENT.SURGERY.SNO'), class: "col-sm-1", field: "sno", format:''},
    { name: t('PATIENT.SURGERY.DATE'), class: "col-sm-2", field: "date", format:'date'},
    { name: t('PATIENT.SURGERY.DOCTOR'), class: "col-sm-3", field: "doctor.name", format:''},
    { name: t('PATIENT.SURGERY.LOCATION'), class: "col-sm-4", field: "location.name", format:''},
    { name: t('PATIENT.SURGERY.STATUS'), class: "col-sm-2", field: "status.description", format:''},    
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.PATIENT'), field: 'patient_id' }
  ];
  const initialFormDataSurg: SurgeryModel = {
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
  const [formDataSurg, setFormDataSurg] = useState<SurgeryModel>(initialFormDataSurg);

  /****** Common function *******/
  // Fetch events and resources from API
  useEffect(() => {
    showLoading();
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();  
    const fetchData = async () => {
      try {
        let passData: string = JSON.stringify({ month: mm, year: ""+yyyy+"" });
        const response = await execute_axios_post(ENDPOINTS.POST_MONTH_SLOTS, passData);
        const formattedEvents = response.data.map((event: { count: number; date: any; }) => ({        
          title: event.count,
          start: event.date,
          end: event.date
        }));
        setEvents(formattedEvents);
      } catch (error) {
        setError('Error fetching calendar data:');
      } finally {
        hideLoading();
      }
    };
    fetchData();
    
    // Appointment form labels
    const translatedFormElementsApp = AppointmentFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.APPOINTMENT.'+element.label)
    })); 
    setTranslatedElementsApp(translatedFormElementsApp); 
    
    // Surgery form labels
    const translatedFormElementsSurg = SurgeryFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.SURGERY.'+element.label)
    })); 
    setTranslatedElementsSurg(translatedFormElementsSurg);
    
    // Set current date for Appointment form - appointment date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();  
    setAppdate(yyyy+'-'+mm+'-'+dd);
  }, []);

  const handleFormOpen = (formType: 'Appointment' | 'Surgery') => {
    if(formType === 'Appointment') {
      getAppointmentId('add');
      setFormDataApp(initialFormDataApp);
    }
    else {
      getSurgeryById('add');      
      setFormDataSurg(initialFormDataSurg);
    }
    handleShow();
  };

  const handleShow = () => {
    setShow(true);
  }
  
  const handleClose = () => {
    setShow(false);    
    setMode(false);
    setActiveIndex(-1);
  }

  // Fetch encounter records from the API
  const getEncounterList = async (moduleType:string) => {
    try {
        let passData: string = JSON.stringify({ patient_id: patientID });
        const result = await execute_axios_post(ENDPOINTS.GET_ENCOUNTER_LIST, passData);
        let encounter = new Array;
        if(result.data) {
          result.data.map((enc: any, e: number) => {
            encounter.push({'label':enc.name, 'value': enc.id});
          })
        }
        if(moduleType === 'Apoointment') {
          translatedElementsApp.map((elements: any, k: number) => {
            if(elements.name == 'episode_id') {
              elements.options = [];
              elements.options = encounter;
            }          
          })        
        }
        if(moduleType === 'Surgery') {
          translatedElementsSurg.map((elements: any, k: number) => {
            if(elements.name == 'episode_id') {
              elements.options = [];
              elements.options = encounter;
            }          
          })        
        }           
    } catch (error) {
        console.error("Error fetching records:", error);
    }
  };
  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  // get time from start and end time of surgery
  const getTimeFromDateTime = (dateTime: string): string => {
    const date = new Date(dateTime.replace(" ", "T")); // Convert to valid Date format
    const hours = date.getHours().toString().padStart(2, "0"); // Get hours (HH)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes (mm)
    return `${hours}:${minutes}`; // Format as HH:mm
  };
  

  /****** Calendar function *******/
  // Month view events API
  const fetchMonthViewEvents = async(sDate: string, eDate: string) => {
    try {
      let splitDate = eDate.split('-');
      let passData: string = JSON.stringify({ month: splitDate[1], year: ""+splitDate[0]+"" });
      const response = await execute_axios_post(ENDPOINTS.POST_MONTH_SLOTS, passData);        
      const formattedEvents = response.data.map((event: { count: number; date: any; }) => ({        
        title: event.count,
        start: event.date,
        end: event.date
      }));
      setEvents(formattedEvents);      
    } catch (error) {
      setError('Error fetching month view events:');
    } finally {
      hideLoading();
    }    
  };

  // Week view events API
  const fetchWeekViewEvents = async(sDate: string, eDate: string) => {
    try {
      let passData: string = JSON.stringify({ date: sDate.split('T')[0] });
      const response = await execute_axios_post(ENDPOINTS.POST_WEEK_SLOTS, passData);
      setEvents(response.data.events);
      const formattedResources = response.data.resources.map((event: { id: number; name: string; color: string }) => ({        
        id: event.id,
        title: event.name,        
        color: event.color
      }));
      setResources(formattedResources);      
    } catch (error) {
      setError('Error fetching month view events:');
    } finally {
      hideLoading();
    }    
  };
  
  // Day view events API
  const fetchDayViewEvents = async(sDate: string, eDate: string) => {
    try {
      alert(eDate);
      let passData: string = JSON.stringify({ date: eDate.split('T')[0] });
      const response = await execute_axios_post(ENDPOINTS.POST_DAY_SLOTS, passData);
      setEvents(response.data.events);
      const formattedResources = response.data.resources.map((event: { id: number; name: string; color: string }) => ({        
        id: event.id,
        title: event.name,        
        color: event.color
      }));
      setResources(formattedResources);      
    } catch (error) {
      setError('Error fetching month view events:');
    } finally {
      hideLoading();
    }    
  };

  // Handle view change
  const handleViewChange = (view: any) => {
    showLoading();
    if (view.type === 'dayGridMonth') {
      const start = view.currentStart.toISOString().split('T')[0];
      const end = view.currentEnd.toISOString().split('T')[0];
      fetchMonthViewEvents(start, end);
      setViewType('d-none');
    } else if (view.type === 'timeGridWeek') {      
      const end = view.activeEnd.toISOString().split('T')[0];
      let startDate: Date = new Date(view.activeStart);
      startDate.setDate(startDate.getDate() + 1);
      const start = startDate.toISOString().split('T')[0];
      fetchWeekViewEvents(start , end);
      setViewType('d-none');
    } else if (view.type === 'resourceTimeGridDay') {
      const start = view.activeStart.toISOString().split('T')[0];
      const end = view.activeEnd.toISOString().split('T')[0];
      setSelectedDate(end);
      fetchDayViewEvents(start, end);
      setViewType('');
    }    
  };

  const showAppointment = () => {
    setModuleType(1);
  }

  const showSurgery = async() => {
    setModuleType(2);
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, date: selectedDate });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load surgery data.');
    } finally {
      hideLoading();
    }
  }

  /****** Appointment function *******/

  const handleTypeaheadInputChangeApp = async (name: string, selected: any, label: string, isClicked: any = false) => {    
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        const typeahead = translatedElementsApp.map((field: { type: string; name: string }) => {
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
          updateTypeaheadOptionsApp(formData, selected, name);
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {
          // setLoading(false);
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }

      } else {        
        // setFormData({ ...formData, [name]: name });
      }
    } else {
      setFormReset(false); // block form reset      
      setFormDataApp({ ...formDataApp, ['patients']: selected });
    }  
  };

  const updateTypeaheadOptionsApp = (apiData: Option[], appliedString: string, search_text: string|null = null, isClicked: any = false) => {
    const updatedConfig = translatedElementsApp.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {
        if (initialValuesApp.id > 0 && search_text) {
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
    setTranslatedElementsApp(updatedConfig);    
    getEncounterList('Appointment');
  };

  // Get form data by Id
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
          const formDataApp = response.data?.data;
          let fromTime = getTimeFromDateTime(formDataApp.from_time);
          let toTime = getTimeFromDateTime(formDataApp.to_time);
          const patientData = {value: formDataApp.patient.id, label: formDataApp.patient.full_name,
            full_name: formDataApp.patient.full_name, mrn_no: formDataApp.patient.mrn_no, dob: formDataApp.patient.dob}
          const updatedData = Object.assign({}, formDataApp, { patients: [patientData] });
          setSlotBookedTime(fromTime+' - '+toTime);     
          setInitialValuesApp(updatedData);
          setFormDataApp(updatedData);
          setMode(true);
          setDoctor(formDataApp.doctor_id);
          setLocation(formDataApp.location_id);
          setApptype(formDataApp.appointment_type_id);
          setAppdate(formDataApp.date);
          getAvailableSlots(formDataApp.doctor_id, formDataApp.location_id, formDataApp.appointment_type_id, formDataApp.date);
        } else {
          setFormDataApp(initialFormDataApp);
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

        // Dynamic values options format
        translatedElementsApp.map((elements: any, k: number) => {
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
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
        hideLoading();
    }    
  }

  // Save button handler
  const handleSaveAppointment = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRefApp.current?.validateModelForm()) {
      try {
        if (formDataApp.patients[0]?.value) {
          formDataApp.patient_id = formDataApp.patients[0].value
        }        
        const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_STORE, formDataApp);
        if(response.success) {
          handleShowToast(t('PATIENT.APPOINTMENT.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error creating an appointment:', error);
      } finally {
          hideLoading();
          refreshCalendar();
      }
    } else {
      console.log('Form is invalid', dynamicFormRefApp);
      hideLoading();
    }
  };

   // Edit action call
   const handleEditAppointment = () => {
    if(selectedAppointment == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    } else {
      getAppointmentId('edit');
    }    
  } 

  const handleEventClick = (clickInfo:any) => {
    const event = clickInfo.event;
    clickCount++;
    let appt_id = event.extendedProps.appt_id ? event.extendedProps.appt_id : 0;
    setTimeout(() => {
      if (clickCount === 1) {
        setSelectedAppointment(appt_id);  
      } else if (clickCount === 2) {
        if(appt_id !== 0) {          
          setSelectedAppointment(appt_id);
          getAppointmentId('edit');
        }
        else {
          handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
          return false;
        }
      }
      clickCount = 0;
    }, 300);    
  }
  

  // Handle click on an <li> element
  const handleItemClick = (fromTime: string, toTime: string, index: number) => {
    setFormDataApp({ ...formDataApp, ['from_time']: fromTime, ['to_time']: toTime });
    setActiveIndex(index); // Update the active index
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
      setFormDataApp({ ...formDataApp, [name]: value });
  }; 

  // Fetch available slots records from the API
  const getAvailableSlots = async (doctor: number, location: number, apptype: number, appdate: string | null) => {   
    if (doctor && location && apptype && appdate) {
      setSlotsList([]);
    try {
        let passData: string = JSON.stringify({ consultant_id: doctor, location_id: location, appointment_type_id: apptype, date: appdate });
        const result = await execute_axios_post(ENDPOINTS.POST_AVAILABLE_SLOTS, passData);
        setSlotsList(result.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }
    else {
      setSlotsList([]);
    }
  }; 

  // Callback function form save to list refresh
  const refreshCalendar = async() => {
    let currentDate = selectedDate.toLocaleString()
    fetchDayViewEvents(currentDate, currentDate);    
  } 

  /****** Surgery function *******/
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
        setClear(true);
    }
  }
  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
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
    setPage(currentPage);
  }
  // Function to handle form field changes
  const handleInputChangeSurgery = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;

    if (index !== undefined) {
      const updateProcedure = [...formDataSurg.surgery_details];
      updateProcedure[index] = {
        ...updateProcedure[index], [name]: value
      };

      const updatedFormData = { ...formDataSurg, surgery_details: updateProcedure };
      setFormDataSurg(updatedFormData);
    } else {
      setFormDataSurg({ ...formDataSurg, [name]: value });
    }
  };
  // Date navigation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    setSelectedDate(value);
    getSurgeryList(value);
  }

  const handleTypeaheadInputChangeSurgery = async (name: string, selected: any, label: string, isClicked: any = false) => {
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        try {
          let passData: string = JSON.stringify({ search: name, search_type: 1 });
          const response = await execute_axios_post('/patient/get-list', passData); // Replace with your actual API endpoint
          const formDataSurg = response.data.map((patient: { id: any; full_name: string; dob: string, mrn_no: string }) => ({
            value: patient.id, // default mandatory typeahead property: value
            label: patient.full_name, // default mandatory typeahead property: label            
            full_name: patient.full_name,
            mrn_no: patient.mrn_no,
            dob: patient.dob            
          }))
          updateTypeaheadOptionsSurg(formDataSurg, selected);          
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }
      } else {
        updateTypeaheadOptionsSurg([], ''); // reset the values
      }
    } else {
      setFormReset(false); // block form reset
      setFormDataSurg({ ...formDataSurg, [name]: selected });
    }  
  };
  
  // Function to update options in form config
  const updateTypeaheadOptionsSurg = (apiData: Option[], appliedString: string, search_text: string|null = null, isClicked: any = false) => {    
    const updatedConfig = translatedElementsSurg.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {        
        if (initialValuesSurg.id > 0 && search_text) {
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
    setTranslatedElementsSurg(updatedConfig);    
    getEncounterList('Surgery');
  };
  // Function to add a new reference row
  const handleAddPurchaser = () => {
    const newProcedure = { procedure_id: 0 };
    setFormDataSurg({
      ...formDataSurg,
      surgery_details: [...formDataSurg.surgery_details, newProcedure],
    });
  };
  // Function to remove a reference row
  const handleRemoveProcedure = (index: number) => {
    const updateProcedure = formDataSurg.surgery_details.filter((_, i) => i !== index);    
    const updatedFormData = { ...formDataSurg, surgery_details: updateProcedure };
    setFormDataSurg(updatedFormData);
  };
  // Get form data by id
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
            let fromTime = getTimeFromDateTime(formData.from_time);
            let toTime = getTimeFromDateTime(formData.to_time);
            const patientData = {value: formData.patient.id, label: formData.patient.full_name,
              full_name: formData.patient.full_name, mrn_no: formData.patient.mrn_no, dob: formData.patient.dob}
            const updatedData = Object.assign({}, formData, { patients: [patientData], from_time: fromTime, to_time: toTime });
            setInitialValuesSurg(updatedData);
            setFormDataSurg(updatedData);
            setMode(true);          
          }
          else {
            setFormDataSurg(initialFormDataSurg);
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
          fetchProcedureList();          
          // Dynamic values options format
          translatedElementsSurg.map((elements: any, k: number) => {
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
          })        
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
  }
  // Save button handler
  const handleSaveSurgery = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRefSurg.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_STORE, formDataSurg);
        if(response.success) {
          handleShowToast(t('PATIENT.SURGERY.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
          hideLoading();
      }
      // setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRefSurg);
      hideLoading();
    }
  };

  const prevDay = () => {
    let prevDate: Date = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);    
    setSelectedDate(prevDate.toISOString().split('T')[0]);
    getSurgeryList(prevDate.toISOString().split('T')[0]);
  }
  const nextDay = () => {
    let nextDate: Date = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);    
    setSelectedDate(nextDate.toISOString().split('T')[0]);
    getSurgeryList(nextDate.toISOString().split('T')[0]);
  }

  const getSurgeryList = async(sDate: string) => {
    setModuleType(2);
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, date: sDate });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load surgery data.');
    } finally {
      hideLoading();
    }
  }

  // Get procedure list
  const fetchProcedureList = async () => {
    try {
      const response = await execute_axios_post(ENDPOINTS.GET_PROCEDURE_LIST, []);
      setProcedureList(response.data);
    } catch (err) {
      setError('Failed to load purchaser data.');
    }
  };

  return (
    <div className='container-fluid pt-60'>
      <div className='row mt-1'>
        <div className={`${viewType} col-3 mt-2 text-start tabType`}>
          <Button className={`${(moduleType === 1) ? `active` : ''} me-1 rounded-0`} onClick={showAppointment}>Appointment</Button>
          <Button className={`${(moduleType === 2) ? `active` : ''} rounded-0`} onClick={showSurgery}>Surgery</Button>         
        </div>        
        <div className={`${viewType} cal-actions`}>
          <div className={(moduleType === 1) ? '' : 'd-none'}>
            <Button variant='primary' className='btn rounded-0' onClick={() => handleFormOpen('Appointment')}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDAPPOINTMENT')}</Button>
            <Dropdown >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
                {t('ACTIONS.ACTIONS')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditAppointment}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className={(moduleType === 2) ? '' : 'd-none'}>
            <Button variant='primary' className='btn rounded-0' onClick={() => handleFormOpen('Surgery')}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDSURGERY')}</Button>
            <Dropdown >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
                {t('ACTIONS.ACTIONS')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>          
        </div>
      </div> 
      <div className={(moduleType === 1) ? '' : 'd-none'}>
        <MyFullCalendar 
          key={key}
          viewType={viewType}
          resources={resources}
          events={events}
          handleViewChange={handleViewChange}
          handleEventClick={handleEventClick}
        />
      </div>      
      <div className={(moduleType === 2) ? 'mt-3' : 'd-none'}>
        <Row className="white-bg p-1 m-0 top-bottom-shadow ">        
          <Col xs={3}>
            <Row className='m-0'>
              <button className='btn btn-light rounded-0 col-sm-2 float-start mt-3' onClick={prevDay}><i className="fi fi-ss-angle-circle-left"></i> </button>
              <input 
                type="date"
                name="surgery_date"
                value={selectedDate}   
                className="form-control rounded-0 mt-3 col-sm-8 float-start"
                onChange={handleDateChange}
                style={{ width: '40%' }}
              />           
              <button className='btn btn-light rounded-0 col-sm-2 float-start mt-3' onClick={nextDay}>&nbsp;<i className="fi fi-ss-angle-circle-right"></i></button>
            </Row>          
          </Col>
          <Col xs={4}></Col>
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
      { (moduleType === 1) ? (
        <AppointmentForm 
          ref={dynamicFormRefApp} // Pass ref to AppointmentForm
          formLabels={translatedElementsApp}
          initialValues={initialValuesApp}
          slotsList={slotsList}
          editID = {selectedAppointment}
          refreshForm={refreshCalendar}
          show={show}
          mode={mode}
          handleClose={handleClose}
          handleTypeaheadInputChange={handleTypeaheadInputChangeApp}
          handleInputChange={handleInputChange}
          handleSave={handleSaveAppointment}
          handleItemClick={handleItemClick}
          formReset={formReset}
          activeIndex={activeIndex}
          fromSource={'CalendarAppt'}
          booked_slot_time={slotBookedTime}
        />
        )
      : (
        <SurgeryForm
          ref={dynamicFormRefSurg} // Pass ref to SurgeryForm
          formLabels={translatedElementsSurg} 
          initialValues={initialValuesSurg}        
          editID = {selectedSurgery}
          refreshForm={refreshForm}
          show={show}
          mode={mode}
          formCurData={formDataSurg}
          procedureList={procedureList}
          handleClose={handleClose}
          createPurchaser={handleAddPurchaser}
          deleteProcedure={handleRemoveProcedure}
          handleTypeaheadInputChange={handleTypeaheadInputChangeSurgery}
          handleInputChange={handleInputChangeSurgery}
          handleSave={handleSaveSurgery}
          formReset={formReset}
          fromSource={'CalendarSurg'}
        />
        )  
      }
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Calendar;
