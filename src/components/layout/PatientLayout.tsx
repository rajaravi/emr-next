import React, { ReactNode, Suspense } from 'react';
import PatientSidebar from './PatientSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Loader from '../suspense/Loader';
import { useRouter } from 'next/router';
import Skeleton from '../suspense/Skeleton';

interface PatientLayoutProps {
  children: ReactNode;
  patientId: string;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children, patientId }) => {
  const router = useRouter();
  const { pathname } = router;
  // console.log("🚀 ~ router:2223", router, pathname)
  const { id } = router.query;

  // Define restricted paths
  const restrictedPathCommonHeader = ['/patient/[id]', '/patient/[id]/patient-details'];
  const isHeaderAllowed = !restrictedPathCommonHeader.includes(pathname);
  
  return (
    <Container fluid className='m-0'>
        <Row>
            <Col id="page-content-wrapper">
              <Suspense fallback={<Skeleton />}>
                {isHeaderAllowed ? <div>I am common header to all side bar...</div> : ''}
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
