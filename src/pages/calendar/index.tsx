import React from 'react';
// import MyBigCalendar from '@/components/core-components/BigCalendar';
import MyFullCalendar from '@/components/core-components/FullCalendarComponent';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Calendar = () => {
  const { t } = useTranslation('common');
  return (
    <div className='container-fluid pt-60'>
      <div className='row'>
        <div className='col-3'>
          <h1 className='my-3'>Calendar</h1>
        </div>
        <div className='col-9 my-3 text-end'>
          <button className='btn btn-sm btn-success ms-1 rounded-0'>Add New</button>
          <button className='btn btn-sm btn-primary ms-1 rounded-0'>Edit</button>
          <button className='btn btn-sm btn-warning ms-1 rounded-0'>Print</button>
        </div>
      </div>
      {/* <MyBigCalendar /> */}
      <MyFullCalendar />
    </div>
  );
};

export default Calendar;
