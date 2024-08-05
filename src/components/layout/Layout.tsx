import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container fluid>
        <Row>
            <Col xs={9} id="page-content-wrapper">
            {children}
            </Col>
            <Col xs={3} id="sidebar-wrapper">
            {/* <Sidebar /> */}
            </Col>
        </Row>
    </Container>
  );
};

export default Layout;
