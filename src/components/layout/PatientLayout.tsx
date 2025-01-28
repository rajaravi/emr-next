import React, { useEffect, useState, ReactNode, Suspense } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import PatientSidebar from './PatientSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import { uuidToId } from '@/utils/helpers/uuid';
import Loader from '../suspense/Loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface PatientLayoutProps {
  children: ReactNode;
  patientId: string;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children, patientId }) => {
  const router = useRouter();
  const { pathname } = router;  
  const { id } = router.query;
  const { t } = useTranslation('common');
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>([]);

  // Define restricted paths
  const restrictedPathCommonHeader = ['/patient/[id]', '/patient/[id]/patient-details'];
  const isHeaderAllowed = !restrictedPathCommonHeader.includes(pathname);
  
  useEffect(() => {    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let passData: any = { id: uuidToId(id) };
      const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
      setPatientData(response.data.data);
    } catch (error) {
      setError('Error fetching patient data:');
    }
  };

  return (
    <Container fluid className='m-0'>
        <Row>
            <Col id="page-content-wrapper">
              <Suspense fallback={<Loader />}>
                {isHeaderAllowed ? <div>
                  <div className="card rounded-0 mb-3 patient-info-header">
                    <div className="card-body">
                      <div className='row'>
                        <div className='col-1'>
                          <p className="card-text mb-0">{t('PATIENT.DETAILS.ID')}</p>    
                          <h6 className="card-title mb-0">{patientData.id}</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">{t('PATIENT.DETAILS.FULLNAME')}</p>    
                          <h6 className="card-title mb-0">{patientData.full_name}</h6>
                        </div>
                        <div className='col-2'>
                          <p className="card-text mb-0">{t('PATIENT.DETAILS.MRNNO')}</p>    
                          <h6 className="card-title mb-0">{patientData.mrn_no}</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">{t('PATIENT.DETAILS.HOME_PHONENO')}</p>
                          <h6 className="card-title mb-0">{patientData.home_phone_no}</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">{t('PATIENT.DETAILS.EMAIL')}</p>    
                          <h6 className="card-title mb-0">{patientData.email}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> : ''}
                {children}
              </Suspense>
            </Col>
            <Col id="sidebar-wrapper">
              <PatientSidebar patientId={patientId} />
            </Col>
        </Row>
    </Container>
  );
};

export default PatientLayout;
// function useEffect(arg0: () => void, arg1: never[]) {
//   throw new Error('Function not implemented.');
// }

