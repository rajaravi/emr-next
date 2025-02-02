// src/components/FullCalendarComponent.tsx

import React, { useEffect, useState, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import _styles from './_style.module.css';

interface CalendarProps {
  key: number;
  viewType: string;
  resources: [];
  events: [],
  handleViewChange: (event: any) => void;
  handleEventClick: (event: any) => void;
}

const MyFullCalendar: React.FC<CalendarProps> = ({key, viewType, resources, events, handleViewChange, handleEventClick}) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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

  const handleSelect = (selectInfo: any) => {
    const startTime = selectInfo.startStr;
    const endTime = selectInfo.endStr;
    setSelectedSlot(startTime);
  };

  return (
    <>   
      <style>
        {`
          /* Optional: Add a border to make the hour line more visible */
          .fc-timegrid-slots table tbody tr td:nth-child(1) {
            font-size: 0.6rem;
          }
          .fc-timegrid-slots table tbody tr:nth-child(1) td {
            border-top: 1px solid #000;
          }
          .fc-timegrid-slots table tbody tr:nth-child(4n + 1) td {
            border-top: 1px solid #000;
          }
          .fc .fc-timegrid-slot {
            height: 30px; /* Adjust this value as needed */
          }
          /* Custom CSS to highlight selected slot */
          .fc-timegrid-slot.highlighted {
            border: 2px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
          }        
        `}
      </style> 
      <div className={`${_styles.calendarApp} mt-2`}>      
        <div className={`${_styles.calendarAppMain} p-0`}>
          <FullCalendar
            key={key}
            plugins={[resourceTimeGridPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            ref={calendarRef}
            resources={resources}
            events={events}
            eventClick={handleEventClick} // Handle event selection
            selectable={true}
            select={handleSelect}
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
            dayCellDidMount={(info) => {
              // Add a class to highlight the selected slot
              if (info.date.toISOString() === selectedSlot) {
                info.el.classList.add('highlighted');
              }
            }}
            allDaySlot={false}
            firstDay={1}
            slotDuration="00:15:00"
            // slotLabelFormat={{
            //   hour: '2-digit', // Show hours for full hour slots
            //   minute: '2-digit', // Show two-digit minutes
            //   omitZeroMinute: false, // Always show minutes
            //   hour12: false, // Use 24-hour format; set to `true` for 12-hour format
            // }}
            slotLabelFormat={(info) => {              
              const { date } = info;
              const minutes = date.minute;//date.getMinutes();
      
              // If minutes are 0, show the full hour (e.g., 08:00)
              if (minutes === 0) {
                const hours = date.hour;
                return `${hours.toString().padStart(2, '0')}:00`;
              }
      
              // Otherwise, show just the two-digit minutes
              return `${minutes.toString().padStart(2, '0')}`;
            }}            
            slotLabelInterval="00:15:00" // Show labels every hour
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
    </>
  );
};
export default MyFullCalendar;