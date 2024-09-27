import React from 'react';
import MyBigCalendar from '@/components/core-components/BigCalendar';
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
    <div>
      {/* <MyBigCalendar /> */}
      <MyFullCalendar />
    </div>
  );
};

export default Calendar;
