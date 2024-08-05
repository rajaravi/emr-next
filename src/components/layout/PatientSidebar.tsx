import React from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';

interface PatientSidebarProps {
  patientId: string;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ patientId }) => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Item>
          <Link href={`/patient/${patientId}/patient-details`} passHref>
            <Nav.Link as="a">Patient Details</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href={`/patient/${patientId}/patient-history`} passHref>
            <Nav.Link as="a">Patient History</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href={`/patient/${patientId}/examination`} passHref>
            <Nav.Link as="a">Examination</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href={`/patient/${patientId}/appointment`} passHref>
            <Nav.Link as="a">Appointment</Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default PatientSidebar;
