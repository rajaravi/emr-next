import React, { useEffect, useRef, useState } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
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
import { ContactFormElements } from '@/data/ContactFormElements';
import { ContactModel } from '@/types/contact';

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  designation_id: 0,
  firstname: '',
  surname: '',
  organization: '',
  profession_id: 0,
  address1: '',
  address2: '',
  address3: '',
  county: '',
  eircode: '',
  phone: '',
  mobile: '',
  email: '', 
  is_archive: 0
};

const Contact: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('SETTING.CONTACT.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('SETTING.CONTACT.FIRSTNAME'), class: "col-sm-2", field: "firstname"},
    { name: t('SETTING.CONTACT.SURNAME'), class: "col-sm-2", field: "surname"},
    { name: t('SETTING.CONTACT.ORGANIZATION'), class: "col-sm-3", field: "organization"},
    { name: t('SETTING.CONTACT.MOBILE'), class: "col-sm-2", field: "mobile"},
    { name: t('SETTING.CONTACT.ARCHIVE'), class: "col-sm-2", field: "is_archive"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.CONTACT.FIRSTNAME'), field: 'firstname' },
    { name: t('SETTING.CONTACT.SURNAME'), field: 'surname' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedContact, setSelectedContact] = useState<number>(0);
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

  const initialFormData: ContactModel = {
    "id": null,
    "designation_id": 1,
    "firstname": "",
    "surname": "",
    "organization": "",
    "profession_id": 0,
    "address1": "",
    "address2": "",
    "address3": "",
    "county": "",
    "eircode": "",
    "phone": "",
    "mobile": "",
    "email": "",
    "is_archive": false
  };
  const [formData, setFormData] = useState<ContactModel>(initialFormData);
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
    const translatedFormElements = ContactFormElements.map((element) => ({
      ...element,
      label: t('SETTING.CONTACT.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchContactList(page);
  }, []);

  // Get doctor list
  const fetchContactList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_CONTACT_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load contact data.');
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
        fetchContactList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchContactList(1);
    setClear(false);
  }

  // List double click
  const contactDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedContact(selectedID);
    }
    getContactById('edit');
  }

  // List single click
  const contactClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedContact(selectedID);
  }

  // Edit action call
  const createContact = () => {
    getContactById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedContact == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getContactById('edit');
  } 
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  // Get form data
  const getContactById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedContact;
      let passData: string = JSON.stringify({ id: editID });      
      const response = await execute_axios_post(ENDPOINTS.POST_CONTACT_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
        // Designations options assign
        let designation = new Array;
        if(response.data.designations) {
            response.data.designations.map((design: any, s: number) => {
            designation.push({'label':design.description, 'value': design.id});
          })
        }

        // Speciality options assign
        let profession = new Array;
        if(response.data.professions) {
          response.data.professions.map((spec: any, s: number) => {
            profession.push({'label':spec.name, 'value': spec.id});
          })
        }

        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'designation_id') {
            elements.options = [];
            elements.options = designation;
          }
          if(elements.name == 'profession_id') {
            elements.options = [];
            elements.options = profession;
          }
        })
      }
    } catch (error: any) {
        console.error('Error on fetching contact details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_CONTACT_STORE, formData);
        handleShowToast(t('SETTING.CONTACT.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating notes:', error);
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
  const handleArchive = async(event: any) => {
    showLoading();
    try {
      archiveID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: archiveID, is_archive: event.target.checked });
      const response = await execute_axios_post(ENDPOINTS.POST_CONTACT_ARCHIVE, passData);      
      if(response.success) { 
        if(event.target.checked === true) {
          handleShowToast(t('SETTING.MESSAGES.UNARCHIVE'), 'dark');
        }
        if(event.target.checked === false) {
          handleShowToast(t('SETTING.MESSAGES.ARCHIVE'), 'success');
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
    setSelectedContact(0);
    setPage(currentPage);
    fetchContactList(currentPage, searchFilter);
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
        <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.CONTACT')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createContact}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={contactDblClick}
          onRowClick={contactClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.CONTACT.EDIT_TITLE') : t('SETTING.CONTACT.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="50%">

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
export default Contact;