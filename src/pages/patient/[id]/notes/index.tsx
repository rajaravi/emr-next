import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { uuidToId } from '@/utils/helpers/uuid';
import { NoteFormElements } from '@/data/NoteFormElements';
import { NoteModel } from '@/types/note';

let pageLimit: number = 6;
let selectedID: number = 0;
let statusID: number = 0;
const todayDate = new Date().toISOString().split('T')[0];

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

const initialValue = {
  id: 0,
  patient_id: 0,
  date: todayDate, 
  notes: '', 
  status_id: 0
};

const Note: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const patientId = id ? uuidToId(id) : 0;

  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('PATIENT.NOTE.SNO'), class: "col-sm-1", field: "sno", format: ""},
    { name: t('PATIENT.NOTE.DATE'), class: "col-sm-2", field: "date", format: "date"},
    { name: t('PATIENT.NOTE.NOTES'), class: "col-sm-3", field: "notes", format: ""}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.NOTE.NOTES'), field: 'notes' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedNotes, setSelectedNotes] = useState<number>(0);
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

  const initialFormData: NoteModel = {
    "id": null,
    "patient_id": 0,
    "date": todayDate,
    "notes": "",    
    "status_id": 0
  };
  const [formData, setFormData] = useState<NoteModel>(initialFormData);
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
    const translatedFormElements = NoteFormElements.map((element) => ({
      ...element,
      label: t('PATIENT.NOTE.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchNotesList(page);
  }, []);

  // Get doctor list
  const fetchNotesList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter, patient_id: uuidToId(id) });
      const response = await execute_axios_post(ENDPOINTS.POST_NOTE_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load encounter data.');
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
        fetchNotesList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchNotesList(1);
    setClear(false);
  }

  // List double click
  const noteDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedNotes(selectedID);
    }
    getNoteById('edit');
  }

  // List single click
  const noteClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedNotes(selectedID);
  }

  // Edit action call
  const createNote = () => {    
    getNoteById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedNotes === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getNoteById('edit');
  } 
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });    
  };  

  // Get form data
  const getNoteById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedNotes;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_NOTE_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
        let status = new Array;
        if(response.data.statuses) {
          response.data.statuses.map((stat: any, s: number) => {
            status.push({'label': stat.description, 'value': stat.id});
          })
        }     
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'status_id') {
            elements.options = [];
            elements.options = status;
          }
        })
      }
    } catch (error: any) {
        console.error('Error on fetching notes details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        formData.patient_id = patientId;
        const response = await execute_axios_post(ENDPOINTS.POST_NOTE_STORE, formData);
        handleShowToast(t('PATIENT.NOTE.MESSAGES.SAVE_SUCCESS'), 'success');
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

  // Delete action call
  const handleDelete = async(event: any) => {
    if(selectedNotes === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    showLoading();
    try {
      statusID = event.target.getAttribute('custom-id');
      let passData: string = JSON.stringify({ id: selectedID });
      const response = await execute_axios_post(ENDPOINTS.POST_NOTE_DELETE, passData);      
      if(response.success) { 
        handleShowToast(t('SETTING.MESSAGES.DELETE'), 'success');
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching notes details:', error);
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
    setSelectedNotes(0);
    setPage(currentPage);
    fetchNotesList(currentPage, searchFilter);
  }

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-journal-alt"></i> {t('PATIENT.SIDE_MENU.NOTES')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createNote}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={noteDblClick}
          onRowClick={noteClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleDelete}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('PATIENT.NOTE.EDIT_TITLE') : t('PATIENT.NOTE.CREATE_TITLE') }
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
    </PatientLayout>
  );
};
export default Note;
