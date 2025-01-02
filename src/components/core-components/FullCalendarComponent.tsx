// src/components/FullCalendarComponent.tsx

import React, { useEffect, useState, useRef } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ENDPOINTS from '@/utils/constants/endpoints';
import _styles from './_style.module.css';

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  resourceId?: string;
}

interface Resource {
  id: string;
  name: string;
  color?: string;
}

const MyFullCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events and resources from API
  useEffect(() => {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();  
    const fetchData = async () => {
      try {
        let passData: string = JSON.stringify({ month: mm, year: ""+yyyy+"" });
        const response = await execute_axios_post(ENDPOINTS.POST_MONTH_SLOTS, passData);
        console.log('response',response.data)
        const formattedEvents = response.data.map((event: { count: number; date: any; }) => ({        
          title: event.count,
          start: event.date, // YYYY-MM-DD format
          end: event.date
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let lastClick = 0;
  const handleDateClick = (arg: any) => {
    const now = new Date().getTime();
    console.log('arg',arg.dateStr);
    if (now - lastClick < 300) { // 300ms for double-click
      // Double-click detected, change view to day view
      const selectedDate = arg.dateStr;
      calendarRef.current?.getApi().changeView('resourceTimeGridDay', selectedDate);
    }
    lastClick = now; // Update last click time
  };

  const handleDatesSet = async(vType: any, sDate: any) => {
    console.log('in',vType);
    try {
      console.log('why', sDate);
      setEvents([]);
      if(vType === 'dayGridMonth') {        
        const startDate = new Date(sDate);
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const year = startDate.getFullYear();
        let passData: string = JSON.stringify({ month: month, year: ""+year+"" });
        const response = await execute_axios_post(ENDPOINTS.POST_MONTH_SLOTS, passData);
        console.log('m',response);
        const formattedEvents = response.data.map((event: { count: number; date: any; }) => ({        
          title: event.count,
          start: event.date, // YYYY-MM-DD format
          end: event.date
        }));
        setEvents(formattedEvents);
      }
      else if(vType === 'resourceTimeGridDay' || vType === 'timeGridWeek') {     
        let passData: string = JSON.stringify({ date: sDate.split('T')[0] });
        const response = await execute_axios_post(ENDPOINTS.POST_DAY_SLOTS, passData);
        console.log('d',response);
        setEvents(response.data.events);
        setResources(response.data.resources);
      }
    } catch (err) {
      setError('Failed to load doctor data.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle month navigation
  const handleMonthChange = (startDate: Date) => {
    // Get the current month and year
    const month = startDate.toLocaleString('default', { month: 'long' });
    const year = startDate.getFullYear();

    // Update the state to reflect the current month
    setCurrentMonth(`${month} ${year}`);
    console.log(`Current month: ${month} ${year}`);
    
    // Custom logic for month navigation
    // You can make API calls or handle other logic here
    fetch(`/api/events-for-month?month=${month}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched events for the month:', data);
      })
      .catch((error) => console.error('Error fetching events:', error));
  };

  // Show a loading state while data is being fetched
  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className={`${_styles.calendarApp} px-0`}>
      <div className={`${_styles.calendarAppMain} p-0`}>
        <FullCalendar
          plugins={[resourceTimeGridPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          ref={calendarRef}
          resources={resources}
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay',
          }}
          eventContent={(arg) => {
            const currentView = arg.view.type;
            if (currentView === 'dayGridMonth') {
              return (<div style={{ backgroundColor: arg.event.backgroundColor, color: 'black', padding: '2px' }}>
                {arg.event.title}
              </div>); // Do not render events in month view
            }
            return (
              <div style={{ backgroundColor: arg.event.backgroundColor, color: 'black', padding: '2px' }}>
                {arg.event.title}
              </div>
            );
          }}
          dayCellContent={(arg) => {
            const currentView = arg.view.type;
            if(currentView === 'timeGridWeek' || currentView === 'resourceTimeGridDay') {
              return null;
            }
            return (
              <div>
                <div>{arg.dayNumberText}</div>                
              </div>
            );
          }}
          allDaySlot={false}
          slotDuration="00:15:00"
          slotMinTime="07:00:00" // Start time for the day (optional)
          slotMaxTime="20:00:00" // End time for the day (optional)
          height="600px" 
          dateClick={handleDateClick}
          nowIndicator={true}
          datesSet={(arg) => {
            // This callback is triggered whenever the view or date range changes
            const viewType = arg.view.type; // Get the current view type (e.g., 'dayGridMonth', 'timeGridDay')
            const start = arg.startStr; // Get the start date of the view
            const end = arg.endStr; // Get the end date of the view               
            handleDatesSet(viewType, start); // Fetch data based on the view type
          }}
          
        />
      </div>
    </div>
  );
};
export default MyFullCalendar;