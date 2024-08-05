import React from 'react';
import { useRouter } from 'next/router';
import PatientLayout from '@/components/layout/PatientLayout';

import { NextApiRequest, NextApiResponse } from 'next';
import { execute_axios_get, execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import withSuspense from '@/components/common/withSuspense';
import styles from './_style.module.css';

const PatientDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("🚀 ~ id:", id)

  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const getData = await execute_axios_get(ENDPOINTS.GET_PATIENT);
      console.log('GET data:', getData);
  
      res.status(200).json({ message: 'Success', getData });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  return (
    <PatientLayout patientId={id as string}>
      <h1><span className={styles.textColor}>Patient Details</span> for Patient {id}</h1>
      <p>This is the content for Patient Details.</p>
    </PatientLayout>
  );
};

export default PatientDetails;
