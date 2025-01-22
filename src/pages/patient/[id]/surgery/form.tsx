
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

interface SurgeryProps {
  formLabels: [];
  editID: number;
  show: boolean;
  mode: boolean;
  procedureList: [];
  formCurData: [];
  handleClose: (event: any) => void;
  refreshForm: (event: any) => void;
  createPurchaser: (event: any) => void;
  deleteProcedure: (event: any) => void;
  handleTypeaheadInputChange: (event: any) => void;
  handleInputChange: (event: any) => void;
  handleSave: (event: any) => void;  
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

const SurgeryForm: React.FC<SurgeryProps> = ({formLabels, editID, show, mode, procedureList, formCurData, handleClose, refreshForm, createPurchaser, deleteProcedure, handleTypeaheadInputChange, handleInputChange, formReset, handleSave}) => {
  const dynamicFormRef = useRef<DynamicFormHandle>(null);  
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  
  const [patientID, setPatientID] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  return (
    <OffcanvasComponent
      show={show}
      title={ (mode) ? t('PATIENT.SURGERY.EDIT_TITLE') : t('PATIENT.SURGERY.CREATE_TITLE') }
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
        type='text'
        name='patient_id'
        id='patient_id'
        readOnly
      />
      <Container className='p-0'>
        <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={createPurchaser}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
        <Table>
          <thead>
            <tr>
              <th className={`${styles.tableGridHead} col-sm-11`}>{t('SETTING.SIDE_MENU.PROCEDURE')}</th>
              <th className={`${styles.tableGridHead} col-sm-1`}></th>
            </tr>
          </thead>
          <tbody>            
            {formCurData?.surgery_details.map((surgery, index) => (
              <tr key={index} style={{borderStyle: 'hidden'}}>
                <td>
                  <Form.Select
                    name="procedure_id"
                    id={`procedure_id-${index}`}
                    className="rounded-0"
                    value={surgery.procedure_id}
                    onChange={(e) => handleInputChange(e, index)}>
                      <option value="">Select...</option>
                      {procedureList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>{option.name}</option>
                      ))}
                  </Form.Select>
                </td>                  
                <td>
                  <Button className="text-danger rounded-0" variant="" onClick={() => deleteProcedure(index)}><i className="fi fi-br-trash"></i></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>        
    </OffcanvasComponent>
  )
};
export default SurgeryForm;