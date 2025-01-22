// src/components/FullCalendarComponent.tsx

import React, { useEffect, useState, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import _styles from './_style.module.css';

interface CalendarProps {
  viewType: string;
  resources: [];
  events: [],
  handleViewChange: (event: any) => void;
  selectDate: (event: any) => void;
}

const MyFullCalendar: React.FC<CalendarProps> = ({viewType, resources, events, handleViewChange, selectDate}) => {
  const calendarRef = useRef<FullCalendar | null>(null);

  // Month to day view double click
  let lastClick = 0;
  const handleDateClick = (arg: any) => {
    const now = new Date().getTime();
    if (now - lastClick < 300) {      
      const selectedDate = arg.dateStr;
      calendarRef.current?.getApi().changeView('resourceTimeGridDay', selectedDate);
    }
    lastClick = now;
  };

  return (    
      <div className={`${_styles.calendarApp} mt-2`}>      
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
                return (<div style={{ backgroundColor: '#28b30a', color: 'white', padding: '2px 10px', borderColor: '#28b30a' }}>
                  {arg.event.title}
                </div>); // Do not render events in month view
              }
              return (
                <div style={{ color: 'white', padding: '2px' }}>
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
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // Use 24-hour format; set to true for 12-hour format
            }}
            slotLabelInterval="00:15:00" // Show labels every 15 minutes
            slotMinTime="07:00:00" // Start time for the day (optional)
            slotMaxTime="20:00:00" // End time for the day (optional)
            height="580px" 
            dateClick={handleDateClick}
            nowIndicator={true}
            datesSet={(arg) => {            
              handleViewChange(arg.view);
            }}          
            viewDidMount={(arg) => {
              handleViewChange(arg.view);
            }}
          />
        </div>
      </div>
  );
};
export default MyFullCalendar;