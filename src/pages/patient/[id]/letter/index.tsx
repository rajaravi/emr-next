import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post, execute_axios_get } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown, Container } from 'react-bootstrap';
// Translation logic - start
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-documenteditor/styles/material.css';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { uuidToId } from '@/utils/helpers/uuid';
import { LetterFormElements } from '@/data/LetterFormElements';
import { LetterModel } from '@/types/letter';

DocumentEditorContainerComponent.Inject(Toolbar);

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
let savedData: string = '';
const todayDate = new Date().toISOString().split('T')[0];
let heidiToken: string = '';

const initialValue = {
  patient_id: 0,
  encounter_id: 0,
  doctor_id: 0,
  category_id: 0,
  template_id: 0,  
  description: '',
  date: todayDate,
  module_type_id: '',
  module_id:'',
  content: ''
};

const Letter: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = id ? uuidToId(id) : 0;
  
  const columns: { name: string; class: string; field: string; format?: string }[] = [
    { name: t('PATIENT.LETTER.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('PATIENT.LETTER.DATE'), class: "col-sm-2", field: "date", format:'date'},
    { name: t('PATIENT.LETTER.TEMPLATE'), class: "col-sm-3", field: "template.name"},
    { name: t('PATIENT.LETTER.ENCOUNTER'), class: "col-sm-2", field: "encounter.name"},
    { name: t('PATIENT.LETTER.DOCTOR'), class: "col-sm-2", field: "doctor.name", format:''},
    { name: t('PATIENT.LETTER.CATEGORY'), class: "col-sm-2", field: "category.name"}    
  ];

  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.LETTER.DATE'), field: 'date' }
  ];

  const [token, setToken] = useState<string>('');
  const [show, setShow] = useState(false);
  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);  
  const [total, setTotal] = useState<number>(0);  
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);  
  const [list, setList] = useState<any>([]);  
  const [selectedAppointment, setSelectedLetter] = useState<number>(0);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [doctor, setDoctor] = useState<string>('');
  const [template, setTemplate] = useState<string>('');
  const editorContainerRef = useRef<DocumentEditorContainerComponent | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
    
  const initialFormData: LetterModel = { 
    "id": null,
    "patient_id": 0,
    "encounter_id": 0,
    "doctor_id": 0,
    "category_id": 0,
    "template_id": 0,    
    "description": "",
    "date": todayDate,
    "module_type_id": "",
    "module_id": "",
    "content": ""
  };

  const [formData, setFormData] = useState<LetterModel>(initialFormData);

  // Load the document into the editor once everything is ready
  const loadEditorData = useCallback(() => {
    console.log('in savedData',savedData);
    if (editorContainerRef.current && savedData) {
      console.log('cond savedData',savedData);
      editorContainerRef?.current.documentEditor.open(savedData);
      console.log('Document loaded successfully after form rendering.');
    }
  }, [savedData]);

  const handlePrint = () => {
    if (editorContainerRef.current) {
      editorContainerRef.current.documentEditor.print();      
    }
  }
 

  // Onload function
  useEffect(() => {
    
    if (isEditorReady && savedData) {
      loadEditorData();
    } 
    // Language apply for form label
    const filteredElements = LetterFormElements.filter((element) => element.name !== "patients");
    const translatedFormElements = filteredElements.map((element) => {
      return {
        ...element,
        label: t(`PATIENT.LETTER.${element.label}`),
      };
    });
    setTranslatedElements(translatedFormElements);
    fetchLetterList(page);

    
    // HeidiHealth Wizard code 
    getHeidiToken();

  }, []);

  const getHeidiToken = async() => {
    try {
      let passData = {"headers": {'Heidi-Api-Key': 'UtYBmtHHIalLporO5dIgSQw8oJK7JALh' }};
      execute_axios_get('https://registrar.api.heidihealth.com/api/v2/ml-scribe/open-api/jwt?email='+(Math.random() + 1).toString(36).substring(7)+'@mail.ie&third_party_internal_id='+(Math.random() + 1).toString(36).substring(7), passData)
        .then(response => {
            console.log('response?==', response);
            setToken(response.token);
            heidiToken = response.token;
          }
        )
        .catch(error => {
          console.error("Error:", error);
          throw error; // ✅ Re-throw for handling
        }
      );      
    } catch (err) {
      // setError('Failed to load doctor data.');
    } 
  }; 
  const templateData = {
    content: '...',
    responses: [
      {
        questionId: '...',
        question: '...',
        answerType: '...',
        answerOptions: ['...', '...'],
      },
    ],
  };
  
  function openHeidiWithTemplate() {
    Heidi.open({ template: templateData });
  }
  
  function openHeidi() {    
    Heidi.open();
  }
  
  function closeHeidi() {
    Heidi.close();
  }

  // Get doctor list
  const fetchLetterList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter, patient_id: uuidToId(id) });
      const response = await execute_axios_post(ENDPOINTS.POST_LETTER_LIST, passData);
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
      fetchLetterList(1,sFilter);
      setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchLetterList(1);
    setClear(false);
  }

  // List double click
  const letterDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedLetter(selectedID);
    }
    getLetterId('edit');
  }

  // List single click
  const letterClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedLetter(selectedID);
  }

  // Edit action call
  const createLetter = () => {    
    getLetterId('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedAppointment == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getLetterId('edit');
  } 

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    if(name == 'doctor_id') {    
      setDoctor(value);
      getLetterContent(value, template, '');
    }
    if(name == 'template_id') {
      setTemplate(value);
      getLetterContent(doctor, value, '');      
    }    
    setFormData({ ...formData, [name]: value });    
  };

  // Archive action call
  const handleArchive = async(event: any) => {
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
    setSelectedLetter(0);
    setPage(currentPage);
    fetchLetterList(currentPage, searchFilter);
  }
 
  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const getLetterId = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedAppointment;
      let passData: string = JSON.stringify({ id: editID, patient_id: patientId });      
      showLoading();
      const response = await execute_axios_post(ENDPOINTS.POST_LETTER_FORMDATA, passData);
      if(response.success) {
        handleShow();
        if(response.data?.data?.id) {          
          setMode(true);
          const formData = response.data?.data;
          if(response.data.data.content) {            
            savedData = JSON.parse(response.data.data.content);
            // console.log('savedData',savedData);
            // loadEditorData();            
            setDoctor(response.data.data.doctor_id);
            setTemplate(response.data.data.template_id);
            getLetterContent(response.data.data.doctor_id, response.data.data.template_id, 'edit');            
          }          
          setInitialValues(formData);
          setFormData(formData);          
          
        } else {          
          setFormData(initialFormData);
        }
        let encounter = new Array;
        if(response.data.encounters) {
          response.data.encounters.map((enc: any, a: number) => {
            if(enc.patient_id === patientId ) {
              encounter.push({'label':enc.name, 'value': enc.id});
            }
          })
        }
        let doctor = new Array;
        if(response.data.doctors) {
          response.data.doctors.map((doc: any, d: number) => {
            doctor.push({'label':doc.name, 'value': doc.id});
          })
        }
        let category = new Array;
        if(response.data.categories) {
          response.data.categories.map((cate: any, s: number) => {
            category.push({'label':cate.name, 'value': cate.id});
          })
        }
        let template = new Array;
        if(response.data.templates) {
          response.data.templates.map((app: any, a: number) => {
            template.push({'label':app.name, 'value': app.id});
          })
        }
        
        
        // setProcedureList(response.data.procedures);

        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'doctor_id') {
            elements.options = [];
            elements.options = doctor;
          }
          else if(elements.name == 'category_id') {
            elements.options = [];
            elements.options = category;
          }
          else if(elements.name == 'status_id') {
            elements.options = [];
            elements.options = status;
          }
          else if(elements.name == 'template_id') {
            elements.options = [];
            elements.options = template;
          }
          else if(elements.name == 'encounter_id') {
            elements.options = [];
            elements.options = encounter;
          }
        })
      }
      // getHeidiToken();
      startHeidi();
      hideLoading();
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
        hideLoading();
    }    
  }

  const startHeidi = () => {
    const heidiOptions = {
      token: token,
      target: '#heidi',
      language: "en",
      onInit: () => {
        // Display the UI that will trigger Heidi
        document
          .querySelectorAll('.heidi-button')
          .forEach((button) => (button.style.display = 'block'));
      },
      onReady: () => {
        Heidi.onPushData((data: any) => {
          // data.notesData will contain data generated by Heidi
          // if a template was used, it will contain the result
          // using the Template structure above
          console.log(data);
          const editorInstance = editorContainerRef.current?.documentEditor;
          if (editorInstance) {
            editorInstance.editor.insertText(data.noteData);
          }          
        });
  
        Heidi.onSessionStarted((sessionId: any) => {
          // sessionId is the ID of the current Heidi Session.
        });
      },
    };
    
    if (typeof window !== "undefined") { // Ensure it runs only in the browser
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://registrar.widget.heidihealth.com/staging/widget/heidi.js";
      
      script.onload = () => {
        if (window.Heidi) {
          new window.Heidi(heidiOptions); // Initialize Heidi widget with options
        }
      };

      document.head.appendChild(script);

      // Cleanup: Remove script when component unmounts (optional)
      return () => {
        document.head.removeChild(script);
      };
    }
  }
  const handleShow = () => {
    setShow(true);   
  }
  const handleClose = () => {
      setShow(false);
      setMode(false);
      // closeHeidiWidget();
  }

  // Save button handler
  const handleSave = async () => {
    // console.log(formData);
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        if (editorContainerRef.current) {
          const editor = editorContainerRef.current.documentEditor.serialize();
          formData.content = editor;
        }
        formData.patient_id = patientId;
        const response = await execute_axios_post(ENDPOINTS.POST_LETTER_STORE, formData);
        if(response.success) {
          handleShowToast(t('PATIENT.LETTER.MESSAGES.SAVE_SUCCESS'), 'success');
          handleClose();
        }
      } catch (error) {
        console.error('Error creating an appointment:', error);
      } finally {
          // closeHeidiWidget();
          hideLoading();
          refreshForm();
      }
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

  const getLetterContent = async (doctor: string, template: string, mode: string) => {   
    if (doctor && template) {
      try {
        let passData: string = JSON.stringify({ template_id: template, patient_id: patientId, doctor_id: doctor  });
        const result = await execute_axios_post(ENDPOINTS.POST_LETTER_GETCONTENT, passData);
        if(mode == 'edit') {
          loadEditorContent()
        }
        else {
          savedData = result.data;   
          loadEditorData()
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    } 
  }; 
  const loadEditorContent = () => {    
    loadEditorData();    
  }; 
  

  const handleEditorCreated = () => {
    setIsEditorReady(true);
  };

  function closeHeidiWidget() {
    const heidiWidget = document.querySelector("#heidi-widget"); // Replace with the actual ID/class
    if (heidiWidget) {
      heidiWidget.style.display = "none"; // Hide the widget
    }
  
    // Clear any input fields inside the widget
    const inputs = heidiWidget.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => (input.value = ""));
  
    // Clear any stored state if applicable
    localStorage.removeItem("heidiWidgetData"); // If data is stored in localStorage
  }
  
  return (
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('PATIENT.SIDE_MENU.LETTERS')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">
        <Col xs={7} className="mt-3 mb-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createLetter}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
              <Dropdown.Item><i className="fi fi-rr-print"></i> {t('ACTIONS.PRINT')}</Dropdown.Item>
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
          onRowDblClick={letterDblClick}
          onRowClick={letterClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('PATIENT.LETTER.EDIT_TITLE') : t('PATIENT.LETTER.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="85%">
          <DynamicForm ref={dynamicFormRef}
            formData={translatedElements}
            initialValues={initialValues}
            formReset={formReset}
            onSubmit={handleSave}
            isEditMode={mode}
            modelFormInputs={handleInputChange}
          />
          <Container className='p-0'>                 
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
          { (mode === true) ? <Button onClick={handlePrint} className="btn btn-warning rounded-0 float-end me-2" style={{ position: 'absolute', bottom: '16px', right: '100px' }}>
              <i className="fi fi-rr-print"></i> Print
            </Button> : ''
          }
          { <Button onClick={openHeidi} className="btn btn-info rounded-0 float-end me-2" style={{ position: 'absolute', bottom: '16px', right: '100px' }}>
          <i className="fi fi-ss-circle-microphone"></i> Open Heidi
            </Button>
          }          
        </OffcanvasComponent>
        <div id="heidi-widget" style={{ width: "100%", height: "600px" }}></div> 
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


export default Letter;
