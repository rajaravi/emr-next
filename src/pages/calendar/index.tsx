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

  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.SURGERY.PATIENT'), class: "col-sm-3", field: "patient_id"},
    { name: t('PATIENT.SURGERY.DOCTOR'), class: "col-sm-3", field: "doctor_id"},
    { name: t('PATIENT.SURGERY.LOCATION'), class: "col-sm-3", field: "location_id"},
    { name: t('PATIENT.SURGERY.STATUS'), class: "col-sm-2", field: "status_id"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.SURGERY.PATIENT'), field: 'patient_id' }
  ];
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [clear, setClear] = useState<boolean>(false);

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
  }, []);

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
      fetchDayOrWeekViewEvents(start, end);
      setViewType('');
    }    
  };

  const showAppointment = () => {
    setModuleType(1);
  }

  const showSurgery = () => {
    setModuleType(2);
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


  return (
    <div className='container-fluid pt-60'>
      <div className='row'>
        <div className='col-2'>
          <h1 className='mt-3'>Calendar</h1>
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
            <Button variant='primary' className='btn rounded-0'><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDSURGERY')}</Button>
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
        />
      </div>
      <div className={(moduleType === 2) ? 'mt-3' : 'd-none'}>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">
        <Col xs={7}></Col>        
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
    </div>
  );
};

export default Calendar;
