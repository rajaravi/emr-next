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
import { ConsultantHousrFormElements } from '@/data/ConsultantHousrFormElements';
import { ConsultantHoursModel } from '@/types/consultant-hours';
import WeekDays from "./weekdays"; 

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();
const initialValue = {  
  description: '',
  consultant_id: 0,
  from_date: '',
  to_date: '',
  consultant_work_hour_details: [
    { 
      rowId: 1,
      description: '',
      location_id: 0,
      occurence_type_id: 0,
      occurence_value: 0,
      work_week_days: '',
      from_time: '',
      to_time: '' 
    }
  ]
};

interface RowData {
  id: number; // Unique ID for the row
  selectedItems: string[]; // Selected items in the row
  inputValue: string; // Comma-separated value for the row
}

const ConsultantHours: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; format?: string; }[] = [
    { name: t('SETTING.CONSULTANT_HOURS.SNO'), class: "col-sm-1", field: "sno", format: ""},
    { name: t('SETTING.CONSULTANT_HOURS.DESCRIPTION'), class: "col-sm-5", field: "description", format: ""},
    { name: t('SETTING.CONSULTANT_HOURS.FROM_DATE'), class: "col-sm-3", field: "from_date", format:'date'},
    { name: t('SETTING.CONSULTANT_HOURS.TO_DATE'), class: "col-sm-3", field: "to_date", format:'date'}, 
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.CONSULTANT_HOURS.DESCRIPTION'), field: 'description' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedProcedure, setSelectedProcedure] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);  
  const [locationList, setLocationList] = useState<any>([]);
  const [occurenceList, setoccurenceList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
  const [occType, setOccType] = useState<any>([]);

  const initialFormData: ConsultantHoursModel = {
    "id": null,    
    "description": '',
    "consultant_id": 0,
    "from_date": "",
    "to_date": "",
    "consultant_work_hour_details": [
      { 
        "id": null,
        "rowId": 1,
        "description": "",
        "location_id": 0,
        "occurence_type_id": 0,
        "occurence_value": 0,
        "work_week_days": "",
        "from_time": "",
        "to_time": ""
      }
    ]
  };

  const [formData, setFormData] = useState<ConsultantHoursModel>(initialFormData);
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
    const translatedFormElements = ConsultantHousrFormElements.map((element) => ({
      ...element,
      label: t('SETTING.CONSULTANT_HOURS.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchConsultantWorkHoursList(page);
  }, []);

  const fetchConsultantWorkHoursList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_CONSULTANT_HOURS_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load procedure data.');
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
        fetchConsultantWorkHoursList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchConsultantWorkHoursList(1);
    setClear(false);
  }

  // List double click
  const consultantWorkDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedProcedure(selectedID);
    }
    getConsultantWorkById('edit');
  }

  // List single click
  const consultantWorkClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedProcedure(selectedID);
  }

  // Edit action call
  const createConsultantWork = () => {    
    getConsultantWorkById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedProcedure === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getConsultantWorkById('edit');
  }

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    

    if (index !== undefined) {
      const updatePurchaser = [...formData.consultant_work_hour_details];
      updatePurchaser[index] = {
        ...updatePurchaser[index], [name]: value
      };

      const updatedFormData = { ...formData, consultant_work_hour_details: updatePurchaser };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    let occ_type: any = [];
    const consultant_work_hour_details = formData.consultant_work_hour_details;
    consultant_work_hour_details.forEach((v, i) => {
      occ_type[i] = v.occurence_type_id
    });
    setOccType(occ_type);
  };  

  const handleToggleChange = (item: any, updatedValue: any) => {
    const consultant_work_hour_details = [...formData.consultant_work_hour_details];
    consultant_work_hour_details[item.id-1] = {
        ...consultant_work_hour_details[item.id-1], ['work_week_days']: updatedValue.join(',')
    };
    const updatedFormData = { ...formData, consultant_work_hour_details: consultant_work_hour_details };
    setFormData(updatedFormData);
  }

  // Get form data
  const getConsultantWorkById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedProcedure;
      let passData: string = JSON.stringify({ id: editID });    
      const response = await execute_axios_post(ENDPOINTS.POST_CONSULTANT_HOURS_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }
        setLocationList(response.data.locations);
        setoccurenceList(response.data.occurence_types);

        let consultants = new Array;
        if(response.data.consultants) {
            response.data.consultants.map((cons: any, s: number) => {
            consultants.push({'label':cons.name, 'value': cons.id});
          })
        }
        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'consultant_id') {
            elements.options = [];
            elements.options = consultants;
          }
        })
      }
    } catch (error: any) {
        console.error('Error on fetching procedure details:', error);
    }
  }

  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_CONSULTANT_HOURS_STORE, formData);
        handleShowToast(t('SETTING.CONSULTANT_HOURS.MESSAGES.SAVE_SUCCESS'), 'success');
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
      const response = await execute_axios_post(ENDPOINTS.POST_CONSULTANT_HOURS_ARCHIVE, passData);      
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
        console.error('Error on fetching procedure details:', error);
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
    setSelectedProcedure(0);
    setPage(currentPage);
    fetchConsultantWorkHoursList(currentPage, searchFilter);
  }

  // Function to add a new reference row
  const handleAddPurchaser = () => {  
    // var table = document.getElementById("tblSlots");
    const table = document.getElementById('tblSlots') as HTMLTableElement;

    if (table) {
      const tBodies = table.tBodies;
      // You can now work with tBodies
      var tbodyRowCount = tBodies[0].rows.length;
      const newProcedure = { id: 0, description: '', location_id: 0, occurence_type_id: 0, occurence_value: 0, work_week_days: '', rowId: (tbodyRowCount+1), from_time: '', to_time: '' };
      setFormData({
        ...formData,
        consultant_work_hour_details: [...formData.consultant_work_hour_details, newProcedure],
      });
    }
  };

  // Function to remove a reference row
  const handleRemovePurchaser = (index: number) => {
    const updatePurchaser = formData.consultant_work_hour_details.filter((_, i) => i !== index);    
    const updatedFormData = { ...formData, consultant_work_hour_details: updatePurchaser };
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
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-calendar-clock"></i> {t('SETTING.SIDE_MENU.CONSULTANT_HOURS')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createConsultantWork}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
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
          onRowDblClick={consultantWorkDblClick}
          onRowClick={consultantWorkClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.CONSULTANT_HOURS.EDIT_TITLE') : t('SETTING.CONSULTANT_HOURS.CREATE_TITLE') }
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

        <Container fluid className='p-0'>
          <Button variant='primary' size='sm' className='rounded-0 float-end mb-2' onClick={handleAddPurchaser}><i className="fi fi-bs-plus"></i> {t('ACTIONS.ADDROW')}</Button>
          <Table id="tblSlots">
            <thead>
              <tr>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.CONSULTANT_HOURS.DESCRIPTION')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.CONSULTANT_HOURS.LOCATION')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.CONSULTANT_HOURS.OCCURENCE_TYPE')}</th>
                <th className={`${styles.tableGridHead} col-sm-1`}>{t('SETTING.CONSULTANT_HOURS.OCCURENCE_VALUE')}</th>
                <th className={`${styles.tableGridHead} col-sm-2`}>{t('SETTING.CONSULTANT_HOURS.WEEK_DAYS')}</th>
                <th className={`${styles.tableGridHead} col-sm-1`}>{t('SETTING.CONSULTANT_HOURS.FROM_TIME')}</th>
                <th className={`${styles.tableGridHead} col-sm-1`}>{t('SETTING.CONSULTANT_HOURS.TO_TIME')}</th>
                <th className={`${styles.tableGridHead} col-sm-1`}></th>
              </tr>
            </thead>
            <tbody>            
              {formData.consultant_work_hour_details.map((whours, index) => (                
                <tr key={index} style={{borderStyle: 'hidden'}}>
                  <td>
                    <Form.Control
                      type="hidden"
                      name="id"
                      id={`id-${index}`}
                      placeholder=""
                      value={whours.id?whours.id:''}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                    <Form.Control
                      type="text"
                      name="description"
                      id={`description-${index}`}
                      placeholder=""
                      value={whours.description}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Form.Select
                      name="location_id"
                      id={`location_id-${index}`}
                      className="rounded-0"
                      value={whours.location_id}
                      onChange={(e) => handleInputChange(e, index)}>
                        <option value="">Select...</option>
                        {locationList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.name}</option>
                        ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      name="occurence_type_id"
                      id={`occurence_type_id-${index}`}
                      className="rounded-0"
                      value={whours.occurence_type_id}
                      onChange={(e) => handleInputChange(e, index)}>
                        <option value="">Select...</option>
                        {occurenceList?.map((option: any, index: number) => (
                          <option key={index} value={option.id}>{option.description}</option>
                        ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="occurence_value"
                      id={`occurence_value-${index}`}
                      placeholder=""
                      value={whours.occurence_value}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <WeekDays 
                      selectedVal={whours.work_week_days} 
                      rowIndex={index+1} 
                      handleToggleChange={handleToggleChange}
                      disableMode={occType}
                      className={formData.consultant_work_hour_details[index].occurence_type_id ? formData.consultant_work_hour_details[index].occurence_type_id : whours.occurence_type_id}
                      dayInterval={formData.consultant_work_hour_details[index].occurence_value ? formData.consultant_work_hour_details[index].occurence_value : whours.occurence_value}
                    />                    
                  </td>
                  <td>
                    <Form.Control
                      type="time"
                      name="from_time"
                      id={`from_time-${index}`}
                      placeholder=""
                      value={whours.from_time}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="time"
                      name="to_time"
                      id={`to_time-${index}`}
                      placeholder=""
                      value={whours.to_time}
                      className="form-control rounded-0"
                      onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, index)}
                    />
                  </td>
                  <td>
                    <Button className="text-danger rounded-0" variant="" onClick={() => handleRemovePurchaser(index)}><i className="fi fi-br-trash"></i></Button>
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
export default ConsultantHours;
