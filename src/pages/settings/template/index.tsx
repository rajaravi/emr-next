import React, { useEffect, useRef, useState, useCallback } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-documenteditor/styles/material.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';

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
import { TemplateFormElements } from '@/data/TemplateFormElements';
import { TemplateModel } from '@/types/template';

DocumentEditorContainerComponent.Inject(Toolbar);

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  name: '',
  doctor_id: 0,
  data: '',
  is_archive: 0
};

const Template: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('SETTING.TEMPLATE.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('SETTING.TEMPLATE.NAME'), class: "col-sm-8", field: "name"},
    { name: t('SETTING.TEMPLATE.ARCHIVE'), class: "col-sm-3", field: "is_archive"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.TEMPLATE.NAME'), field: 'name' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [placeholders, setPlaceholders] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
  // const editorContainerRef = useRef<DocumentEditorContainerComponent | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorContainerRef = useRef<DocumentEditorContainerComponent | null>(null);
  const [savedData, setSavedData] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('select');

  const initialFormData: TemplateModel = {
    "id": null,
    "name": "",
    "doctor_id": 0,
    "data": "",
    "is_archive": false
  };
  const [formData, setFormData] = useState<TemplateModel>(initialFormData);
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  // Load the document into the editor once everything is ready
  const loadEditorData = useCallback(() => {
    if (editorContainerRef.current && savedData) {
      editorContainerRef.current.documentEditor.open(savedData);
      console.log('Document loaded successfully after form rendering.');
    }
  }, [savedData]);

  useEffect(() => {
    if (isEditorReady && savedData) {
      loadEditorData();
    }
    // Language apply for form label
    const translatedFormElements = TemplateFormElements.map((element) => ({
      ...element,
      label: t('SETTING.TEMPLATE.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchTemplateList(page);    
  }, [isEditorReady, loadEditorData]);

  // Get doctor list
  const fetchTemplateList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_TEMPLATE_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load template data.');
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
        fetchTemplateList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchTemplateList(1);
    setClear(false);
  }

  // List double click
  const templateDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedTemplate(selectedID);
    }
    getTemplateById('edit');
  }

  // List single click
  const templateClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedTemplate(selectedID);
  }

  // Edit action call
  const createTemplate = () => {    
    getTemplateById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedTemplate === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getTemplateById('edit');
  } 
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });    
  };  

  // Get form data
  const getTemplateById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedTemplate;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_TEMPLATE_FORMDATA, passData);
      if(response.success) {        
        handleShow();       
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);   
        }
        setPlaceholders(response.data.placeholders);
        // Designations options assign
        let doctor = new Array;
        console.log('sdaasd',response.data.doctors);
        if(response.data.doctors) {
          response.data.doctors.map((doc: any, s: number) => {
            doctor.push({'label':doc.name, 'value': doc.id});
          })
        }
        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
        })
        if(response.data.data.data) {
          setSavedData(response.data.data.data);
        }
      }
    } catch (error: any) {
        console.error('Error on fetching template details:', error);
    }
  }  

  // Save button handler
  const handleSave = async () => {
    showLoading();    
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        if (editorContainerRef.current) {
          const editor = editorContainerRef.current.documentEditor.serialize();
          formData.data = editor;
        }        
        const response = await execute_axios_post(ENDPOINTS.POST_TEMPLATE_STORE, formData);
        handleShowToast(t('SETTING.TEMPLATE.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating template:', error);
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
      const response = await execute_axios_post(ENDPOINTS.POST_TEMPLATE_ARCHIVE, passData);      
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
        console.error('Error on fetching template details:', error);
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
    setSelectedTemplate(0);
    setPage(currentPage);
    fetchTemplateList(currentPage, searchFilter);
  }

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  // Mark editor as ready once it initializes
  const handleEditorCreated = () => {
    console.log('Editor is initialized.');
    setIsEditorReady(true);
  };

  const insertPlaceholders = () => {
    const editorInstance = editorContainerRef.current?.documentEditor;
    if (editorInstance && placeholder != 'select') {
      editorInstance.editor.insertText(placeholder);
    }
  };

  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-file-word"></i> {t('SETTING.SIDE_MENU.TEMPLATE')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createTemplate}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={templateDblClick}
          onRowClick={templateClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.TEMPLATE.EDIT_TITLE') : t('SETTING.TEMPLATE.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="90%">

        <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/>

        <Container className='p-0'>
          <Row className='mb-2'>
            <Col className='col-4'>
              <Form.Select className="rounded-0" id="placeHolders" value={placeholder} onChange={(e) => { setPlaceholder(e.target.value); }}>
                <option value='select'>Choose Placeholder</option>
                {
                  placeholders.map((p: any, k: number) => {                    
                    return (
                      <option key={k} value={p.description}>{p.description}</option>
                    );
                  })
                }
              </Form.Select>
            </Col>
            <Col className='col'>
              <Button className='btn-dark rounded-0' onClick={insertPlaceholders}>Add</Button>
            </Col>
          </Row>          
          <DocumentEditorContainerComponent
              id="container"
              height="570px"
              width="100%"
              serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
              enableToolbar={true} // Enable toolbar
              ref={editorContainerRef}              
              className="border"
              created={handleEditorCreated}
            />
        </Container>        
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
export default Template;
