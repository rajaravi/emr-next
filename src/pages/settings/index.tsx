import Header from '@/components/layout/Header';
import React from 'react';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Settings = () => {
  return (
    <SettingLayout>
      <div>
        {/* <h1>{t('PATIENT.PATIENT_DASHBOARD')},</h1> */}
        <p>This is the default content for the patient.</p>
      </div>
    </SettingLayout>
  );
};

export default Settings;