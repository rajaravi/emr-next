import React, { ReactNode, Suspense } from 'react';
import PatientSidebar from './PatientSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Loader from '../common/Loader';

interface PatientLayoutProps {
  children: ReactNode;
  patientId: string;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children, patientId }) => {
  return (
    <Container fluid>
        <Row>
            <Col xs={10} id="page-content-wrapper">
              <Suspense fallback={<Loader />}>
                <div>I am common header to all side bar...</div>
                {children}
              </Suspense>
            </Col>
            <Col xs={2} id="sidebar-wrapper">
            <PatientSidebar patientId={patientId} />
            </Col>
        </Row>
    </Container>
  );
};

export default PatientLayout;
