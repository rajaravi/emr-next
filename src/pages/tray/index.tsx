import Header from '@/components/layout/Header';
import React from 'react';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Tray = () => {
  return (
    <div>
      <h1>Tray</h1>
      <p>This is the default content for the Tray.</p>
      {/* Tray content goes here */}
    </div>
  );
};

export default Tray;
