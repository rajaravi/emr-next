import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Dropdown, Container, Modal, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
import { execute_axios_post } from '@/utils/services/httpService';

import ModalPopUp from '@/components/core-components/ModalPopUp';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import PatientLayout from '@/components/layout/PatientLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { FormsModel, FormsTable, sampleFormRecords } from '@/types/forms';

// Translation logic - start
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import ToastNotification from '@/components/core-components/ToastNotification';
import { useLoading } from '@/context/LoadingContext';
import SubForm from './form';

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
// Translation logic - end

let pageLimit: number = 6;
let selectedID: number = 0;
let statusID: number = 0;

const initialFormData: FormsModel = {
  date: new Date(),
  form: '',
};

const admissionFormData = {
    patient_name: 'Brandon MacAtilla',
    dob: '30-10-1986',
    contact_no: '35388919008',
    doctor: 'James Caren',
    surgery_date: new Date('11-03-2025'),
    surgery_type: '',
}

const initialValues = {
  status: [],
  date: '1989-11-19',
  notes: ''
};

const Forms: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);  
  const [formData, setFormData] = useState<FormsModel>(initialFormData);
  const [formReset, setFormReset] = useState(false);
  const [list, setList] = useState<any>([]);
  const [selectedForm, setSelectedForm] = useState<number>(0);
  const [formType, setFormType] = useState<number>(0);
  const [formName, setFormName] = useState<string>('');
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [formList, setFormList] = useState<any>([]);  
  const [show, setShow] = useState(false);
  const [formShow, setFormShow] = useState(false);  
  const [clear, setClear] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('PATIENT.FORM.SNO'), class: "col-sm-1", field: "sno", format: ""},
    { name: t('PATIENT.FORM.DATE'), class: "col-sm-2", field: "date", format: "date"},
    { name: t('PATIENT.FORM.TYPE'), class: "col-sm-3", field: "form_type", format: ""},
    { name: t('PATIENT.FORM.NAME'), class: "col-sm-6", field: "name", format: ""}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.FORM.NAME'), field: 'name' }
  ];

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    // setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    handleShowToast('Notes saved successfully!', 'success');
    hideLoading();
    handleClose(); // Close offcanvas after saving
  };

  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  useEffect(() => {
    const fetchFormData = async () => {      
      setList(sampleFormRecords);      
    };
    fetchFormData();
  }, []);

  // Search button call
  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
  }

  // Edit action call
  const createForm = () => {
    setFormShow(true);    
  }

  // Edit action call
  const handleEdit = () => {
    if(selectedForm === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getFormById('edit');
  } 

  // List double click
  const formDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedForm(selectedID);
    }
    getFormById('edit');
  }

  // List single click
  const formClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedForm(selectedID);
  }

  // Get form data
  const getFormById = async (type: string) => {
    if(selectedID == 1) {
      setFormType(1);
      setFormName('Pre-Admission Form');
    }
    if(selectedID == 2) {
      setFormType(2);
      setFormName('VHI Claim Form');
    }
    if(type == 'edit') {
      setMode(true);
    }
    if(type == 'add') {
      setMode(false);
    }
    showLoading();    
    handleShow();
    hideLoading();
  }

  // Callback function for pagination change event
  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row'); // Selection row remove when the page change 
    listRows.forEach(function(row){
      row.classList.remove('selected');
    })
  }

  const handleFormType = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    selectedID = Number(e.target.value);
    setFormList([]);
    let form = new Array;
    if(selectedID == 1) {
      form.push({ 'name': 'Pre-Admission Form', 'value': 1});
    }
    if(selectedID == 2) {
      form.push({ 'name': 'VHI Claim Form', 'value': 2});
    }
    setFormList(form);
  }
  // Archive action call
  const handleArchive = async(event: any) => {
  }
  const closeModal = () => {
    setFormShow(false);
  }
  const saveForm = () => {
    getFormById('add');
    setFormShow(false);
  }
  
  

  return (
    <>
    <PatientLayout patientId={id as string}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-form"></i> {t('PATIENT.SIDE_MENU.FORMS')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createForm}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={formDblClick}
          onRowClick={formClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
        <SubForm   
          admissionData={admissionFormData}
          formName={formName}  
          show={show}
          mode={mode}
          formType={formType}
          handleSave={handleSave}
          handleClose={handleClose}
          handleInputChange={handleInputChange}
        />
        <Modal size='lg' show={formShow}>
          <Container className="my-4">
            <Row>
              <Col><h3 className='mb-1'>Add Form</h3></Col>
            </Row>
            <hr />
            <Row className='mb-3'>
              <Col xs={4}>
                <Form.Label>Date</Form.Label>
                <Form.Control type='date' className='rounded-0' onChange={handleInputChange} />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col xs={6}>
                <Form.Label>Encounter</Form.Label>
                <Form.Select className='rounded-0' onChange={handleInputChange}>
                  <option>Select</option>
                  <option>Follow up care</option>
                  <option>Checking</option>
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Label>Form Type</Form.Label>
                <Form.Select className='rounded-0' name='form_type' id='form_type' onChange={handleFormType}>
                  <option>Select</option>
                  <option value={1}>Admission</option>
                  <option value={2}>Insurance</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col xs={6}>
                <Form.Label>Template</Form.Label>
                <Form.Select className='rounded-0' name='template' onChange={handleInputChange}>
                  <option>Select</option>
                  {formList?.map((option: any, cIndex: number) => (
                    <option key={cIndex} value={option.id}>{option.name}</option>
                  ))}                 
                </Form.Select>
              </Col>
              <Col xs={6}>
                <Form.Label>Description</Form.Label>
                <Form.Control type='description' className='rounded-0' onChange={handleInputChange} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className='text-end'>
                <Button className='btn btn-light rounded-0 me-1' onClick={closeModal}><i className="fi fi-ss-circle-xmark"></i> Close</Button>
                <Button className='btn btn-success rounded-0' onClick={saveForm}><i className="fi fi-ss-disk"></i> Save</Button>
              </Col>
            </Row>
          </Container>
        </Modal>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </PatientLayout>      
    </>
  );
};

export default Forms;
