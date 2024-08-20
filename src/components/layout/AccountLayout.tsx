import React, { ReactNode, Suspense } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from '../common/Loader';
import { useRouter } from 'next/router';
import AccountSidebar from './AccountSidebar';

interface AccountLayoutProps {
  children: ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children}) => {
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;
  
  return (
    <Container fluid>
        <Row>
            <Col xs={10} id="page-content-wrapper">
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense>
            </Col>
            <Col xs={2} id="sidebar-wrapper">
              <AccountSidebar/>
            </Col>
        </Row>
    </Container>
  );
};

export default AccountLayout;
