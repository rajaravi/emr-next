import React, { useEffect, useRef, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
import { execute_axios_get } from '@/utils/services/httpService';
import { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faPrint, faSave, faClose, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';

import AccountLayout from '@/components/layout/AccountLayout';
import ModalPopUp from '@/components/core-components/ModalPopUp';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';

import { InvoiceFormElements } from '@/data/InvoiceFormElements';
import { ProcedureTable, sampleProcedureTable } from '@/types/procedure';
import { AccountTable, sampleAccountRecords, InvoiceModel } from '@/types/accounts';

import { Patient } from '@/types/patient';
import { idToUuid } from '@/utils/helpers/uuid';
import { EMR_CONFIG } from '@/utils/constants/config'

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';


export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Invoice: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  let uuid;
  const initialFormData: InvoiceModel = {
    invDate: new Date().toISOString().split("T")[0],
    doctor: '',
    incomeCategory: '',
    billTo: '',
    patientName: '',
    tax: '',
    procedures: [
      { 
        date: new Date().toISOString().split("T")[0],
        code: 0, procedure: '', quantity: 1, cost: 0, total: 0 },
    ],
    subTotal: 0,
    discount: 0,
    taxAmount: 0,
    netTotal: 0,
  };
  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<AccountTable | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureTable | null>(null);
  const [rowData, setRowData] = useState<AccountTable[]>([]);
  const [rowProcedureData, setProcedureRowData] = useState<ProcedureTable[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [columnProcedureDefs, setProcedureColumnDefs] = useState<ColDef[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formReset, setFormReset] = useState(false);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [procedureIndex, setProcedureIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<InvoiceModel>(initialFormData);
  const [invoiceFormConfig, setInvoiceFormConfig] = useState<any>(InvoiceFormElements);

  const [patientList, setPatientList] = useState<{ [key: number]: any }>({});
  const [error, setError] = useState<string | null>(null);

  type Option = {
    label: string;
    value: string;
  };

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await execute_axios_get('/mock/getPatientList'); // Replace with your actual API endpoint
        updateTypeaheadOptions(response.data);
      } catch (err) {
        setError('Failed to load patient data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchAccountData = async () => {
      const rowDataFromApi: AccountTable[] = sampleAccountRecords;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'Inv.No', field: 'inv_no', sortable: true, filter: true, resizable: true, width: 250  },
        { headerName: 'Date', field: 'inv_date', valueFormatter: (params) => params.value.toLocaleDateString() },
        { headerName: 'Doctor', field: 'doctor_name', sortable: true, filter: true, resizable: true, width: 120 },
        { headerName: 'Patient', field: 'patient_name', sortable: true, filter: true, resizable: true, width: 300 },
        { headerName: 'Bill To', field: 'bill_to' },
        { headerName: 'Amount', field: 'amount' },
        { headerName: 'Balance', field: 'balance' },
      ];

      setRowData(rowDataFromApi);
      setColumnDefs(columnDefsFromApi);
    };

    fetchAccountData();
  }, []);

  useEffect(() => {
    const fetchProcedureData = async () => {
      const rowDataFromApi: ProcedureTable[] = sampleProcedureTable;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'S.No', field: 's_no', sortable: true, filter: false, resizable: false, width: 80  },
        { headerName: 'Code', field: 'code', sortable: true, filter: false, resizable: false, width: 100 },
        { headerName: 'Name', field: 'procedure_name', sortable: true, filter: false, resizable: true, width: 470 },
        { headerName: 'Rate', field: 'rate', resizable: false, width: 100 }
      ];

      setProcedureRowData(rowDataFromApi);
      setProcedureColumnDefs(columnDefsFromApi);
    };

    fetchProcedureData();
  }, []);

  // Function to update options in form config
  const updateTypeaheadOptions = (apiData: Option[]) => {
    const updatedConfig = invoiceFormConfig.map((field: { type: string; }) => {
        if (field.type === "typeahead") {
            return {
                ...field,
                options: apiData,
            };
        }
        return field;
    });
    setInvoiceFormConfig(updatedConfig);
  };

  const handleShow = () => {
    setShowModal(true);
    setFormReset(true);
    setFormData(initialFormData);
  };
  const handleClose = () => {
    setShowModal(false);
    setFormReset(false);
    setFormData(initialFormData);
  };

  const onInvoiceDoubleClicked = (event: RowDoubleClickedEvent<AccountTable>): void => {
    if (event.data) {
      const inv_no = event.data.inv_no;
      console.log("🚀 ~ uuid:onInvoiceDoubleClicked ", inv_no);
    } else {
      console.error('Row data is undefined');
    }
  };

  const onInvoiceClicked = (event: RowDoubleClickedEvent<AccountTable>): void => {
    if (event.data) {
      const invoiceID = event.data;
      console.log("🚀 ~ onInvoiceClicked:", invoiceID);
      setSelectedInvoice(invoiceID)
    }
  };

  const onProcedureDoubleClicked = (event: RowDoubleClickedEvent): void => {
    setSelectedProcedure(event.data);
    handleOkProcedure();
    setShowProcedureModal(false);
    console.log("🚀 ~ onProcedureDoubleClicked----> 1:", event.data);
  }
  const handleProcedureSelect = (event: RowClickedEvent): void => {
    setSelectedProcedure(event.data)
    console.log("🚀 ~ handleProcedureSelect---> 2:", event.data);
  }

  const handleShowProcedure = (index: React.SetStateAction<number | null>) => {
    setProcedureIndex(index);
    setShowProcedureModal(true);
  };
  const handleCloseProcedure = () => {
    setShowProcedureModal(false)
  };
  const handleOkProcedure = () => {
    const updatedProcedures = [...formData.procedures];
    if (procedureIndex !== null && selectedProcedure) {
      updatedProcedures[procedureIndex] = {
        ...updatedProcedures[procedureIndex],
        procedure: selectedProcedure.procedure_name,
        cost: selectedProcedure.rate,
        code: selectedProcedure.code,
      };
      const updatedFormData = { ...formData, procedures: updatedProcedures };
      setFormData(updatedFormData);
      setShowProcedureModal(false);

      // Auto Calculate Total, Discount, Tax
      calculateInvoice(updatedFormData)
    }
    console.log("🚀 ~ handleOkProcedure--updatedProcedures---> 3:", procedureIndex, updatedProcedures, selectedProcedure, formData);
    setSelectedProcedure(null)
  }
  // Function to add a new procedure row
  const handleAddProcedure = () => {
    const newProcedure = { date: '', code: 0, procedure: '', quantity: 1,
      cost: 0,
      total: 0,
    };
    setFormData({
      ...formData,
      procedures: [...formData.procedures, newProcedure],
    });
  };

  // Function to remove a procedure row
  const handleRemoveProcedure = (index: number) => {
    const updatedProcedures = formData.procedures.filter((_, i) => i !== index);
    // setFormData({ ...formData, procedures: updatedProcedures });
    const updatedFormData = { ...formData, procedures: updatedProcedures };
    setFormData(updatedFormData);
    console.log("🚀 ~ handleRemoveProcedure ~ formData:", updatedProcedures, updatedFormData, formData)
    // Auto Calculate Total, Discount, Tax
    calculateInvoice(updatedFormData)
  };

  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedProcedures = [...formData.procedures];
      updatedProcedures[index] = { 
        ...updatedProcedures[index], [name]: value
      };
      const updatedFormData = { ...formData, procedures: updatedProcedures };
      setFormData(updatedFormData);

      // Auto Calculate Total, Discount, Tax
      calculateInvoice(updatedFormData)
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTypeaheadInputChange = (name: string, selected: any) => {
    setFormReset(false); // block form reset
    setFormData({ ...formData, [name]: selected });
  };
  // Function to calculate invoice
  const calculateInvoice = (invoice: InvoiceModel) => {
    // Case 1: Calculate total for each procedure
    invoice.procedures = invoice.procedures.map((procedure) => {
      procedure.total = procedure.cost * procedure.quantity;
      return procedure;
    });
  
    // Case 2: Calculate subtotal
    invoice.subTotal = invoice.procedures.reduce((sum, procedure) => sum + procedure.total, 0);
  
    // Case 3: Apply discount and calculate taxAmount
    const discountAmount = (invoice.subTotal * EMR_CONFIG.INVOICE_DISCOUNT_PERCENTAGE) / 100;
    invoice.discount = discountAmount;
  
    const taxableAmount = invoice.subTotal - discountAmount;
    const taxAmount = (taxableAmount * EMR_CONFIG.INVOICE_TAX_PERCENTAGE) / 100;
    invoice.taxAmount = taxAmount;
  
    // Calculate netTotal
    invoice.netTotal = taxableAmount + taxAmount;
  
    return invoice;
  };

  // Function to handle post form data
  const handleSave = async (action: string) => {
    // Save or Save & Pay based on action
    console.log('Form Action & Data: ', action, formData);

    if (dynamicFormRef.current?.validateModelForm()) {
      console.log('Form is valid', dynamicFormRef);
      handleClose()
    } else {
      console.log('Form is invalid', dynamicFormRef);
    }
    // Call API to save the data
    // await api.saveInvoice(formData);

    if (action === 'savePay') {
      // Logic for Save & Pay
    }
  }

  return (
    <>
      <AccountLayout>
        <div className="container-fluid mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={`${styles.title} mb-3`}>Invoice</h1>
            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} btn btn-success`} onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Add New</button>
              <button className={`${styles.btn} btn btn-primary`}>
                <FontAwesomeIcon icon={faEdit} /> Edit</button>
              <button className="btn btn-info">
                <FontAwesomeIcon icon={faPrint} /> Print</button>
            </div>
          </div>
        <div>
          <AgGridComponent<AccountTable>
            rowData={rowData}
            columnDefs={columnDefs}
            onRowDoubleClicked={onInvoiceDoubleClicked}
            onRowClicked={onInvoiceClicked}
            customGridOptions={{ suppressCellSelection: true }}
          />
        </div>
      </div>
      </AccountLayout>

      {/* ModalPopUp component with custom content */}
      <ModalPopUp
        show={showModal}
        handleClose={handleClose}
        title="Add Invoice"
        sizeElement="custom-modal-width"
        footer={
          <>
            <button type="button" style={{ marginRight: '.5rem' }} onClick={() => handleSave('savePay')} className={`btn btn-success`}>
              <FontAwesomeIcon icon={faSave} /> Save & Pay</button>
            <button type="button" style={{ marginRight: '.5rem' }} onClick={() => handleSave('save')} className={`btn btn-success`}>
              <FontAwesomeIcon icon={faSave} /> Save</button>
            <button type="button" className={`btn btn-warning`} onClick={handleClose}>
              <FontAwesomeIcon icon={faClose} /> Cancel</button>
          </>
        }
      >
        {/* Form content goes here */}
        <div className="container mt-4">
          <DynamicForm ref={dynamicFormRef}
            formData={invoiceFormConfig}
            formReset={formReset}
            initialValues={initialFormData}
            modelFormInputs={handleInputChange}
            modelFormTypeahead={handleTypeaheadInputChange}
            colClass="col-md-4"
          />
          <div className="container">
            <Table >
              <thead >
                <tr >
                  <th style={{backgroundColor: '#07839c', color: 'white'}}>Date</th>
                  <th style={{backgroundColor: '#07839c', color: 'white', width: '15%'}}>Code</th>
                  <th style={{backgroundColor: '#07839c', color: 'white', width: '40%'}}>Procedure</th>
                  <th style={{backgroundColor: '#07839c', color: 'white', width: '5%'}}>Quantity</th>
                  <th style={{backgroundColor: '#07839c', color: 'white'}}>Cost</th>
                  <th style={{backgroundColor: '#07839c', color: 'white', width: '10%'}}>Total</th>
                  <th style={{backgroundColor: '#07839c', color: 'white'}}></th>
                </tr>
              </thead>
              <tbody>
                {/* {rows.map((row, index) => ( */}
                {formData.procedures.map((procedure, index) => (
                  <tr key={index} style={{borderStyle: 'hidden'}}>
                    <td>
                      <input
                        type="date"
                        name="date"
                        id={`date-${index}`}
                        className="form-control"
                        value={procedure.date || new Date().toISOString().split("T")[0]}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="code"
                        id={`code-${index}`}
                        placeholder="Code"
                        className="form-control"
                        value={procedure.code}
                        onChange={(e) => handleInputChange(e, index)}
                        disabled
                      />
                    </td>
                    <td>
                      <div className="input-group">
                        <input 
                          type="text"
                          name="procedure"
                          id={`procedure-${index}`}
                          className="form-control"
                          value={procedure.procedure} 
                          placeholder="Search Procedure..." 
                          disabled />
                        <div className="input-group-append">
                          <span className={`input-group-text ${styles.searchClass}`} onClick={() => handleShowProcedure(index)}>
                            <FontAwesomeIcon icon={faSearch} />
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        id={`quantity-${index}`}
                        className="form-control"
                        value={procedure.quantity}
                        style={{textAlign: 'right'}}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="cost"
                        id={`cost-${index}`}
                        className="form-control"
                        value={procedure.cost}
                        placeholder='0.00'
                        style={{textAlign: 'right'}}
                        onChange={(e) => handleInputChange(e, index)}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="total"
                        id={`total-${index}`}
                        className="form-control"
                        placeholder='0.00'
                        style={{textAlign: 'right'}}
                        value={procedure.total}
                        onChange={(e) => handleInputChange(e, index)}
                        disabled
                      />
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemoveProcedure(index)}>×</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Table >
              <tbody className='secondaryRow'>
                <tr style={{borderStyle: 'hidden'}}>
                  <td style={{width: '76%'}}>
                    <Button variant="success" onClick={handleAddProcedure}>
                      Add Row
                    </Button>
                  </td>
                  <td style={{width: '10%'}}> Sub Total</td>
                  <td style={{width: '10%'}}>
                    <input disabled type="text" value={formData.subTotal} className="form-control" id="inputZip"  placeholder='0.00' style={{textAlign: 'right'}}/>
                  </td>
                  <td >&nbsp;</td>
                </tr>
                <tr style={{borderStyle: 'hidden'}}>
                  <td > &nbsp;</td>
                  <td >Discount <span className={`${styles.highlightDiscount}`}>{EMR_CONFIG.INVOICE_DISCOUNT_PERCENTAGE}%</span></td>
                  <td >
                    <input disabled type="text" value={formData.discount} className="form-control" id="inputZip" placeholder='0.00' style={{textAlign: 'right'}}/>
                  </td>
                  <td >&nbsp;</td>
                </tr>
                <tr style={{borderStyle: 'hidden'}}>
                  <td > &nbsp;</td>
                  <td >Tax <span className={`${styles.highlightTax}`}>{EMR_CONFIG.INVOICE_TAX_PERCENTAGE}%</span></td>
                  <td >
                    <input disabled type="text" value={formData.taxAmount} className="form-control" id="inputZip"  placeholder='0.00' style={{textAlign: 'right'}}/>
                  </td>
                  <td >&nbsp;</td>
                </tr>
                <tr style={{borderStyle: 'hidden'}}>
                  <td > &nbsp;</td>
                  <td >Net Total</td>
                  <td >
                    <input disabled type="text" value={formData.netTotal} className="form-control" id="inputZip" placeholder='0.00' style={{textAlign: 'right'}}/>
                  </td>
                  <td >&nbsp;</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </ModalPopUp>

      <ModalPopUp
        show={showProcedureModal}
        handleClose={handleCloseProcedure}
        title="Procedure"
        sizeElement="modal-lg modal-dialog-centered"
        footer={
          <>
            <button type="button" style={{ marginRight: '.5rem' }} className={`btn btn-success`}  onClick={handleOkProcedure}>
              <FontAwesomeIcon icon={faCheck} /> Ok</button>
            <button type="button" className={`btn btn-warning`} onClick={handleCloseProcedure}>
              <FontAwesomeIcon icon={faClose} /> Cancel</button>
          </>
        }
      >
        <AgGridComponent<ProcedureTable>
          rowData={rowProcedureData}
          columnDefs={columnProcedureDefs}
          onRowDoubleClicked={onProcedureDoubleClicked}
          onRowClicked={handleProcedureSelect}
          customGridOptions={{ suppressCellSelection: true, paginationPageSize: 7 }}
        />
      </ModalPopUp>
    </>
  );
};

export default Invoice;
