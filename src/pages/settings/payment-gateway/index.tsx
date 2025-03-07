import React, { useEffect, useRef, useState } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown, Form, Tabs, Tab } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import { useLoading } from '@/context/LoadingContext';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  name: '',
  is_archive: 0
};

const PaymentGateway: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const [key, setKey] = useState('stripe');

  const dynamicFormRef = useRef<DynamicFormHandle>(null);  
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const [formData, setFormData] = useState<any>([]);
  const handleShow = () => {
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  useEffect(() => {   
    
  }, []);
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });    
  };  

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-brands-stripe"></i> {t('SETTING.SIDE_MENU.PAYMENT_GATEWAY')}</h1>
      </div>
      <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="stripe" title="Stripe">
          <Row className='mb-3'>
            <Col xs={6}>
              <Form.Label>Publishable Key</Form.Label>
              <Form.Control type='text' name="stripe_public_key" onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col xs={6}>
              <Form.Label>Secret Key</Form.Label>
              <Form.Control type='password' name="stripe_secret_key" onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col xs={3}>
              <Form.Label>Currency</Form.Label>
              <Form.Select className='rounded-0' onChange={handleInputChange}>
                <option value="0">Select</option>
                <option value="1">EUR</option>
                <option value="2">GBP</option>
                <option value="3">USD</option>
              </Form.Select>
            </Col>
          </Row>
          <Button className='btn btn-success rounded-0'><i className="fi fi-ss-disk"></i> Save</Button>
        </Tab>
        <Tab eventKey="aib" title="AIB">
          <Row className='mb-3'>
            <Col xs={6}>
              <Form.Label>Store Name</Form.Label>
              <Form.Control type='text' name="aib_store_name" onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col xs={6}>
              <Form.Label>Secret Key</Form.Label>
              <Form.Control type='password' name="aib_shared_secret" onChange={handleInputChange} />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col xs={3}>
              <Form.Label>Currency</Form.Label>
              <Form.Select className='rounded-0' onChange={handleInputChange}>
                <option value="0">Select</option>
                <option value="1">EUR</option>
                <option value="2">GBP</option>
                <option value="3">USD</option>
              </Form.Select>
            </Col>
          </Row>
          <Button className='btn btn-success rounded-0'><i className="fi fi-ss-disk"></i> Save</Button>
        </Tab>
      </Tabs>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </SettingLayout>
  );
};
export default PaymentGateway;
