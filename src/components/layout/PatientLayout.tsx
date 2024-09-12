import React, { ReactNode, Suspense } from 'react';
import PatientSidebar from './PatientSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Loader from '../common/Loader';
import { useRouter } from 'next/router';

interface PatientLayoutProps {
  children: ReactNode;
  patientId: string;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children, patientId }) => {
  const router = useRouter();
  const { pathname } = router;
  console.log("🚀 ~ router:2223", router, pathname)
  const { id } = router.query;

  // Define restricted paths
  const restrictedPathCommonHeader = ['/patient/[id]', '/patient/[id]/patient-details'];
  const isHeaderAllowed = !restrictedPathCommonHeader.includes(pathname);
  
  return (
    <Container fluid className='m-0'>
        <Row>
            <Col id="page-content-wrapper">
              <Suspense fallback={<Loader />}>
                {isHeaderAllowed ? <div>
                  <div className="card rounded-0 mb-3 border-0 border-bottom border-primary bg-transparent">
                    <div className="card-body p-0 pb-3">
                      <div className='row'>
                        <div className='col-1'>
                          <p className="card-text mb-0">ID</p>    
                          <h6 className="card-title mb-0">14</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">Name</p>    
                          <h6 className="card-title mb-0">David Brown</h6>
                        </div>
                        <div className='col-2'>
                          <p className="card-text mb-0">MRN</p>    
                          <h6 className="card-title mb-0">820309</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">Phone</p>    
                          <h6 className="card-title mb-0">353 992 0291</h6>
                        </div>
                        <div className='col-3'>
                          <p className="card-text mb-0">Email</p>    
                          <h6 className="card-title mb-0">david.brown90@yopmail.com</h6>
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
