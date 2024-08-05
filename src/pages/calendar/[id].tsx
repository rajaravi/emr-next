import { useRouter } from 'next/router';
import React from 'react';

const CalendarEntry = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Calendar Entry {id}</h1>
      {/* Specific calendar entry content goes here */}
    </div>
  );
};

export default CalendarEntry;
