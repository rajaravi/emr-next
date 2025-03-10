
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import styles from './_style.module.css';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
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

interface SurgeryProps {
  formLabels: [];
  initialValues: [];
  editID: number;
  show: boolean;
  mode: boolean;
  procedureList: [];
  formCurData: any;
  refreshForm: (event: any) => void;
  createPurchaser: (event: any) => void;
  deleteProcedure: (event: any) => void;
  handleTypeaheadInputChange: (name: string, selected: any, label: string) => void;
  handleInputChange: (event: any, e:number) => void;
  handleClose: () => void;
  handleSave: () => void;  
  formReset: boolean;
  fromSource: string;
}

const SurgeryForm = forwardRef<DynamicFormHandle, SurgeryProps>(({formLabels, initialValues, editID, show, mode, procedureList, formCurData, 
  handleClose, refreshForm, createPurchaser, deleteProcedure, handleTypeaheadInputChange, handleInputChange, 
  formReset, handleSave, fromSource }, ref) => {

  const dynamicFormRefSurg = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefSurg.current?.validateModelForm(),
  }));
  const { t } = useTranslation('common');  
  return (
    <OffcanvasComponent
      show={show}
      title={ (mode) ? t('PATIENT.SURGERY.EDIT_TITLE') : t('PATIENT.SURGERY.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="75%">

      <DynamicForm ref={dynamicFormRefSurg}
        formData={formLabels}
        initialValues={initialValues}
        formReset={formReset}
        isEditMode={mode}
        modelFormTypeahead={handleTypeaheadInputChange}
        columHeaderTypeahead={typeaheadColumnConfig}
        modelFormInputs={handleInputChange} />
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
              {formCurData?.surgery_details.map((surgery: any, index: number) => (
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
});
export default SurgeryForm;