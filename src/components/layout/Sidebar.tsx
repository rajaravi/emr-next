import React from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Item>
          <Link href="/menu1" passHref>
            <Nav.Link>Patient Details</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/menu2" passHref>
            <Nav.Link>Patient History</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/menu3" passHref>
            <Nav.Link>Examination</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/menu4" passHref>
            <Nav.Link>Appointment</Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
