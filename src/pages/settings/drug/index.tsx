import React, { useEffect, useRef, useState } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown, Form } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { DrugFormElements } from '@/data/DrugFormElements';
import { DrugModel } from '@/types/drug';

let pageLimit: number = 8;
let selectedID: number = 0;
let deleteID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  category_id: 0,
  code: '',
  bar_code: '',
  gms_number: '',
  trade_name: '',
  pack_size : '',
  pack_size_number: '',
  pack_size_units : '',
  manufacturer: '',
  agent: '',
  ingredient_cost : '',
  retail_price: '',
  vat: '',
  vat_change: '',
  coschange : '',
  poison_classification: '',
  product_authorisation: '',
  EHBLTINO: '',
  generic_name: '',
  drug_date : '',
  warning_code: '',
  ingred1: '',
  ingred2: '',
  ATC1 : '',
  ATC2 : '',
  dentist: '',
  counsel_code: '',
  strength: '',
  drug_from : '',
  ingredient1: '',
  ingredient2: '',
  ingredient3: '',
  ingredient4: '',
  ingredient5: '',
  ingredient6: '',
  ingredient7: '',
  ingredient8: '',
  ingredient9: '',
  ingredient10: '',
  IATC1: '',
  IATC2: '',
  IATC3: '',
  IATC4: '',
  IATC5: '',
  IATC6: '',
  IATC7: '',
  IATC8: '',
  IATC9: '',
  IATC10: '',
};

const Drug: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('SETTING.DRUG.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('SETTING.DRUG.CODE'), class: "col-sm-2", field: "code"},
    { name: t('SETTING.DRUG.TRADE_NAME'), class: "col-sm-3", field: "trade_name"},
    { name: t('SETTING.DRUG.GENERIC_NAME'), class: "col-sm-3", field: "generic_name"},
    { name: t('SETTING.DRUG.MANUFACTURER'), class: "col-sm-3", field: "manufacturer"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.DRUG.NAME'), field: 'name' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedIncomeCategory, setSelectedDrug] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: DrugModel = {
    "id": null,
    "category_id": 0,
    "code": "",
    "bar_code": "",
    "gms_number": "",
    "trade_name": "",
    "pack_size": "",
    "pack_size_number": "",
    "pack_size_units": "",
    "manufacturer": "",
    "agent": "",
    "ingredient_cost": "",
    "retail_price": "",
    "vat": "",
    "vat_change": "",
    "coschange": "",
    "poison_classification": "",
    "product_authorisation": "",
    "EHBLTINO": "",
    "generic_name": "",
    "drug_date": "",
    "warning_code": "",
    "ingred1": "",
    "ingred2": "",
    "ATC1": "",
    "ATC2": "",
    "dentist": "",
    "counsel_code": "",
    "strength": "",
    "drug_from": "",
    "ingredient1": "",
    "ingredient2": "",
    "ingredient3": "",
    "ingredient4": "",
    "ingredient5": "",
    "ingredient6": "",
    "ingredient7": "",
    "ingredient8": "",
    "ingredient9": "",
    "ingredient10": "",
    "IATC1": "",
    "IATC2": "",
    "IATC3": "",
    "IATC4": "",
    "IATC5": "",
    "IATC6": "",
    "IATC7": "",
    "IATC8": "",
    "IATC9": "",
    "IATC10": "",
  };
  const [formData, setFormData] = useState<DrugModel>(initialFormData);
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = DrugFormElements.map((element) => ({
      ...element,
      label: t('SETTING.DRUG.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchDrugList(page);
  }, []);

  // Get doctor list
  const fetchDrugList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_DRUG_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load income category data.');
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
        fetchDrugList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchDrugList(1);
    setClear(false);
  }

  // List double click
  const drugPathwayDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedDrug(selectedID);
    }
    getDrugById('edit');
  }

  // List single click
  const drugPathwayClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedDrug(selectedID);
  }

  // Edit action call
  const createDrug = () => {
    getDrugById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedIncomeCategory === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getDrugById('edit');
  } 
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });    
  };  

  // Get form data
  const getDrugById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedIncomeCategory;
      let passData: string = JSON.stringify({ id: editID });      
      const response = await execute_axios_post(ENDPOINTS.POST_DRUG_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
      }
    } catch (error: any) {
        console.error('Error on fetching income category details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_DRUG_STORE, formData);
        handleShowToast(t('SETTING.DRUG.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating income category:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      handleClose(); // Close offcanvas after saving
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

  // Archive action call
  const handleDelete = async(event: any) => {
    showLoading();
    try {
      deleteID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: selectedID });
      const response = await execute_axios_post(ENDPOINTS.POST_DRUG_DELETE, passData);      
      if(response.success) { 
        handleShowToast(t('SETTING.MESSAGES.DELETE'), 'success');
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching income category details:', error);
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
    setSelectedDrug(0);
    setPage(currentPage);
    fetchDrugList(currentPage, searchFilter);
  }

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-bs-pills"></i> {t('SETTING.SIDE_MENU.DRUG')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createDrug}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}><i className="fi fi-rr-trash"></i> {t('ACTIONS.DELETE')}</Dropdown.Item>
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
          onRowDblClick={drugPathwayDblClick}
          onRowClick={drugPathwayClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleDelete}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.DRUG.EDIT_TITLE') : t('SETTING.DRUG.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="30%">     
        <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/>
        
      </OffcanvasComponent>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </SettingLayout>
  );
};
export default Drug;
