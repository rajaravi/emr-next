import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col, Container, Button, Form, ProgressBar, Modal, Tabs, Tab } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import ToastNotification from '@/components/core-components/ToastNotification';
import { typeaheadColumnConfig } from '@/types/patient';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  if (!id) {
    return {
      notFound: true, // Show 404 if patient ID is invalid
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', ['common'])), // Ensure 'common' namespace exists
      id: id, // Pass a valid string
    },
  };
};

interface AppointmentProps {
  formLabels: [];
  initialValues: [];
  slotsList: [];
  editID: number;
  show: boolean;
  mode: boolean;
  handleClose: () => void;
  handleSave: () => void;
  refreshForm: (event: any) => void;
  handleTypeaheadInputChange: (name: string, selected: any, label: string) => void;
  handleInputChange: (event: any) => void;
  handleItemClick: (start: any, end: any, index: any) => void;
  formReset: boolean;
  activeIndex: number;
  fromSource: string;
  booked_slot_time: string;
  workFlowShow: boolean;
  nextStep: (i: number) => void;
  step: number;
  totalSteps: number;
  setStep: (i: number) => void;
}

const AppointmentForm = forwardRef<DynamicFormHandle, AppointmentProps>(({formLabels, initialValues, slotsList, editID, show, mode,
  refreshForm, handleTypeaheadInputChange, handleInputChange, handleItemClick, formReset, activeIndex, handleSave, handleClose, fromSource, booked_slot_time, workFlowShow, nextStep, step, totalSteps, setStep}, ref) => {

  const { t } = useTranslation('common');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefApp.current?.validateModelForm(),
  }));

  useEffect(() => {
    console.log('formLabels',formLabels)
      // Language apply for form label
      // const filteredElements = formLabels.filter((element) => element.name !== "status_id");
      // const translatedFormElements = filteredElements.map((element) => {
      //   return {
      //     ...element,
      //     label: t(`PATIENT.APPOINTMENT.${element.label}`),
      //   };
      // });


    }, []);

  return (
  <>
  <OffcanvasComponent
      show={show}
      title={ (mode) ? t('PATIENT.APPOINTMENT.EDIT_TITLE') : t('PATIENT.APPOINTMENT.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="85%">

      <Row>
        <Col className='col-sm-7'>
          <DynamicForm ref={dynamicFormRefApp}
            formData={formLabels}
            initialValues={initialValues}
            formReset={formReset}
            isEditMode={mode}
            modelFormTypeahead={handleTypeaheadInputChange}
            columHeaderTypeahead={typeaheadColumnConfig}
            modelFormInputs={handleInputChange} />
        </Col>
        <Col className='col-sm-5'>
          <div className={(mode === true) ? 'mb-4' : 'd-none'} >
            <h5>{t('PATIENT.APPOINTMENT.BOOKED_TIME_SLOT')}</h5>
            <button className='btn btn-sm btn-success rounded-0 py-2'>{ booked_slot_time }</button>
          </div>
          <h5>{t('PATIENT.APPOINTMENT.AVAILABLE_TIME_SLOTS')}</h5>
          
          <ul className='timeSlots'>
            { 
              (slotsList.length > 0) ? slotsList.map((record:any, index:number) => (
              <li
                key={index}
                onClick={() => handleItemClick(record.start, record.end, index)}
                style={{
                  marginBottom: "5px",
                  cursor: "pointer",
                  backgroundColor: activeIndex === index ? "#007BFF" : "#baff97",
                  color: activeIndex === index ? "#fff" : "#000",
                  borderColor: activeIndex === index ? "#005abb" : "#6bd933",
                }}
              >
                {record.start.substr(11, 5)} - {record.end.substr(11, 5)}
              </li>
              )) : <span className='text-danger'>No slots found</span>
            }
          </ul>
        </Col>
      </Row>
    </OffcanvasComponent>
    <Modal size='xl' show={workFlowShow}>
      <Container className="my-4">
        <h3 className='mb-3 border-bottom'>Appointment - Follow up actions</h3>
        <Tabs className="mb-3 w-100 d-flex justify-content-between nav-tabs-custom" activeKey={step} >
          <Tab eventKey={1} title="Step 1" disabled={step < 1} />
          <Tab eventKey={2} title="Step 2" disabled={step < 2} />
          <Tab eventKey={3} title="Step 3" disabled={step < 3} />
        </Tabs>
        {step === 1 && (
          <Form>
            <Form.Group controlId="step1">
              <Form.Label>Step 1</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
          </Form>
        )}

        {step === 2 && (
          <Form>
            <Form.Group controlId="step2">
              <Form.Label>Step 2</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
          </Form>
        )}

        {step === 3 && (
          <Form>
            <Form.Group controlId="step3">
              <Form.Label>Step 3</Form.Label>
              <p>Review your information and submit.</p>
            </Form.Group>
          </Form>
        )}

        <div className="d-flex float-end mt-3">
          {/* <Button variant="secondary" onClick={prevStep} disabled={step === 1}>
            Previous
          </Button> */}
          {step < totalSteps ? (
            <>
              <Button className='float-end rounded-0' variant="success" onClick={() => nextStep(1)}>
                Save and Next
              </Button>
              <Button className='float-end rounded-0' variant="default" onClick={() => nextStep(2)}>
                Skip
              </Button>
            </>
          ) : (
            <>
              <Button variant="success" className='rounded-0' onClick={() => nextStep(3)}>
                Submit and Close
              </Button>
              <Button className='float-end rounded-0' variant="default" onClick={() => nextStep(4)}>
                Skip
              </Button>
            </>
          )}
        </div>
      </Container>
    </Modal>
  </>
  )
});

export default AppointmentForm;