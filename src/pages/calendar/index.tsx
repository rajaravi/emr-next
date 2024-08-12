import React from 'react';

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
      <h1>Calendar</h1>
      <p>This is the default content for the Calendar.</p>
      {/* Calendar content goes here */}
    </div>
  );
};

export default Calendar;
