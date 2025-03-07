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
import { AppintmentServiceFormElements } from '@/data/AppintmentServiceFormElements';
import { AppointmentServiceModel } from '@/types/appointment-service';

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();
const initialValue = {
  name: '',
  code: '',
  fee: '',
  duration: 0,
  color_code: '',
  is_available_online: 0,
  notes: '',
  appointment_type_details: [
    { doctor_id: 0, location_id: 0, fee: '', duration: 0 },
  ],
  is_archive: 0
};

const AppointmentService: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; }[] = [
    { name: t('SETTING.APPOINTMENT_SERVICE.SNO'), class: "col-sm-1", field: "sno"},
    { name: t('SETTING.APPOINTMENT_SERVICE.CODE'), class: "col-sm-2", field: "code"},
    { name: t('SETTING.APPOINTMENT_SERVICE.NAME'), class: "col-sm-5", field: "name"},
    { name: t('SETTING.APPOINTMENT_SERVICE.FEE'), class: "col-sm-2", field: "fee"},
    { name: t('SETTING.APPOINTMENT_SERVICE.ARCHIVE'), class: "col-sm-2", field: "is_archive"}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.APPOINTMENT_SERVICE.NAME'), field: 'name' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedAppointmentService, setSelectedAppointmentService] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [doctorList, setDoctorList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: AppointmentServiceModel = {
    "id": null,
    "name": "",
    "code": "",
    "fee": "",
    "duration": 0,
    "color_code": "",
    "is_available_online": false,
    "notes": "",
    "appointment_type_details": [
        { "doctor_id": 0, "location_id": 0, "fee": "", "duration": 0 }
    ],
    "is_archive": false
  };
  const [formData, setFormData] = useState<AppointmentServiceModel>(initialFormData);
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
    const translatedFormElements = AppintmentServiceFormElements.map((element) => ({
      ...element,
      label: t('SETTING.APPOINTMENT_SERVICE.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchDoctorList();
    fetchProcedureList(page);
  }, []);

  // Get procedure list
  const fetchProcedureList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_SERVICE_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load appointment service data');
    } finally {
      hideLoading();
    }
  };

  // Get doctor list
  const fetchDoctorList = async () => {
    try {
      const response = await execute_axios_post(ENDPOINTS.GET_DOCTOR_LIST, []);
      setDoctorList(response.data);
    } catch (err) {
      setError('Failed to load doctor data');
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
      fetchProcedureList(1,sFilter);
      setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchProcedureList(1);
    setClear(false);
  }

  // List double click
  const appointmentServiceDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedAppointmentService(selectedID);
    }
    getAppointmentServiceById('edit');
  }

  // List single click
  const appointmentServiceClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedAppointmentService(selectedID);
  }

  // Create action call
  const createProcedure = () => {
    getAppointmentServiceById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedAppointmentService === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getAppointmentServiceById('edit');
  }

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    if (index !== undefined) {
      const updateAppType = [...formData.appointment_type_details];
      updateAppType[index] = {
        ...updateAppType[index], [name]: value
      };
      const updatedFormData = { ...formData, appointment_type_details: updateAppType };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  // Get form data
  const getAppointmentServiceById = async (type: string) => {
    try {
      let editID = 0;
      if(type == 'edit') editID = selectedAppointmentService;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_SERVICE_FORMDATA, passData);
      if(response.success) {
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
      }
    } catch (error: any) {
        console.error('Error on fetching appointment service details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_SERVICE_STORE, formData);
        if(response.success) {
          handleShowToast(t('SETTING.APPOINTMENT_SERVICE.MESSAGES.SAVE_SUCCESS'), 'success');
        }
      } catch (error) {
        console.error('Error updating appiontment service:', error);
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
      const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_SERVICE_ARCHIVE, passData);
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
      console.error('Error on fetching appointment service details:', error);
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
    setSelectedAppointmentService(0);
    setPage(currentPage);
    fetchProcedureList(currentPage, searchFilter);
  }

  // Function to add a new reference row
  const handleAddAppointmentDetails = () => {
    const newAppType = { doctor_id: 0, location_id: 0, fee: '', duration: 0 };
    setFormData({
      ...formData,
      appointment_type_details: [...formData.appointment_type_details, newAppType],
    });
  }

  // Function to remove a reference row
  const handleRemoveAppointmentDetails = (index: number) => {
    const updateAppType = formData.appointment_type_details.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, appointment_type_details: updateAppType };
    setFormData(updatedFormData);
  }

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  }
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb- module-title`}><i className="fi fi-rr-calendar-minus"></i> {t('SETTING.SIDE_MENU.APPOINTMENT_SERVICE')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createProcedure}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={appointmentServiceDblClick}
          onRowClick={appointmentServiceClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.APPOINTMENT_SERVICE.EDIT_TITLE') : t('SETTING.APPOINTMENT_SERVICE.CREATE_TITLE') }
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

        <Container>
          <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={handleAddAppointmentDetails}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
          <Table>
            <thead>
              <tr>
                <th className={`${styles.tableGridHead} col-sm-6`}>{t('SETTING.APPOINTMENT_SERVICE.CONSULTANT')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.APPOINTMENT_SERVICE.DURATION')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.APPOINTMENT_SERVICE.RATE')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}></th>
              </tr>
            </thead>
            <tbody>            
              {formData.appointment_type_details.map((appType, index) => (
                <tr key={index} style={{borderStyle: 'hidden'}}>
                  <td>
                    <Form.Select
                      name="doctor_id"
                      id={`doctor_id-${index}`}
                      className="rounded-0"
                      value={appType.doctor_id}
                      onChange={(e) => handleInputChange(e, index)}>
                        <option value="">Select...</option>
                        {doctorList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.name}</option>
                        ))}
                    </Form.Select>
                  </td>                  
                  <td>
                    <Form.Control
                      type="text"
                      name="duration"
                      id={`duration-${index}`}
                      placeholder="Duration"
                      value={appType.duration}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="fee"
                      id={`fee-${index}`}
                      placeholder="Rate"
                      value={appType.fee}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Button className="text-danger rounded-0" variant="" onClick={() => handleRemoveAppointmentDetails(index)}><i className="fi fi-br-trash"></i></Button>
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
export default AppointmentService;
