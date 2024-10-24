// src/components/FullCalendarComponent.tsx

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// import '@fullcalendar/common/main.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
import { INITIAL_EVENTS, createEventId } from '../../utils/event-utils'
import _styles from './_style.module.css';

const MyFullCalendar: React.FC = () => {
  
  const handleDateClick = (arg: any) => {
    alert('Date: ' + arg.dateStr);
  };

  // a custom render function
  const renderEventContent = (eventInfo: any) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  const handleDateSelect = (selectInfo: { view: { calendar: any; }; startStr: any; endStr: any; allDay: any; }) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar
  
    calendarApi.unselect() // clear date selection
  
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  const events = [
    { title: 'Meeting', start: new Date() },
    { title: 'Event 1', date: '2024-09-29' },
    { title: 'Event 2', date: '2024-09-30' },
  ]

  return (
    <div className={`${_styles.calendarApp}`}>
      <div className={`${_styles.calendarAppMain}`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialEvents={INITIAL_EVENTS}
          // dateClick={handleDateClick}
          select={handleDateSelect}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
          */
        />
      </div>
    </div>
  );
};

export default MyFullCalendar;


