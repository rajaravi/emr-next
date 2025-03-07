import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { Row, Col, Table, Container, Button } from 'react-bootstrap';
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

interface AppointmentProps {
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
  handleAddItems: (i: any) => void;
  handleRemoveItems: (i: any) => void;
  handleRecordClick: (event: any, i:number) => void;
  handleDiscountInputChange: (event: any) => void;
  formReset: boolean;
  fromSource: string;
  records: any;
  loading: boolean;
  rowID?: number;
  taxValue?: string;
}

const InvoiceForm = forwardRef<DynamicFormHandle, AppointmentProps>(({formLabels, initialValues, formData, editID, show, mode,
  refreshForm, handleTypeaheadInputChange, handleInputChange, formReset, handleAddItems, handleRecordClick, handleDiscountInputChange, handleRemoveItems, handleSave, handleClose, fromSource, records, loading, rowID, taxValue }, ref) => {

  const { t } = useTranslation('common');

  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefApp.current?.validateModelForm(),
  }));

  return (
  <>
  <OffcanvasComponent
      show={show}
      title={ (mode) ? t('ACCOUNT.INVOICE.EDIT_TITLE') : t('ACCOUNT.INVOICE.CREATE_TITLE') }
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
        <Button className='btn bg-primary rounded-0 border-0 float-end mb-1'  onClick={handleAddItems}>Add Row</Button>
        <Table className='invoice-table' >
          <thead>
            <tr>
              <th className='col-sm-2'>Date</th>
              <th className='col-sm-2'>Code</th>
              <th className='col-sm-4'>Procedure</th>
              <th className='col-sm-1 text-end'>Quantity</th>
              <th className='col-sm-1 text-end'>Amount</th>
              <th className='col-sm-1 text-end'>Total</th>
              <th className='col-sm-1 text-end'></th>
            </tr>
          </thead>
          <tbody>            
            {
              formData?.invoice_details.map((procedure: any, index: number) => (
              <tr key={index} style={{verticalAlign: 'middle', borderBottom: '1px solid #ddd'}}>
                <td>
                  <input
                    type="date"
                    name="procedure_date"
                    id={`procedure_date-${index}`}                    
                    value={procedure.procedure_date || new Date().toISOString().split("T")[0]}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="hidden"
                    name="procedure_id"
                    id={`procedure_id-${index}`}
                    placeholder="ID"                    
                    value={procedure.procedure_id}
                    onChange={(e) => handleInputChange(e, index)}                    
                  />
                  <input
                    type="text"
                    name="procedure_code"
                    id={`procedure_code-${index}`}
                    placeholder="Code"                    
                    value={procedure.procedure_code}                    
                    readOnly
                  />
                </td>
                <td style={{position: 'relative'}}>
                  <input 
                    type="text"
                    name="procedure_name"
                    id={`procedure_name-${index}`}                    
                    placeholder="Search Procedure..."                    
                    value={procedure.procedure_name}
                    onChange={(e) => handleInputChange(e, index)}
                    autoComplete='off'               
                    />  
                    {loading && <p>Loading...</p>}   
                    {(records.length > 0 && rowID === index) ? (               
                    <table className="w-full border-collapse border border-gray-300 bg-light" style={{position: 'absolute', width: '100%', top: '40px', zIndex: '10'}}>
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 d-none">ID</th>
                          <th className="border p-2">Code</th>
                          <th className="border p-2">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          records.map((record: any) => (
                            <tr key={record.id} onClick={() => handleRecordClick(record, index)} className="border">
                              <td className="border p-2 d-none">{record.id}</td>
                              <td className="border p-2">{record.code}</td>
                              <td className="border p-2">{record.name}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    ) : '' }
                </td>
                <td>
                  <input
                    type="text"
                    name="quantity"
                    id={`quantity-${index}`}                    
                    value={procedure.quantity}
                    style={{textAlign: 'right'}}
                    onChange={(e) => handleInputChange(e, index)}
                    autoComplete='off'
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="amount"
                    id={`amount-${index}`}                    
                    value={procedure.amount}
                    placeholder=''
                    style={{textAlign: 'right'}}
                    onChange={(e) => handleInputChange(e, index)}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="total"
                    id={`total-${index}`}                    
                    placeholder=''
                    style={{textAlign: 'right'}}
                    value={procedure.total}
                    onChange={(e) => handleInputChange(e, index)}
                    readOnly
                  />
                </td>
                <td className='p-2'>
                  <i className="fi fi-rr-trash text-danger" onClick={() => handleRemoveItems(index)}></i>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{borderStyle: 'hidden'}}>
              <td colSpan={4} className='p-0 bg-transparent border-0'></td>
              <td className='p-0 bg-transparent border-0'> Net Total</td>
              <td className='p-0 bg-transparent'>
                <input type="text" value={formData?.net_total} name="net_total" className='form-control text-end' placeholder='0.00' readOnly/>
              </td>
              <td className='p-0 bg-transparent'>&nbsp;</td>
            </tr>
            <tr style={{borderStyle: 'hidden'}}>
              <td colSpan={4} className='p-0 bg-transparent border-0'></td>
              <td className='p-0 bg-transparent border-0'>Discount</td>
              <td className='p-0 bg-transparent'>
                <input type="text" value={formData?.discount} name="discount" className='form-control text-end' onChange={(e) => handleDiscountInputChange(e)} />
              </td>
              <td className='p-0 bg-transparent'>&nbsp;</td>
            </tr>
            <tr style={{borderStyle: 'hidden'}}>
              <td colSpan={4} className='p-0 bg-transparent border-0'></td>
              <td className='p-0 bg-transparent border-0 pt-2'>Tax <span id="taxPerc">{formData?.tax_percentage ? formData?.tax_percentage : taxValue}</span>% </td>
              <td className='p-0 bg-transparent'>
                <input type="text" value={formData?.tax_rate} name="tax_rate" className='form-control text-end' placeholder='0.00' readOnly/>
                <input type="hidden" value={formData?.tax_percentage ? formData?.tax_percentage : taxValue} name="tax_percentage"/>
              </td>
              <td className='p-0 bg-transparent'>&nbsp;</td>
            </tr>
            <tr style={{borderStyle: 'hidden'}}>
              <td colSpan={4} className='p-0 bg-transparent border-0'><input type="hidden" value={formData?.waived_rate} name="waived_rate" readOnly/></td>
              <td className='p-0 bg-transparent border-0'>Grant Total</td>
              <td className='p-0 bg-transparent'>
                <input type="text" value={formData?.grand_total} name="grant_total" className='form-control text-end' placeholder='0.00'  readOnly/>
              </td>
              <td className='p-0 bg-transparent'>&nbsp;</td>
            </tr>
          </tfoot>
        </Table>
      </Container>
    </OffcanvasComponent>
  </>
  )
});

export default InvoiceForm;