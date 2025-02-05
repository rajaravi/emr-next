import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { execute_axios_post } from '@/utils/services/httpService';
import { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';

import AccountLayout from '@/components/layout/AccountLayout';
import ModalPopUp from '@/components/core-components/ModalPopUp';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';

import { InvoiceFormElements } from '@/data/InvoiceFormElements';
import { ProcedureTable, sampleProcedureTable } from '@/types/procedure';
import { AccountTable, sampleAccountRecords, InvoiceModel } from '@/types/accounts';

import { Patient, typeaheadColumnConfig } from '@/types/patient';
import { idToUuid } from '@/utils/helpers/uuid';
import { EMR_CONFIG } from '@/utils/constants/config'

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { useLoading } from '@/context/LoadingContext';

let pageLimit: number = 8;
let selectedID: number = 0;

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Invoice: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
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

  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('ACCOUNT.INVOICE.SNO'), class: "col-sm-1", field: "sno", format:''},
    { name: t('ACCOUNT.INVOICE.DATE'), class: "col-sm-2", field: "date", format:''},
    { name: t('ACCOUNT.INVOICE.BILL_TO'), class: "col-sm-4", field: "bill_to", format:''},
    { name: t('ACCOUNT.INVOICE.DOCTOR'), class: "col-sm-3", field: "doctor.name", format:''},
    { name: t('ACCOUNT.INVOICE.AMOUNT'), class: "col-sm-2", field: "net_total", format:''},  
  ];

  const filter: { name: string; field: string; }[] = [
    { name: t('ACCOUNT.INVOICE.DATE'), field: 'date' }
  ];

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const [patientList, setPatientList] = useState<{ [key: number]: any }>({});
  const [error, setError] = useState<string | null>(null);

  type Option = {
    label: string;
    value: string;
  };

  useEffect(() => {
    fetchInvoiceList(page);
  }, []);

  const fetchInvoiceList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_INVOICE_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load doctor data.');
    } finally {
      hideLoading();
    }
  };

  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        setPage(1);
        setsearchFilter(sFilter);
        fetchInvoiceList(1,sFilter);
        setClear(true);
    }
  }
  
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchInvoiceList(1);
    setClear(false);
  }
  
  const patientDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      uuid = idToUuid(selectedID).toString();
      router.push(`/patient/${uuid}/patient-details`);
    }
  }
  
  const patientClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
  }

  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row');
    listRows.forEach(function(row) {
      row.classList.remove('selected');
    })
    setPage(currentPage);
    fetchInvoiceList(currentPage, searchFilter);
  }


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
  const updateTypeaheadOptions = (apiData: Option[], appliedString: string) => {
    const updatedConfig = invoiceFormConfig.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {
        return {
          ...field,
          options: apiData,
        };
      }
      return field;
    });
    // console.log("🚀 ~ updatedConfig ~ updatedConfig:", updatedConfig)
    setInvoiceFormConfig(updatedConfig);
  };

  const handleShow = () => {
    setShowModal(true);
    setFormReset(true);    
  };
  const handleClose = () => {
    setShowModal(false);
    setFormReset(false);
    setFormData(initialFormData);
  };

  const createInvoice = () => {
    handleShow();
    setFormData(initialFormData);
  }

  // Edit action call
  const handleEdit = () => {
    
  }

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

  const handleTypeaheadInputChange = async (name: string, selected: any, label: string, isClicked: any = false) => {
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        try {
          let passData: string = JSON.stringify({ search: name, search_type: 1 });
          const response = await execute_axios_post('/patient/get-list', passData); // Replace with your actual API endpoint
          const formData = response.data.map((patient: { id: any; full_name: string; dob: string, mrn_no: string }) => ({
            value: patient.id, // default mandatory typeahead property: value
            label: patient.full_name, // default mandatory typeahead property: label
            
            full_name: patient.full_name,
            mrn_no: patient.mrn_no,
            dob: patient.dob
          }))
          updateTypeaheadOptions(formData, selected);
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {
          setLoading(false);
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }

      } else {
        updateTypeaheadOptions([], ''); // reset the values
      }
    } else {
      setFormReset(false); // block form reset
      setFormData({ ...formData, [name]: selected });
    }

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
            <h1 className="mb-3">{t('ACCOUNT.SIDE_MENU.INVOICE')}</h1>
          </div>
          <Row className="white-bg p-1 m-0 top-bottom-shadow">
            <Col xs={7} className="mt-3 action">
              <Button variant='primary' className='btn rounded-0' onClick={createInvoice}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
              <Dropdown >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
                  {t('ACTIONS.ACTIONS')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={5} className="float-end">
              <SearchFilter 
                filterColumns={filter}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                clear={clear}
                showFilter={true}
              />
            </Col>
          </Row>
          <div>
            <Datalist
              columns={columns}
              list={list}
              onRowDblClick={patientDblClick}
              onRowClick={patientClick}
              page={page}
              total={total}
              pageLimit={pageLimit}
              refreshData={refreshData}
              showPagination={true}
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
              Save & Pay</button>
            <button type="button" style={{ marginRight: '.5rem' }} onClick={() => handleSave('save')} className={`btn btn-success`}>
              Save</button>
            <button type="button" className={`btn btn-warning`} onClick={handleClose}>
              Cancel</button>
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
            columHeaderTypeahead={typeaheadColumnConfig} // table column config for dynamic typeaheader
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
                            Search
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
              Ok</button>
            <button type="button" className={`btn btn-warning`} onClick={handleCloseProcedure}>
              Cancel</button>
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
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default Invoice;
