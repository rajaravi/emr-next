import React, { ReactNode } from 'react';
import PatientSidebar from './PatientSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';

interface PatientLayoutProps {
  children: ReactNode;
  patientId: string;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children, patientId }) => {
  return (
    <Container fluid>
        <Header />
        <Row>
            <Col xs={10} id="page-content-wrapper">
            {children}
            </Col>
            <Col xs={2} id="sidebar-wrapper">
            <PatientSidebar patientId={'4'} />
            </Col>
        </Row>
    </Container>
  );
};

export default PatientLayout;
