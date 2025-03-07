import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
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
import { DoctorFormElements } from '@/data/DoctorFormElements';
import { DoctorModel } from '@/types/doctor';

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
    designation_id: 0,
    short_name: '',
    name: '',
    degree: '',
    speciality_id: 0,
    references: [
      { reference_id: 0, reference_value: '' },
    ],
    custom_fields: [
      { field: '', value: '' },
    ],
    contact_person: '',
    is_archive: 0
};

const Doctor: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('SETTING.DOCTOR.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('SETTING.DOCTOR.NAME'), class: "col-sm-3", field: "name"},
    { name: t('SETTING.DOCTOR.DEGREE'), class: "col-sm-3", field: "degree"},
    { name: t('SETTING.DOCTOR.CONTACT_PERSON'), class: "col-sm-3", field: "contact_person"},
    { name: t('SETTING.DOCTOR.ARCHIVE'), class: "col-sm-2", field: "is_archive"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.DOCTOR.NAME'), field: 'name' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [referenceList, setReferenceList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: DoctorModel = {
    "id": null,
    "designation_id": 1,
    "name": "",
    "short_name": "",
    "degree": "",
    "speciality_id": 0,
    "contact_person": null,
    "contact_no": "",
    "is_archive": false,
    "references": [
        { "reference_value": "", "reference_id": 0 }
    ],
    "custom_fields": [
        { "field": "", "value": "" }
    ]
  };
  const [formData, setFormData] = useState<DoctorModel>(initialFormData);
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  // Onload function
  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = DoctorFormElements.map((element) => ({
      ...element,
      label: t('SETTING.DOCTOR.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchReferenceList();
    fetchDoctorList(page);
  }, []);

  // Get doctor list
  const fetchDoctorList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_LIST, passData);
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
        fetchDoctorList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchDoctorList(1);
    setClear(false);
  }

  // List double click
  const doctorDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedDoctor(selectedID);
    }
    getDoctorById('edit');
  }

  // List single click
  const doctorClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedDoctor(selectedID);
  }

  // Edit action call
  const createDoctor = () => {    
    getDoctorById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedDoctor == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getDoctorById('edit');
  } 
  
  // Get reference list
  const fetchReferenceList = async () => {
    try {
      const response = await execute_axios_post(ENDPOINTS.GET_REREFENCE_LIST, []);
      setReferenceList(response.data);
    } catch (err) {
      setError('Failed to load reference data.');
    }
  }; 

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedReference = [...formData.references];
      updatedReference[index] = {
        ...updatedReference[index], [name]: value
      };
      const updatedCustomFields = [...formData.custom_fields];
      updatedCustomFields[index] = {
        ...updatedCustomFields[index], [name]: value
      };
      const updatedFormData = { ...formData, references: updatedReference, custom_fields: updatedCustomFields };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };  

  // Get form data
  const getDoctorById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedDoctor;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_FORMDATA, passData);
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
        let speciality = new Array;
        if(response.data.specialities) {
          response.data.specialities.map((spec: any, s: number) => {
            speciality.push({'label':spec.name, 'value': spec.id});
          })
        }
        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'designation_id') {
            elements.options = [];
            elements.options = designation;
          }
          if(elements.name == 'speciality_id') {
            elements.options = [];
            elements.options = speciality;
          }
        })
      }
    } catch (error: any) {
        console.error('Error on fetching doctor details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_STORE, formData);
        if(response.success) {
          handleShowToast(t('SETTING.DOCTOR.MESSAGES.SAVE_SUCCESS'), 'success');
        }
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
      const response = await execute_axios_post(ENDPOINTS.POST_DOCTOR_ARCHIVE, passData);      
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
    setSelectedDoctor(0);
    setPage(currentPage);
    fetchDoctorList(currentPage, searchFilter);
  }

  // Function to add a new reference row
  const handleAddReference = () => {
    const newReference = { reference_id: 0, reference_value: '' };
    setFormData({
      ...formData,
      references: [...formData.references, newReference],
    });
  };

  // Function to remove a reference row
  const handleRemoveReference = (index: number) => {
    const updatedReference = formData.references.filter((_, i) => i !== index);    
    const updatedFormData = { ...formData, references: updatedReference };
    setFormData(updatedFormData);
  };

  // Function to add a new custom field row
  const handleAddCustomFields = () => {
    const newCustomFields = { field: '', value: '' };
    setFormData({
      ...formData,
      custom_fields: [...formData.custom_fields, newCustomFields],
    });
  };

  // Function to remove a custom field row
  const handleRemoveCustomFields = (index: number) => {
    const updatedCustomFields = formData.custom_fields.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, custom_fields: updatedCustomFields };
    setFormData(updatedFormData);
  };

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-user-md"></i> {t('SETTING.SIDE_MENU.DOCTOR')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow ">
        <Col xs={7} className="mt-3 mb-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createDoctor}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={doctorDblClick}
          onRowClick={doctorClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.DOCTOR.EDIT_TITLE') : t('SETTING.DOCTOR.CREATE_TITLE') }
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

        <Container className='p-0'>
          <h5 className=' col-8 mt-2 mb-0 float-start'>{t('SETTING.DOCTOR.REFERENCES')}</h5>
          <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={handleAddReference}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
          <Table>
            <thead>
              <tr>
                <th className={`${styles.tableGridHead}`}>{t('SETTING.DOCTOR.REFERENCE')}</th>
                <th className={`${styles.tableGridHead}`}>{t('SETTING.DOCTOR.REFERENCE_NO')}</th>
                <th className={`${styles.tableGridHead}`}></th>
              </tr>
            </thead>
            <tbody>            
              {formData.references.map((referance, index) => (
                <tr key={index} style={{borderStyle: 'hidden'}}>
                  <td>
                    <Form.Select
                      name="reference_id"
                      id={`reference_id-${index}`}
                      className="rounded-0"
                      value={referance.reference_id}
                      onChange={(e) => handleInputChange(e, index)}>
                        <option value="">Select...</option>
                        {referenceList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.name}</option>
                        ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="reference_value"
                      id={`reference_value-${index}`}
                      placeholder="Reference value"
                      value={referance.reference_value}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Button className="text-danger rounded-0" variant="" onClick={() => handleRemoveReference(index)}><i className="fi fi-br-trash"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Container className='p-0'>
          <h5 className=' col-8 mt-2 mb-0 float-start'>{t('SETTING.DOCTOR.CUSTOM_FIELDS')}</h5>
          <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={handleAddCustomFields}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
          <Table>
            <thead>
              <tr>
                <th className={`${styles.tableGridHead}`}>{t('SETTING.DOCTOR.FIELD')}</th>
                <th className={`${styles.tableGridHead}`}>{t('SETTING.DOCTOR.VALUE')}</th>
                <th className={`${styles.tableGridHead}`}></th>
              </tr>
            </thead>
            <tbody>            
              {formData?.custom_fields?.map((cfield, index) => (
                <tr key={index} style={{borderStyle: 'hidden'}}>
                  <td>
                    <input
                      type="text"
                      name="field"
                      id={`field-${index}`}
                      placeholder="Field"
                      value={cfield.field}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="value"
                      id={`value-${index}`}
                      placeholder="Value"
                      value={cfield.value}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td>
                    <Button className="text-danger rounded-0" variant="" onClick={() => handleRemoveCustomFields(index)}><i className="fi fi-br-trash"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
export default Doctor;
