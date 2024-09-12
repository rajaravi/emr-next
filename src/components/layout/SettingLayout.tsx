import React, { ReactNode, Suspense } from 'react';
import SettingSidebar from './SettingSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from '../common/Loader';
import { useRouter } from 'next/router';

interface SettingLayoutProps {
  children: ReactNode;
}

const SettingLayout: React.FC<SettingLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  
  return (
    <Container fluid className='m-0'>
        <Row>
            <Col id="page-content-wrapper">
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense>
            </Col>
            <Col id="sidebar-wrapper">
              <SettingSidebar />
            </Col>
        </Row>
    </Container>
  );
};

export default SettingLayout;
