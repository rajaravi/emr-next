import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
// Translation logic - start
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { uuidToId } from '@/utils/helpers/uuid';
import ReceiptForm from './form';
import { ReceiptFormElements } from '@/data/ReceiptFormElements';
import { ReceiptModel } from '@/types/receipt';

interface Item {
  id: number;
  name: string;
}

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

let pageLimit: number = 6;
let selectedID: number = 0;
let archiveID: number = 0;
let rowID: number | undefined = 0;
const todayDate = new Date().toISOString().split('T')[0];

const initialValue = {
  patient_id: 0,
  patients: [{value: 0, label: ''}],
  date: '',
  doctor_id: 0,
  tags: '',
  payee_id: 0,
  tax_id: 0,
  purchaser_id: 0,
  purchaser_plan_id: 0,
  discount: '',
  tax_percentage: '',
  tax_rate: '',
  waived_rate: '',
  grand_total: '',
  net_total: '',
  balance: '',
  notes: '',
  receipt_details: [{
    invoice_id: 0,
    balance: '',
    tax_rate: '',
    waived_rate: '',
    net_total: '',
    paid: ''
  }] 
};

const Receipt: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = id ? uuidToId(id) : 0;
  
  const columns: { name: string; class: string; field: string; format?: string }[] = [
    { name: t('ACCOUNT.RECEIPT.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('ACCOUNT.RECEIPT.DATE'), class: "col-sm-1", field: "date", format:'date'},
    { name: t('ACCOUNT.RECEIPT.DOCTOR'), class: "col-sm-2", field: "doctor.name"},
    { name: t('ACCOUNT.RECEIPT.PAYEE'), class: "col-sm-3", field: "payee"},    
    { name: t('ACCOUNT.RECEIPT.NET_TOTAL'), class: "col text-end text-success", field: "net_total"},
    { name: t('ACCOUNT.RECEIPT.DISCOUNT'), class: "col text-end text-danger", field: "discount"},
    { name: t('ACCOUNT.RECEIPT.TAX'), class: "col text-end text-info", field: "tax_rate"},
    { name: t('ACCOUNT.RECEIPT.GRAND_TOTAL'), class: "col text-end text-primary", field: "grand_total"}
  ];

  const filter: { name: string; field: string; }[] = [
    { name: t('ACCOUNT.RECEIPT.DATE'), field: 'date' }
  ];

  const [show, setShow] = useState(false);
  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);  
  const [total, setTotal] = useState<number>(0);  
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);  
  const [list, setList] = useState<any>([]);
  const [selectedInvoice, setSelectedReceipt] = useState<number>(0);
  const [taxValue, setTaxValue] = useState<string>('');  
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const isAllChecked = checkedItems.length === items.length && items.length > 0;
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
    
  const initialFormData: ReceiptModel = { 
    "id": null,
    "patient_id": 0,
    "patients": [{value: 0, label: ''}],
    "date": '',
    "doctor_id": 0,
    "tags": '',
    "payee_id": 0,
    "tax_id": 0,
    "purchaser_id": 0,
    "purchaser_plan_id": 0,
    "discount": '',
    "tax_percentage": '',
    "tax_rate": '',
    "waived_rate": '',
    "grand_total": '',
    "net_total": '',
    "balance": '',
    "notes": '',
    "receipt_details": [{
      "invoice_id": 0,
      "balance": '',
      "tax_rate": '',
      "waived_rate": '',
      "net_total": '',
      "paid": ''
    }]
  };

  const [formData, setFormData] = useState<ReceiptModel>(initialFormData);
  // Onload function
  useEffect(() => {
    // Language apply for form label
    const filteredElements = ReceiptFormElements.filter((element) => element.name !== "patients");
    const translatedFormElements = filteredElements.map((element) => {
      return {
        ...element,
        label: t(`ACCOUNT.RECEIPT.${element.label}`),
      };
    });
    setTranslatedElements(translatedFormElements);    
    fetchReceiptList(page);
  }, []);

  // Get doctor list
  const fetchReceiptList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter, patient_id: uuidToId(id) });
      const response = await execute_axios_post(ENDPOINTS.POST_RECEIPT_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load doctor data.');
    } finally {
      hideLoading();
    }
  }; 

  // Search button call
  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
      const sFilter = {
        field: (document.getElementById('searchType') as HTMLSelectElement).value,
        text: searchTextElement.value
      }
      setPage(1);
      setsearchFilter(sFilter);
      fetchReceiptList(1,sFilter);
      setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchReceiptList(1);
    setClear(false);
  }

  // List double click
  const receiptDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedReceipt(selectedID);
    }
    getReceiptById('edit');
  }

  // List single click
  const receiptClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedReceipt(selectedID);
  }

  // Edit action call
  const createReceipt = () => {    
    getReceiptById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedInvoice == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getReceiptById('edit');
  } 

  // Archive action call
  const handleArchive = async(event: any) => {
    showLoading();
    try {
      archiveID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: archiveID, is_archive: event.target.checked });
      const response = await execute_axios_post(ENDPOINTS.POST_RECEIPT_ARCHIVE, passData);      
      if(response.success) { 
        if(event.target.checked === true) {
          handleShowToast(t('ACCOUNT.MESSAGES.UNARCHIVE'), 'dark');
        }
        if(event.target.checked === false) {
          handleShowToast(t('ACCOUNT.MESSAGES.ARCHIVE'), 'success');
        }
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
        hideLoading();
    }
  }

  // Callback function form save to list refresh
  const refreshForm = () => {
    refreshData(page);
  }

  // Callback function for pagination change event
  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row'); // Selection row remove when the page change 
    listRows.forEach(function(row){
      row.classList.remove('selected');
    })
    setSelectedReceipt(0);
    setPage(currentPage);
    fetchReceiptList(currentPage, searchFilter);
  }
 
  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const getReceiptById = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedInvoice;
      let passData: string = JSON.stringify({ id: editID, patient_id: patientId });      
      showLoading();
      const response = await execute_axios_post(ENDPOINTS.POST_RECEIPT_FORMDATA, passData);
      if(response.success) {
        handleShow();
        if(response.data?.data?.id) {          
          const formData = response.data?.data;
          const patientData = {value: formData.patient.id, label: formData.patient.full_name, full_name: formData.patient.full_name, mrn_no: formData.patient.mrn_no, dob: formData.patient.dob}
          const updatedData = Object.assign({}, formData, { patients: [patientData] });
          setInitialValues(updatedData);
          setFormData(updatedData);
          setMode(true);
        } else {
          let passData: any = { id: uuidToId(id) };
          const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_FORMDATA, passData);
          const bindData = {value: response.data.data.id, label: response.data.data.full_name, full_name: response.data.data.full_name, mrn_no: response.data.data.mrn_no, dob: response.data.data.dob} 
          const updatedData = Object.assign({}, initialFormData, { patients: [bindData] });
          setInitialValues(updatedData);
          setFormData(updatedData);
        }
        fetchInvoices();
        
        
        let doctor = new Array;
        if(response.data.doctors) {
          response.data.doctors.map((doc: any, d: number) => {
            doctor.push({'label':doc.name, 'value': doc.id});
          })
        }        
        let payType = new Array;
        if(response.data.payment_types) {
          response.data.payment_types.map((loc: any, l: number) => {
            payType.push({'label':loc.name, 'value': loc.id});
          })
        }
        let payee = new Array;
        if(response.data.payees) {
          response.data.payees.map((pay: any, p: number) => {
            payee.push({'label':pay.description, 'value': pay.id});
          })
        }
        let purchaser = new Array;
        if(response.data.purchasers) {
          response.data.purchasers.map((pur: any, p: number) => {
            purchaser.push({'label':pur.name, 'value': pur.id});
          })
        }
        let taxes = new Array;
        if(response.data.taxes) {
          response.data.taxes.map((tax: any, t: number) => {
            taxes.push({'label':tax.name, 'value': tax.id, 'customAttr': tax.percentage});            
          })
        }
        let rectags = new Array;
        if(response.data.income_categories) {
          response.data.income_categories.map((ivt: any, i: number) => {
            rectags.push({'label':ivt.name, 'value': ivt.id});            
          })
        }
        let contact = new Array;
        if(response.data.contacts) {
          response.data.contacts.map((con: any, c: number) => {
            contact.push({'label':con.firstname+' '+con.surname, 'value': con.id});            
          })
        }

        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
          else if(elements.name == 'payment_types') {
            elements.options = [];
            elements.options = payType;
          }
          else if(elements.name == 'payee_id') {
            elements.options = [];
            elements.options = payee;
          }
          else if(elements.name == 'tax_id') {
            elements.options = [];
            elements.options = taxes;
          }
          else if(elements.name == 'tags') {
            elements.options = [];
            elements.options = rectags;
          }          
          else if(elements.name == 'purchaser_id') {
            elements.options = [];
            elements.options = purchaser;
          }
          else if(elements.name == 'contact_id') {
            elements.options = [];
            elements.options = contact;
          }
          
        })   
        setTimeout(() => {          
          const patientElement = document.querySelector(".patientName");
          if (patientElement) {            
            // patientElement.classList.add("d-none");            
          }
        }, 100);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
        hideLoading();
    }    
  }
  const handleShow = () => {
    setShow(true);   
  }
  const handleClose = () => {
      setShow(false);
      setMode(false);
  }

  // Save button handler
  const handleSave = async () => {
    console.log(formData);
    showLoading();
    // Implement your save logic here
    if (dynamicFormRefApp.current?.validateModelForm()) {
      try {
        if (formData.patients[0]?.value) {
          formData.patient_id = formData.patients[0].value
        }
        formData.discount = "0.00";
        const response = await execute_axios_post(ENDPOINTS.POST_RECEIPT_STORE, formData);
        if(response.success) {
          handleShowToast(t('ACCOUNT.RECEIPT.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error creating an appointment:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRefApp);
      hideLoading();
    }
  };
  
  const handleTypeaheadInputChange = async (name: string, selected: any, label: string, isClicked: any = false) => {
    if ( ! isClicked) {
      if (name.length >= 3) {
        showLoading();
        const typeahead = translatedElements.map((field: { type: string; name: string }) => {
          if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === selected) {
            return field;
          }
        })[0];
        try {
          let passData: string = JSON.stringify({ search: name, search_type: 1 });
          const response = await execute_axios_post('/patient/get-list', passData); // Replace with your actual API endpoint
          const formData = response.data.map((patients: { id: any; full_name: string; dob: string, mrn_no: string }) => ({
            value: patients.id, // default mandatory typeahead property: value
            label: patients.full_name, // default mandatory typeahead property: label            
            full_name: patients.full_name,
            mrn_no: patients.mrn_no,
            dob: patients.dob            
          }))  
          updateTypeaheadOptions(formData, selected, name);
        } catch (err) {
          setError('Failed to load patient data.');
        } finally {
          setTimeout(() => {
            hideLoading();
          }, 1000);
        }

      } else {
        // setFormData({ ...formData, [name]: name });
      }
    } else {
      setFormReset(false); // block form reset
      setFormData({ ...formData, ['patients']: selected });
    }  
  };

  // Function to update options in form config
  const updateTypeaheadOptions = (apiData: any, appliedString: string, search_text: string|null = null, isClicked: any = false) => {
    const updatedConfig = translatedElements.map((field: { type: string; name: string }) => {
      if (["typeahead", "typeaheadDynamic"].includes(field.type) && field.name === appliedString) {
        if (initialValues.id > 0 && search_text) {
          if (!isClicked) {
            return {
              ...field,
              value: {},
              name: search_text,
              options: apiData,
            };
          } else {
            return {
            ...field,
            value: apiData,
            options: apiData,
          };
          }
        } else {
          return {
            ...field,
            options: apiData,
          };
        }
      } 
      return field;
    });
    setTranslatedElements(updatedConfig);    
  };

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedItems = [...formData.receipt_details];
      updatedItems[index] = { 
        ...updatedItems[index], [name]: value
      };
      const updatedFormData = { ...formData, receipt_details: updatedItems };
      setFormData(updatedFormData);

      // Auto Calculate Total, Discount, Tax
      calculateRecepit(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch invoices records from the API
  const fetchInvoices = async () => {
    try {      
      let passData: string = JSON.stringify({ patient_id: 1, is_paid: 1});
      const response = await execute_axios_post(ENDPOINTS.POST_INVOICE_GETLIST, passData);    
      const updatedFormData = { ...formData, receipt_details: response.data };
      setFormData(updatedFormData);
      setItems(response.data);            
    } catch (error) {
      setError('Error fetching patient data:');
    }
  };

  // Function to calculate invoice
  const calculateRecepit = (receipt: ReceiptModel) => {
    // Case 1: Calculate total for each invoice
    receipt.receipt_details = receipt.receipt_details.map((item: any) => {
      item.paid = item.grand_total - item.waived_rate;
      return item;
    });    

    // Case 2: Calculate subtotal
    receipt.grand_total = Number(receipt.receipt_details.reduce((sum, item) => sum + item.paid, 0));
    // if(receipt.net_total) {     
    //   const TotalAfterDiscount = (receipt.net_total - Number(disVal));      
    //   const calcTaxRate = (TotalAfterDiscount * Number(taxVal)) / 100;
    //   console.log('calcTaxRate', calcTaxRate, 'TotalAfterDiscount', TotalAfterDiscount)
    //   receipt.tax_rate = Number(calcTaxRate.toFixed(2));
    //   receipt.grand_total = String((Number(TotalAfterDiscount) + Number(calcTaxRate)).toFixed(2));    
    // }
    return receipt;
  };

  // Handle individual checkbox change
  const handleReceiptCheckBoxChange = (id: number) => {
    const items = formData.receipt_details;
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((items) => items !== id) : [...prev, id]
    );
  };

  // Handle "Check All" checkbox
  const handleCheckAllChange = () => {
    const items = formData.receipt_details;
    if (isAllChecked) {
      setCheckedItems([]); // Uncheck all
    } else {
      setCheckedItems(items.map((item) => item.id)); // Check all
    }
  };

  return (
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('PATIENT.SIDE_MENU.RECEIPT')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">
        <Col xs={7} className="mt-3 mb-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createReceipt}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              <Dropdown.Item><i className="fi fi-rr-print"></i> {t('ACTIONS.PRINT_LETTER')}</Dropdown.Item>
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
          onRowDblClick={receiptDblClick}
          onRowClick={receiptClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>

      <ReceiptForm 
        ref={dynamicFormRefApp}
        formLabels={translatedElements}
        formData={formData}
        initialValues={initialValues}        
        editID = {selectedInvoice}
        refreshForm={refreshForm}
        show={show}
        mode={mode}
        handleClose={handleClose}
        handleTypeaheadInputChange={handleTypeaheadInputChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        formReset={formReset}
        fromSource={'Patients'}
        handleReceiptCheckBoxChange={handleReceiptCheckBoxChange}
        handleCheckAllChange={handleCheckAllChange}
        checkAll={isAllChecked}
        checkedItems={checkedItems}
      />
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </PatientLayout>
  );
};


export default Receipt;
