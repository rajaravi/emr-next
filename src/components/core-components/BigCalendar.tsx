import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
// import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer({ format, parse, startOfWeek, getDay });

const MyBigCalendar: React.FC = () => {
  const events = [
    {
      title: 'Board meeting',
      start: new Date(2024, 8, 29, 10, 0), // Year, Month (0-based), Day, Hour, Minute
      end: new Date(2024, 8, 29, 12, 0),
    },
    // Add more events here
  ];

  return (
    <div>
      <h2>My Big Calendar</h2>
      {/* <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      /> */}
    </div>
  );
};

export default MyBigCalendar;
