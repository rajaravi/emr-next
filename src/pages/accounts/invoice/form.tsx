import React, { FC, useEffect, useRef, useState, ChangeEvent } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';

import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { uuidToId } from '@/utils/helpers/uuid';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import { typeaheadColumnConfig } from '@/types/patient';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

interface InvoiceProps {
  formLabels: [];
  editID: number;
  show: boolean;
  mode: boolean;
  procedureList: [];
  formCurData: [];
  handleClose: () => void;
  refreshForm: (event: any) => void;
  createPurchaser: (event: any) => void;
  deleteProcedure: (event: any) => void;
  handleTypeaheadInputChange: (event: any) => void;
  handleInputChange: (event: any) => void;
  handleSave: () => void;  
  formReset: boolean;
}

const initialValue = {  
  patient_id: 0,
  episode_id: 0,
  doctor_id: 0,
  location_id: 0,
  date: '',
  from_time: '',
  to_time: '',
  admission_date: '',
  discharge_date: '',
  discharge_time: '',
  notes: '',
  status_id: 0,    
  surgery_details: [
    { procedure_id: '' },
  ]    
};

const InvoiceForm: React.FC<InvoiceProps> = ({formLabels, editID, show, mode, procedureList, formCurData, handleClose, refreshForm, createPurchaser, deleteProcedure, handleTypeaheadInputChange, handleInputChange, formReset, handleSave}) => {
  const dynamicFormRef = useRef<DynamicFormHandle>(null);  
  const { t } = useTranslation('common');
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  return(
    <OffcanvasComponent
      show={show}
      title={ (mode) ? t('ACCOUNT.INVOICE.EDIT_TITLE') : t('ACCOUNT.INVOICE.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="75%">

      <DynamicForm ref={dynamicFormRef}
        formData={formLabels}
        initialValues={initialValues}
        formReset={formReset}
        onSubmit={handleSave}
        isEditMode={mode}
        modelFormTypeahead={handleTypeaheadInputChange}
        columHeaderTypeahead={typeaheadColumnConfig}
        modelFormInputs={handleInputChange} />

      <Form.Control 
        type='hidden'
        name='patient_id'
        id='patient_id'
        readOnly
      />             
    </OffcanvasComponent>
  )
};

export default InvoiceForm;