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
import { SurgeryFormElements } from '@/data/SurgeryFormElements';
import { SurgeryModel } from '@/types/surgery';
import SurgeryForm from '../patient/[id]/surgery/form';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

let pageLimit: number = 8;
let selectedID: number = 0;

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

// Translation logic - end
const Calendar = () => {
  const { t } = useTranslation('common');
  const { showLoading, hideLoading } = useLoading();  
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<string>('d-none');
  const [moduleType, setModuleType] = useState<number>(1);
  const [patientID, setPatientID] = useState<number>(0);
  const dynamicFormRef = useRef<DynamicFormHandle>(null);  
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
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<boolean>(false);  
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [encounterList, setEncounterList] = useState<any>([]);  
  const [procedureList, setProcedureList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [selectedSurgery, setSelectedSurgery] = useState<number>(0);
  const [formReset, setFormReset] = useState(false);
  const [clear, setClear] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | string>();

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

    const translatedFormElements = SurgeryFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.SURGERY.'+element.label)
    })); 
    setTranslatedElements(translatedFormElements);
  }, []);

  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

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

  // Day view events API
  const fetchDayOrWeekViewEvents = async(sDate: string, eDate: string) => {
    try {
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
      const start = view.activeStart.toISOString().split('T')[0];
      const end = view.activeEnd.toISOString().split('T')[0];
      fetchDayOrWeekViewEvents(start, end);
      setViewType('d-none');
    } else if (view.type === 'resourceTimeGridDay') {
      const start = view.activeStart.toISOString().split('T')[0];
      const end = view.activeEnd.toISOString().split('T')[0];
      setSelectedDate(end);
      fetchDayOrWeekViewEvents(start, end);
      setViewType('');
    }    
  };

  const showAppointment = () => {
    setModuleType(1);
  }

  const showSurgery = async(sDate: string) => {
    setModuleType(2);
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: { date: selectedDate} });
      const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load surgery data.');
    } finally {
      hideLoading();
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
        setsearchFilter(sFilter);
        // fetchDoctorList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    // fetchDoctorList(1);
    setClear(false);
  }

  // List double click
  const surgeryDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      // setSelectedDoctor(selectedID);
    }
    // getDoctorById('edit');
  }

  // List single click
  const surgeryClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    // setSelectedDoctor(selectedID);
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
    // setSelectedDoctor(0);
    setPage(currentPage);
    // fetchDoctorList(currentPage, searchFilter);
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    setSelectedDate(value);
    getSurgeryList(value);
  }
  

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
          console.log('sds',formData, selected);
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
    console.log('apiData',apiData);
    console.log('appliedString',translatedElements);
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
        setEncounterList(result.data);            
    } catch (error) {
        console.error("Error fetching records:", error);
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

  const getSurgeryById = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedSurgery;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_FORMDATA, passData);
      if(response.success) {        
          handleShow();
          if(response.data?.data?.id) {
            setFormData(response.data.data);                  
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
          // setProcedureList(response.data.procedures);
          fetchProcedureList();
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
          })        
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
  }

  const createSurgery = () => {
    getSurgeryById('add');
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    alert('sdf');
    console.log('formData', formData);
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_SURGERY_STORE, formData);
        console.log(response);
        // handleShowToast(t('SETTING.PROCEDURE.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
          hideLoading();
      }
      // setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

  const getDate = (e:any) => {
    console.log(e)
    // setSelectedDate(selectedDate);
  }

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
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: { date: sDate} });
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
      <div className='row'>
        <div className='col-2'>
          <h1 className='mt-3'>Calendar </h1>
        </div> 
        <div className={`${viewType} col-3 mt-3 text-start`}>
          <Button variant="info" className='me-1 rounded-0' onClick={showAppointment}>Appointment</Button>
          <Button variant="warning" className='rounded-0' onClick={showSurgery}>Surgery</Button>         
        </div>        
        <div className={`${viewType} cal-actions`}>
          <div className={(moduleType === 1) ? '' : 'd-none'}>
            <Button variant='primary' className='btn rounded-0'><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDAPPOINTMENT')}</Button>
            <Dropdown >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
                {t('ACTIONS.ACTIONS')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className={(moduleType === 2) ? '' : 'd-none'}>
            <Button variant='primary' className='btn rounded-0' onClick={createSurgery}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDSURGERY')}</Button>
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
          viewType={viewType}
          resources={resources}
          events={events}
          handleViewChange={handleViewChange}
          selectDate={getDate}
        />
      </div>
      <div className={(moduleType === 2) ? 'mt-3' : 'd-none'}>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">        
        <Col xs={4}>
          <Row className='m-0'>
            <button className='btn btn-light rounded-0 col-sm-3 float-start mt-3 text-primary' onClick={prevDay}><i className="fi fi-ss-angle-circle-left"></i> Previous </button>
            <input 
              type="date"
              name="surgery_date"
              value={selectedDate}   
              className="form-control rounded-0 mt-3 col-sm-6 float-start"
              onChange={handleDateChange}
              style={{ width: '40%' }}
            />           
            <button className='btn btn-light rounded-0 col-sm-3 float-start mt-3 text-primary' onClick={nextDay}>Next &nbsp;<i className="fi fi-ss-angle-circle-right"></i></button>
          </Row>          
        </Col>
        <Col xs={3}></Col>
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
      <SurgeryForm
        formLabels={translatedElements} 
        editID = {selectedSurgery}
        refreshForm={refreshForm}
        show={show}
        mode={mode}
        formCurData={formData}
        procedureList={procedureList}
        handleClose={handleClose}
        createPurchaser={handleAddPurchaser}
        deleteProcedure={handleRemoveProcedure}
        handleTypeaheadInputChange={handleTypeaheadInputChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        formReset={formReset}
      />
    </div>
  );
};

export default Calendar;
