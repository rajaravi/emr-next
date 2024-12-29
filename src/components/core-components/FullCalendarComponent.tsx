// src/components/FullCalendarComponent.tsx

import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  title: string;
  color: string;
}

const MyFullCalendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch events and resources from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/mock/calendar-data'); // Replace with your API endpoint
        const data = await response.json();
        setEvents(data.events);
        setResources(data.resources);
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

  const handleDatesSet = (arg: any) => {
    fetch(`/api/mock/calendar-data?start=${arg.startStr}&end=${arg.endStr}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched events:', data);
        // Update the events state here
      })
      .catch((err) => console.error('Error fetching events:', err));
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
            right: 'dayGridMonth,resourceTimeGridWeek,resourceTimeGridDay',
          }}
          eventContent={(arg) => {
            const currentView = arg.view.type;
            console.log('currentView',currentView);
            if (currentView === 'dayGridMonth') {
              return null; // Do not render events in month view
            }
            return (
              <div style={{ backgroundColor: arg.event.backgroundColor, color: 'black', padding: '2px' }}>
                {arg.event.title}
              </div>
            );
          }}
          dayCellContent={(arg) => {
            const taskCount = events.filter((event) =>
              event.start.startsWith(arg.date.toISOString().split('T')[0])
            ).length;
            const currentView = arg.view.type;
            if(currentView === 'timeGridWeek' || currentView === 'resourceTimeGridDay') {
              return null;
            }
            return (
              <div>
                <div>{arg.dayNumberText}</div>
                {taskCount > 0 && (
                  <div style={{ fontSize: '0.8em', color: 'blue' }}>
                    {taskCount} task{taskCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          }}
          eventDidMount={(info) => {
            info.el.style.backgroundColor = info.event.color;
            info.el.style.borderColor = info.event.color;
          }}
          allDaySlot={false}
          slotDuration="00:15:00"
          slotMinTime="07:00:00" // Start time for the day (optional)
          slotMaxTime="20:00:00" // End time for the day (optional)
          height="600px" 
          dateClick={handleDateClick}
          datesSet={handleDatesSet} // Attach the callback to detect view changes
          nowIndicator={true}
        />
      </div>
    </div>
  );
};
export default MyFullCalendar;