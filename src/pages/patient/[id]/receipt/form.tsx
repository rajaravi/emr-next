import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { Row, Col, Table, Container, Button, Form } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import { EMR_CONFIG } from '@/utils/constants/config';
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

interface ReceiptProps {
  formLabels: [];
  initialValues: [];
  formData:any;
  editID: number;
  show: boolean;
  mode: boolean;
  handleClose: () => void;
  handleSave: () => void;
  refreshForm: (event: any) => void;
  handleTypeaheadInputChange: (name: string, selected: any, label: string) => void;
  handleInputChange: (event: any, i: number) => void;  
  handleReceiptCheckBoxChange: (i:number) => void;
  handleCheckAllChange: () => void;
  formReset: boolean;
  fromSource: string;
  TotalInvoiceAmount?: number;
  checkAll: any;
  checkedItems: any;
}

const ReceiptForm = forwardRef<DynamicFormHandle, ReceiptProps>(({formLabels, initialValues, formData, editID, show, mode,
  refreshForm, handleTypeaheadInputChange, handleInputChange, handleReceiptCheckBoxChange, handleCheckAllChange, formReset, handleSave, handleClose, fromSource, TotalInvoiceAmount, checkAll, checkedItems }, ref) => {

  const { t } = useTranslation('common');

  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefApp.current?.validateModelForm(),
  }));

  // get time from start and end time of surgery
  const formatDate = (dateTime: any) => {
    let splitDate = dateTime.split("-");
    if(splitDate[0].length === 4) {
      dateTime = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    }
    return dateTime; // Format as HH:mm
  };
  console.log('checkedItems',checkedItems);
  return (
  <>
  <OffcanvasComponent
      show={show}
      title={ (mode) ? t('ACCOUNT.RECEIPT.EDIT_TITLE') : t('ACCOUNT.RECEIPT.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="85%">
      <Row>
        <Col>
          <DynamicForm ref={dynamicFormRefApp}
            formData={formLabels}
            initialValues={initialValues}
            formReset={formReset}
            isEditMode={mode}
            modelFormTypeahead={handleTypeaheadInputChange}
            columHeaderTypeahead={typeaheadColumnConfig}
            modelFormInputs={handleInputChange} />
        </Col>             
      </Row>
      <Container className='p-0'>        
        <Table className='receipt-table' >
          <thead>
            <tr>
              <th className='col-sm-1'><Form.Check 
                type='checkbox'                
                id="checkAll"
                checked={checkAll}
                onChange={handleCheckAllChange}
              />
              </th>
              <th className='col-sm-1'>Invoice No.</th>
              <th className='col-sm-1 text-center'>Invoice Date</th>
              <th className='col-sm-1 text-end'>Inv. Amount</th>
              <th className='col-sm-1 text-end'>Balance</th>
              <th className='col-sm-1 text-end'>Tax</th>
              <th className='col-sm-1 text-end'>Wavied</th>
              <th className='col-sm-1 text-end'>Net Total</th>
              <th className='col-sm-1 text-end'>Payment</th>
            </tr>
          </thead>
          <tbody>            
            {
              formData?.receipt_details.map((receipt: any, index: number) => (
              <tr key={index} style={{verticalAlign: 'middle', borderBottom: '1px solid #ddd'}}>
                <td>
                  <Form.Check type='checkbox' name={`inv-${index}`} value={receipt.id} onChange={() => handleReceiptCheckBoxChange(receipt.id)} checked={checkedItems.includes(receipt.id)} />
                </td>
                <td>{receipt.id}</td>
                <td className='text-center'>{formatDate(`${receipt.date}`)}</td>
                <td className='text-end'>{receipt.grand_total}</td>
                <td><input 
                  type="text" 
                  name="balance" 
                  id={`balance-${index}`} 
                  value={receipt.balance} 
                  className='text-end' 
                  readOnly />
                </td>
                <td><input 
                  type="text" 
                  name="tax_rate" 
                  id={`tax_rate-${index}`} 
                  value={0} 
                  className='text-end' 
                  readOnly />
                </td>
                <td><input 
                  type="text" 
                  name="waived_rate" 
                  id={`waived_rate-${index}`} 
                  value={receipt.waived_rate} 
                  onChange={(e) => handleInputChange(e, index)}
                  className='text-end' />
                </td>
                <td><input 
                  type="text" 
                  name="net_total" 
                  id={`net_total-${index}`} 
                  value={receipt.grand_total} 
                  className='text-end'
                  readOnly />
                </td>
                <td><input 
                  type="text" 
                  name="paid" 
                  id={`paid-${index}`} 
                  value={receipt.paid} 
                  className='text-end'
                  onChange={(e) => handleInputChange(e, index)} 
                  autoComplete='off'/>
                </td>
              </tr>
            ))
            }
          </tbody>
          <tfoot>
            <tr style={{borderStyle: 'hidden'}}>
              <td colSpan={2} className='p-0 bg-transparent border-0'></td>
              <td className='p-0 bg-transparent border-0'>Total</td>
              <td className='p-0 bg-transparent'>{TotalInvoiceAmount}</td>
              <td className='p-0 bg-transparent'><input 
                type="text" 
                value={formData?.balance} 
                name="balance" 
                className='text-end' 
                readOnly />
              </td>
              <td className='p-0 bg-transparent'><input 
                type="text" 
                value={formData?.tax_rate} 
                name="tax_rate" 
                className='text-end' 
                readOnly />
                <input type="text" 
                  value={formData?.tax_percentage} 
                  name="tax_percentage" 
                  className='text-end' 
                  readOnly />
                </td>
              <td className='p-0 bg-transparent'><input 
                type="text" 
                value={formData?.waived_rate} 
                name="waived_rate" 
                className='text-end' 
                readOnly />
              </td>
              <td className='p-0 bg-transparent'><input 
                type="text" 
                value={formData?.net_total} 
                name="net_total" 
                className='text-end' 
                readOnly />
              </td>
              <td className='p-0 bg-transparent'><input 
                type="text" 
                value={formData?.grand_total} 
                name="grand_total" 
                className='text-end' 
                readOnly />
              </td>
            </tr>
          </tfoot>
        </Table>
        <Row>
          <Col xs={6}>
            <label className='form-label'>Notes</label>
            <Form.Control as="textarea" name='notes' value={formData.notes} onChange={handleInputChange} />
          </Col>
        </Row>
      </Container>
    </OffcanvasComponent>
  </>
  )
});

export default ReceiptForm;