import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';
import { Row, Col } from 'react-bootstrap';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
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
}

const MIN_CHARACTERS = 3;
const AppointmentForm = forwardRef<DynamicFormHandle, AppointmentProps>(
// const AppointmentForm: React.FC<AppointmentProps> = 

({formLabels, initialValues, slotsList, editID, show, mode,
    refreshForm, handleTypeaheadInputChange, handleInputChange, handleItemClick, formReset, activeIndex,
    handleSave, handleClose}, ref) => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRef.current?.validateModelForm(),
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
          <DynamicForm ref={dynamicFormRef}
            formData={formLabels}
            initialValues={initialValues}
            formReset={formReset}
            // onSubmit={handleSave}
            isEditMode={mode}
            modelFormTypeahead={handleTypeaheadInputChange}
            columHeaderTypeahead={typeaheadColumnConfig}
            modelFormInputs={handleInputChange} />
        </Col>
        <Col className='col-sm-4'> 
          <ul className='timeSlots'>
            {slotsList.map((record:any, index:number) => (
              <li
                key={index}
                onClick={() => handleItemClick(record.start, record.end, index)}
                style={{
                  marginBottom: "5px",
                  cursor: "pointer",
                  backgroundColor: activeIndex === index ? "#007BFF" : "#f4f4f4", // Change background for active <li>
                  color: activeIndex === index ? "#fff" : "#000", // Change text color for active <li>
                }}
              >
                {record.start.substr(11, 5)} - {record.end.substr(11, 5)}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </OffcanvasComponent>
  </>
  )
});

export default AppointmentForm;