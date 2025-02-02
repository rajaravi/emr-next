import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Row, Col } from 'react-bootstrap';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import { typeaheadColumnConfig } from '@/types/patient';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

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
}

const AppointmentForm = forwardRef<DynamicFormHandle, AppointmentProps>(({formLabels, initialValues, slotsList, editID, show, mode,
  refreshForm, handleTypeaheadInputChange, handleInputChange, handleItemClick, formReset, activeIndex, handleSave, handleClose, fromSource, booked_slot_time}, ref) => {

  const { t } = useTranslation('common');

  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefApp.current?.validateModelForm(),
  }));

  return (
  <>
  <OffcanvasComponent
      show={show}
      title={ (mode) ? t('PATIENT.APPOINTMENT.EDIT_TITLE') : t('PATIENT.APPOINTMENT.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="75%">

      <Row>
        <Col className='col-sm-8'>
          <DynamicForm ref={dynamicFormRefApp}
            formData={formLabels}
            initialValues={initialValues}
            formReset={formReset}
            isEditMode={mode}
            modelFormTypeahead={handleTypeaheadInputChange}
            columHeaderTypeahead={typeaheadColumnConfig}
            modelFormInputs={handleInputChange} />
        </Col>
        <Col className='col-sm-4'>
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
  </>
  )
});

export default AppointmentForm;